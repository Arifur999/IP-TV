import { useMemo, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import CountryCard from "@/components/CountryCard";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import ChannelCard from "@/components/ChannelCard";
import { useFavorites, useRecentWatch } from "@/hooks/use-favorites";
import { useIptvCatalog, searchChannels } from "@/lib/channels";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useIptvCatalog();
  const { favorites } = useFavorites();
  const { recent } = useRecentWatch();

  const countries = data?.countries ?? [];
  const categories = data?.categories ?? [];
  const channels = data?.channels ?? [];

  const topCategories = useMemo(
    () => categories.filter((category) => category.count > 0).sort((a, b) => b.count - a.count).slice(0, 6),
    [categories]
  );

  const topCountries = useMemo(
    () => [...countries].sort((a, b) => b.count - a.count).slice(0, 6),
    [countries]
  );

  const searchResults = useMemo(
    () => (query ? searchChannels(channels, query).slice(0, 6) : []),
    [channels, query]
  );

  const featuredChannels = useMemo(() => channels.slice(0, 8), [channels]);

  return (
    <div className="min-h-screen bg-[#03040d] text-slate-100 selection:bg-cyan-500/30 font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 uppercase tracking-[0.32em] text-cyan-400/80">Global Live TV Directory</p>
              <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl">
                Watch public IPTV channels from every continent.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Explore worldwide television by country, category, or search. Save favorites and continue watching channels you love.
              </p>
              <div className="mt-6 max-w-xl">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Search channels, countries, categories..."
                  suggestions={searchResults.map((result) => ({
                    id: result.id,
                    label: result.name,
                    hint: `${result.country} • ${result.category}`,
                  }))}
                />
                {isError && (
                  <p className="mt-3 text-sm text-rose-300">Unable to load live TV catalog. Please refresh or check your connection.</p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-900/80 p-6 text-slate-300 shadow-inner shadow-black/20">
              <div className="rounded-3xl bg-cyan-500/10 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Live catalog</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {isLoading ? "Loading channels..." : channels.length.toLocaleString()} channels
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {isLoading ? "Fetching global IPTV catalog..." : `From ${countries.length} countries and ${categories.length} categories.`}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/favorites"
                  className="rounded-3xl border border-cyan-500/20 bg-white/5 p-4 text-center text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  Favorites · {favorites.length}
                </Link>
                <Link
                  href="/category/entertainment"
                  className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4 text-center text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-800"
                >
                  Explore categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Browse by category</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Discover global genres</h2>
                </div>
                <Link href="/category/entertainment" className="text-sm font-semibold text-cyan-300 hover:text-white">
                  View all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {topCategories.map((category, index) => (
                  <CategoryCard key={category.slug} title={category.name} slug={category.slug} count={category.count} icon={category.icon} gradient={category.gradient} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Browse by country</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Live TV from around the world</h2>
                </div>
                <Link href="/country/united-states" className="text-sm font-semibold text-cyan-300 hover:text-white">
                  Explore countries
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {topCountries.map((country, index) => (
                  <CountryCard key={country.countrySlug} {...country} index={index} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Favorites</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Your saved channels</h2>
              </div>
              {favorites.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {channels
                    .filter((channel) => favorites.includes(channel.id))
                    .slice(0, 4)
                    .map((channel, index) => (
                      <ChannelCard key={channel.id} channel={channel} index={index} />
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Save channels as favorites while exploring categories and countries.</p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Recently watched</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Resume where you left off</h2>
              </div>
              {recent.length ? (
                <div className="grid gap-4">
                  {recent.slice(0, 3).map((id, index) => {
                    const channel = channels.find((item) => item.id === id);
                    return channel ? <ChannelCard key={channel.id} channel={channel} index={index} /> : null;
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Watch a channel and it will appear here.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Featured channels</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Start watching now</h2>
            </div>
            <Link href="/favorites" className="text-sm font-semibold text-cyan-300 hover:text-white">
              See all favorites
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredChannels.map((channel, index) => (
              <ChannelCard key={channel.id} channel={channel} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
