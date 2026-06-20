import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Heart, PlayCircle, Search, Tv } from "lucide-react";
import Navbar from "@/components/Navbar";
import CountryCard from "@/components/CountryCard";
import SearchBar from "@/components/SearchBar";
import ChannelCard from "@/components/ChannelCard";
import { useFavorites, useRecentWatch } from "@/hooks/use-favorites";
import { useIptvCatalog, searchChannels } from "@/lib/channels";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { data, isLoading, isError } = useIptvCatalog();
  const { favorites, toggleFavorite } = useFavorites();
  const { recent } = useRecentWatch();

  const countries = data?.countries ?? [];
  const channels = data?.channels ?? [];
  const normalizedQuery = query.trim().toLowerCase();

  const matchingChannels = useMemo(
    () => (normalizedQuery ? searchChannels(channels, query) : []),
    [channels, normalizedQuery, query]
  );

  const visibleCountries = useMemo(() => {
    const countryMatches = countries.filter((country) => country.country.toLowerCase().includes(normalizedQuery));
    const channelCountrySlugs = new Set(matchingChannels.map((channel) => channel.countrySlug));
    return [...countries]
      .filter((country) => !normalizedQuery || countryMatches.includes(country) || channelCountrySlugs.has(country.countrySlug))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }, [countries, matchingChannels, normalizedQuery]);

  const favoriteChannels = useMemo(
    () => channels.filter((channel) => favorites.includes(channel.id)).slice(0, 4),
    [channels, favorites]
  );

  const recentChannels = useMemo(
    () => recent.map((id) => channels.find((channel) => channel.id === id)).filter(Boolean).slice(0, 4),
    [channels, recent]
  );

  const highlightedChannels = normalizedQuery ? matchingChannels.slice(0, 6) : favoriteChannels.length ? favoriteChannels : recentChannels;

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 selection:bg-cyan-500/30 font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,13,24,0.98),rgba(2,37,45,0.72),rgba(5,7,12,0.98))] p-5 shadow-2xl shadow-black/30 sm:p-7 lg:p-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                <Tv className="h-4 w-4" />
                Country-first live TV
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Pick a country, then start watching live sports channels.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                The catalog now uses only your two M3U playlists and keeps browsing simple: countries first, categories inside each country.
              </p>
              <div className="mt-6 max-w-2xl">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Search country or channel..."
                  suggestions={matchingChannels.slice(0, 5).map((channel) => ({
                    id: channel.id,
                    label: channel.name,
                    hint: `${channel.country} - ${channel.category}`,
                  }))}
                  onSelectSuggestion={(id) => setLocation(`/watch/${id}`)}
                />
                {isError && (
                  <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    Unable to load the bundled playlists. Please refresh the page.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                  <PlayCircle className="h-4 w-4" /> Channels
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{isLoading ? "..." : channels.length.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200">
                  <Search className="h-4 w-4" /> Countries
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{isLoading ? "..." : countries.length.toLocaleString()}</p>
              </div>
              <Link href="/favorites" className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 transition hover:bg-cyan-400/15">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-100">
                  <Heart className="h-4 w-4" /> Favorites
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{favorites.length.toLocaleString()}</p>
              </Link>
            </div>
          </div>
        </section>

        {(highlightedChannels.length > 0 || normalizedQuery) && (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                  {normalizedQuery ? "Channel matches" : favoriteChannels.length ? "Favorites" : "Recently watched"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {normalizedQuery ? "Matching channels" : "Quick access"}
                </h2>
              </div>
              {!normalizedQuery && favoriteChannels.length > 0 && (
                <Link href="/favorites" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            {highlightedChannels.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {highlightedChannels.map((channel, index) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    index={index}
                    isFavorite={favorites.includes(channel.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-300">
                No channel matches found. Try a country name like India, Bangladesh, United Kingdom, or Argentina.
              </div>
            )}
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Browse by country</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Available countries</h2>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
              {visibleCountries.length} shown
            </span>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-xl bg-slate-900/80" />
              ))}
            </div>
          ) : visibleCountries.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCountries.map((country, index) => (
                <CountryCard key={country.countrySlug} {...country} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-8 text-center text-slate-300">
              No countries match this search.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
