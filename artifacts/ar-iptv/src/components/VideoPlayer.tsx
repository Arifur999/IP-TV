import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface VideoPlayerProps {
  url: string;
  channelName: string;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function VideoPlayer({ url, channelName, onBack, onPrev, onNext }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;
    
    setError(false);
    setIsBuffering(true);

    if (!video || !url) return;

    const handlePlay = () => { setIsPlaying(true); setIsBuffering(false); };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => setError(true);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    if (Hls.isSupported() && url.includes('.m3u8')) {
      hls = new Hls({
        maxMaxBufferLength: 30,
        enableWorker: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("Auto-play blocked:", e));
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS error:", data);
          setError(true);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Auto-play blocked:", e));
      });
    } else {
      video.src = url;
    }

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [url]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group font-mono"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {error ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
          <div className="text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 mx-auto">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Stream Unavailable</h3>
          <p className="text-gray-400 mb-6">The broadcast source is currently offline or unreachable.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded border border-cyan-500/50 bg-cyan-950/30 px-6 py-2 text-cyan-400 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 rounded border border-gray-700 bg-gray-900 px-6 py-2 text-white hover:bg-gray-800 transition-all"
            >
              Back to Channels
            </button>
          </div>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onClick={togglePlay}
          />

          {isBuffering && !error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
              <LoadingSpinner />
            </div>
          )}

          {/* Top Overlay - Channel Info */}
          <div className={`absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 rounded-full bg-black/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_10px_rgba(0,229,255,0.5)] transition-all backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]" />
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live</span>
                </div>
                <h2 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">{channelName}</h2>
              </div>
            </div>
          </div>

          {/* Bottom Overlay - Controls */}
          <div className={`absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              
              {/* Left: Prev / Play / Next */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="p-2 text-white/70 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] disabled:opacity-30 transition-all"
                >
                  <SkipBack className="w-6 h-6" fill="currentColor" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:scale-110 hover:shadow-[0_0_25px_rgba(0,229,255,0.8)] transition-all"
                >
                  {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
                </button>

                <button 
                  onClick={onNext}
                  disabled={!onNext}
                  className="p-2 text-white/70 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] disabled:opacity-30 transition-all"
                >
                  <SkipForward className="w-6 h-6" fill="currentColor" />
                </button>
              </div>

              {/* Right: Volume / Fullscreen */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleMute}
                  className="p-2 text-white/80 hover:text-cyan-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 text-white/80 hover:text-cyan-400 transition-colors"
                >
                  <Maximize className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
