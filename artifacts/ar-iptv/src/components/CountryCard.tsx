import { Link } from "wouter";
import { getCountryFlagUrl } from "@/lib/channels";

interface CountryCardProps {
  country: string;
  countrySlug: string;
  countryFlag: string;
  count: number;
  index: number;
}

export default function CountryCard({ country, countrySlug, count, index }: CountryCardProps) {
  const flagUrl = getCountryFlagUrl(countrySlug);

  return (
    <Link href={`/country/${countrySlug}`}>
      <div
        className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-cyan-500/30 bg-[#111] p-6 text-center transition-all duration-300 hover:scale-105 hover:animate-glow-pulse animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="relative w-16 h-12 overflow-hidden rounded shadow-lg drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
          <img
            src={flagUrl}
            alt={country}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <h3 className="text-lg font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors">{country}</h3>
        <span className="rounded-full bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 text-xs text-cyan-400">
          {count} Channel{count !== 1 ? 's' : ''}
        </span>
      </div>
    </Link>
  );
}
