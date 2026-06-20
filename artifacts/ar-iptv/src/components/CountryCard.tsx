import { Link } from "wouter";
import { getCountryFlagUrl } from "@/lib/channels";
import { ArrowRight } from "lucide-react";

interface CountryCardProps {
  country: string;
  countrySlug: string;
  countryCode: string;
  countryFlag: string;
  count: number;
  index: number;
}

export default function CountryCard({ country, countrySlug, countryCode, count, index }: CountryCardProps) {
  const flagUrl = getCountryFlagUrl(countryCode);

  return (
    <Link href={`/country/${countrySlug}`}>
      <div
        className="group flex min-h-36 flex-col justify-between rounded-xl border border-white/10 bg-slate-950/80 p-4 text-left shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-900/90 animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-slate-900 shadow-lg">
            <img
              src={flagUrl}
              alt={country}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
        </div>
        <div className="mt-5 min-w-0">
          <h3 className="truncate text-lg font-bold text-white transition-colors group-hover:text-cyan-300">{country}</h3>
          <span className="mt-2 inline-flex rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            {count} channel{count !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
