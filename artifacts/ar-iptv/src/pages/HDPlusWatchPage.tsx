import { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "wouter";
import VideoPlayer from "@/components/VideoPlayer";
import { useHdPlusCatalog } from "@/lib/channels";
import { Play } from "lucide-react";

const HD_PLUS_SESSION_KEY = "ar-iptv-hd-plus-unlocked";

export default function HDPlusWatchPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { data } = useHdPlusCatalog();
  const id = Number(params.id);

  const isUnlocked = sessionStorage.getItem(HD_PLUS_SESSION_KEY) === "true";
  const channels = data?.hdPlusChannels ?? [];
  const channel = useMemo(
    () => channels.find((item) => item.id === id),
    [channels, id]
  );
  const currentIndex = channels.findIndex((item) => item.id === channel?.id);
  const prevChannel = currentIndex > 0 ? channels[currentIndex - 1] : null;
  const nextChannel = currentIndex >= 0 && currentIndex < channels.length - 1 ? channels[currentIndex + 1] : null;

  useEffect(() => {
    if (!isUnlocked) {
      setLocation("/hd-plus");
    }
  }, [isUnlocked, setLocation]);

  if (!isUnlocked) {
    return null;
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-[#02050f] text-white font-sans flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-4">HD+ Channel Not Found</h2>
        <Link href="/hd-plus">
          <button className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-cyan-200 transition hover:bg-cyan-500/20">
            Return to HD+
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#02050f] text-white font-sans">
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/hd-plus" className="inline-flex items-center gap-2 text-cyan-300 hover:text-white">
            <Play className="h-4 w-4" />
            <span className="text-sm uppercase tracking-[0.32em]">Back to HD+</span>
          </Link>
          <span className="rounded-2xl bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-cyan-200">
            HD+
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black/80 p-4 lg:p-6">
          <VideoPlayer
            url={channel.streamUrl}
            channelName={channel.name}
            onBack={() => setLocation("/hd-plus")}
            onPrev={prevChannel ? () => setLocation(`/hd-plus/watch/${prevChannel.id}`) : undefined}
            onNext={nextChannel ? () => setLocation(`/hd-plus/watch/${nextChannel.id}`) : undefined}
          />
        </div>

        <aside className="w-full border-t border-cyan-500/10 bg-[#0b1118] lg:w-90 lg:border-t-0 lg:border-l lg:overflow-hidden">
          <div className="border-b border-cyan-500/10 px-4 py-5 sm:px-5">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">HD+</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Channel list</h2>
          </div>
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            <div className="grid gap-2">
              {channels.map((item) => {
                const isActive = item.id === channel.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLocation(`/hd-plus/watch/${item.id}`)}
                    className={`w-full rounded-3xl p-3 text-left transition ${
                      isActive
                        ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                        : "border border-white/5 bg-slate-950/80 text-slate-200 hover:border-cyan-500/20 hover:bg-slate-900"
                    }`}
                  >
                    <p className="truncate font-semibold">{item.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
