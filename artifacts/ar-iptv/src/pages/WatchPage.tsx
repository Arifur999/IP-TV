import { useParams, useLocation, Link } from "wouter";
import { getChannelById, getChannelsByCountry } from "@/lib/channels";
import VideoPlayer from "@/components/VideoPlayer";
import { Play } from "lucide-react";

export default function WatchPage() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  
  const id = Number(params.id);
  const channel = getChannelById(id);

  if (!channel) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl text-cyan-400 mb-4">Channel Not Found</h2>
        <Link href="/">
          <button className="rounded border border-cyan-500/50 bg-cyan-950/30 px-6 py-2 text-cyan-400 hover:bg-cyan-900/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
            Return Home
          </button>
        </Link>
      </div>
    );
  }

  const countryChannels = getChannelsByCountry(channel.countrySlug);
  
  // Find adjacent channels for prev/next buttons
  const currentIndex = countryChannels.findIndex(c => c.id === channel.id);
  const prevChannel = currentIndex > 0 ? countryChannels[currentIndex - 1] : null;
  const nextChannel = currentIndex < countryChannels.length - 1 ? countryChannels[currentIndex + 1] : null;

  return (
    <div className="flex h-[100dvh] w-full flex-col lg:flex-row bg-black font-mono overflow-hidden">
      
      {/* Main Video Area */}
      <div className="flex-1 relative bg-black shadow-[0_0_30px_rgba(0,229,255,0.1)] z-10">
        <VideoPlayer 
          url={channel.url} 
          channelName={channel.name}
          onBack={() => setLocation(`/country/${channel.countrySlug}`)}
          onPrev={prevChannel ? () => setLocation(`/watch/${prevChannel.id}`) : undefined}
          onNext={nextChannel ? () => setLocation(`/watch/${nextChannel.id}`) : undefined}
        />
      </div>

      {/* Sidebar: Channel List */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-cyan-500/20 bg-[#0a0a0a] flex flex-col h-[40dvh] lg:h-full z-0">
        <div className="p-4 border-b border-cyan-500/20 bg-[#111]">
          <h3 className="text-sm uppercase tracking-widest text-cyan-500/70 mb-1">More from</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">{channel.countryFlag}</span>
            <span className="font-bold text-lg text-white tracking-wide">{channel.country}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
          <div className="flex flex-col gap-1">
            {countryChannels.map((c) => {
              const isActive = c.id === channel.id;
              
              return (
                <button
                  key={c.id}
                  onClick={() => setLocation(`/watch/${c.id}`)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded text-left transition-all duration-300
                    ${isActive 
                      ? 'bg-cyan-950/40 border-l-2 border-cyan-400 shadow-[inset_4px_0_10px_rgba(0,229,255,0.2)]' 
                      : 'hover:bg-[#1a1a1a] border-l-2 border-transparent hover:border-cyan-500/50'
                    }
                  `}
                >
                  <span className={`font-medium truncate pr-2 ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}>
                    {c.name}
                  </span>
                  {isActive && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    </div>
                  )}
                  {!isActive && (
                    <Play className="w-3 h-3 text-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
