import { useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useIptvCatalog } from "@/lib/channels";
import VideoPlayer from "@/components/VideoPlayer";
import { useFavorites, useRecentWatch } from "@/hooks/use-favorites";
import { Play, Heart, HeartBroken } from "lucide-react";

export default function WatchPage() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const { data } = useIptvCatalog();
  const { toggleFavorite, favorites } = useFavorites();
  const { markWatched } = useRecentWatch();

  const id = Number(params.id);
  const channel = useMemo(
    () => data?.channels.find((item) => item.id === id),
    [data, id]
  );

  useEffect(() => {
    if (channel) {
      markWatched(channel.id);
    }
  }, [channel, markWatched]);

  if (!channel) {
    return (
      <div className="min-h-screen bg-[#02050f] text-white font-sans flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-4">Channel Not Found</h2>
        <Link href="/">
          <button className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-cyan-200 transition hover:bg-cyan-500/20">
            Return Home
          </button>
        </Link>
      </div>
    );
  }

  const countryChannels = useMemo(
    () => data?.channels.filter((item) => item.countrySlug === channel.countrySlug) ?? [],
    [channel.countrySlug, data]
  );

  const currentIndex = countryChannels.findIndex((c) => c.id === channel.id);
  const prevChannel = currentIndex > 0 ? countryChannels[currentIndex - 1] : null;
  const nextChannel = currentIndex < countryChannels.length - 1 ? countryChannels[currentIndex + 1] : null;

  const isFavorite = favorites.includes(channel.id.toString());

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#02050f] text-white font-sans">
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="space-y-2">
            <Link href={`/country/${channel.countrySlug}`} className="inline-flex items-center gap-2 text-cyan-300 hover:text-white">
              <Play className="h-4 w-4" />
              <span className="text-sm uppercase tracking-[0.32em]">Back to {channel.country}</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-2xl bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-cyan-200">{channel.category}</span>
              <span className="rounded-2xl bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300">{channel.language}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleFavorite(channel.id)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
            >
              {isFavorite ? <Heart className="h-4 w-4 text-pink-400" /> : <HeartBroken className="h-4 w-4 text-cyan-300" />}
              {isFavorite ? "Remove favorite" : "Add favorite"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black/80 p-4 lg:p-6">
          <VideoPlayer
            url={channel.streamUrl}
            channelName={channel.name}
            onBack={() => setLocation(`/country/${channel.countrySlug}`)}
            onPrev={prevChannel ? () => setLocation(`/watch/${prevChannel.id}`) : undefined}
            onNext={nextChannel ? () => setLocation(`/watch/${nextChannel.id}`) : undefined}
          />
        </div>

        <aside className="w-full border-t border-cyan-500/10 bg-[#0b1118] lg:w-90 lg:border-t-0 lg:border-l lg:overflow-hidden">
          <div className="border-b border-cyan-500/10 px-4 py-5 sm:px-5">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">More from {channel.country}</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Channel list</h2>
          </div>
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            <div className="grid gap-2">
              {countryChannels.map((item) => {
                const isActive = item.id === channel.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLocation(`/watch/${item.id}`)}
                    className={`w-full rounded-3xl p-3 text-left transition ${
                      isActive
                        ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                        : "border border-white/5 bg-slate-950/80 text-slate-200 hover:border-cyan-500/20 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.name}</p>
                        <p className="truncate text-sm text-slate-400">{item.category}</p>
                      </div>
                      {isActive && <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />}
                    </div>
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
