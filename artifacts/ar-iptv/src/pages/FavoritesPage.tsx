import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import ChannelCard from "@/components/ChannelCard";
import { useFavorites } from "@/hooks/use-favorites";
import { useIptvCatalog } from "@/lib/channels";
import { Heart, ArrowLeft } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { data, isLoading, isError } = useIptvCatalog();

  const favoriteChannels = data?.channels.filter((channel) => favorites.includes(channel.id)) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300">
              <Heart className="h-5 w-5" />
              <span className="uppercase tracking-[0.35em] text-cyan-300/80">Favorites</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Your saved channels</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Keep the stations you love handy and jump back into live streams with a single tap.
            </p>
          </div>
          <Link href="/">
            <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 rounded-xl bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-10 text-center text-slate-400">
            Unable to load favorites. Please refresh and try again.
          </div>
        ) : favoriteChannels.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-slate-950/80 p-10 text-center text-slate-200">
            <h2 className="mb-4 text-2xl font-semibold text-white">No favorite channels yet.</h2>
            <p className="text-slate-400">Browse by country and tap the heart icon to save your top stations.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteChannels.map((channel, index) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                index={index}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
