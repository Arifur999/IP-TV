import { Heart, MapPin, SatelliteDish, Globe2 } from "lucide-react";
import { Link } from "wouter";
import { Channel, getCountryFlagUrl } from "@/lib/channels";

interface ChannelCardProps {
  channel: Channel;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export default function ChannelCard({ channel, index, isFavorite, onToggleFavorite }: ChannelCardProps) {
  const logo = channel.logo || getCountryFlagUrl(channel.countryCode);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-lg shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-slate-900"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Link href={`/watch/${channel.id}`}>
        <div className="relative overflow-hidden bg-slate-900/80">
          <img
            src={logo}
            alt={channel.name}
            className="h-44 w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = getCountryFlagUrl(channel.countryCode);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200 ring-1 ring-cyan-400/10 backdrop-blur-sm">
            {channel.category}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/watch/${channel.id}`}>
              <h3 className="text-lg font-semibold text-white transition-colors hover:text-cyan-300">{channel.name}</h3>
            </Link>
            <p className="mt-2 text-sm text-slate-400 line-clamp-2">{channel.language || "Multilingual"}</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onToggleFavorite?.(channel.id);
            }}
            className="rounded-full border border-white/10 bg-black/60 p-2 text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-100"
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-cyan-400 text-cyan-300" : "text-cyan-200"}`} />
          </button>
        </div>

        <div className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-cyan-300" />
            {channel.country}
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
            {channel.website ? <Globe2 className="h-3.5 w-3.5 text-cyan-300" /> : <SatelliteDish className="h-3.5 w-3.5 text-cyan-300" />}
            {channel.website ? "Live stream" : "Stream URL"}
          </div>
        </div>
      </div>
    </div>
  );
}
