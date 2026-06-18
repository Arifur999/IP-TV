import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import ChannelCard from "@/components/ChannelCard";
import SearchBar from "@/components/SearchBar";
import { Channel, useIptvCatalog, getCategoryLabel, getCategorySlug, searchChannels, CATEGORY_META } from "@/lib/channels";
import { ArrowLeft, RefreshCw } from "lucide-react";

const alphabet = ["All", ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))];

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug || "";
  const { data, isLoading, isError, refetch } = useIptvCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [letterFilter, setLetterFilter] = useState("All");
  const [visibleItems, setVisibleItems] = useState(18);

  const categoryLabel = getCategoryLabel(categorySlug);
  const channels = useMemo<Channel[]>(() => {
    if (!data) return [];
    return data.channels.filter((channel) => channel.categorySlug === categorySlug);
  }, [data, categorySlug]);

  const filteredChannels = useMemo(() => {
    let results = channels;
    if (searchQuery.trim()) {
      results = searchChannels(results, searchQuery);
    }
    if (letterFilter !== "All") {
      results = results.filter((channel) => channel.name.startsWith(letterFilter));
    }
    return results;
  }, [channels, searchQuery, letterFilter]);

  const countryGroups = useMemo<Record<string, Channel[]>>(() => {
    return filteredChannels.reduce<Record<string, Channel[]>>((acc, channel) => {
      if (!acc[channel.country]) acc[channel.country] = [];
      acc[channel.country].push(channel);
      return acc;
    }, {});
  }, [filteredChannels]);

  const shouldShowLoadMore = filteredChannels.length > visibleItems;
  const visibleChannels = filteredChannels.slice(0, visibleItems);
  const visibleCountryGroups = useMemo<Record<string, Channel[]>>(() => {
    return visibleChannels.reduce<Record<string, Channel[]>>((acc, channel) => {
      if (!acc[channel.country]) acc[channel.country] = [];
      acc[channel.country].push(channel);
      return acc;
    }, {});
  }, [visibleChannels]);

  useEffect(() => {
    setVisibleItems(18);
  }, [categorySlug, searchQuery, letterFilter]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY > document.body.offsetHeight - 650 && shouldShowLoadMore) {
        setVisibleItems((count) => Math.min(count + 12, filteredChannels.length));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredChannels.length, shouldShowLoadMore]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-14">
          <div className="space-y-6">
            <div className="h-24 rounded-3xl bg-slate-900/80 p-6" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-72 rounded-3xl bg-slate-900/80 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-3xl border border-cyan-500/20 bg-slate-950/80 px-6 py-5">
            <RefreshCw className="h-5 w-5 text-cyan-300" />
            <span>Unable to load catalog. Please refresh the page.</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/40 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 text-cyan-300">
              <Link href="/">
                <span className="cursor-pointer text-sm uppercase tracking-[0.36em] text-cyan-300/80 hover:text-cyan-100">Home</span>
              </Link>
              <span className="text-sm uppercase tracking-[0.36em] text-slate-500">/</span>
              <span className="text-sm uppercase tracking-[0.36em] text-white/90">{categoryLabel} Channels</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{categoryLabel} television worldwide</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Explore live channels by country, language and genre. Pull from IPTV-ORG public playlists and stream instantly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {alphabet.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => setLetterFilter(letter)}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.3em] transition ${letterFilter === letter ? "border-cyan-500 bg-cyan-500/15 text-cyan-200" : "border-white/10 text-slate-400 hover:border-cyan-500/40 hover:text-white"}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search within this category"
            suggestions={[]}
          />
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="rounded-full bg-white/5 px-4 py-2">{channels.length} channels</span>
            <span className="rounded-full bg-white/5 px-4 py-2">{Object.keys(countryGroups).length} countries</span>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-5">
            {visibleChannels.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-400">
                No channels match your filter. Try a different search term.
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(visibleCountryGroups).map(([country, list]) => (
                  <div key={country} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{country}</h3>
                        <p className="text-sm text-slate-400">{list.length} channels</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200">
                        {categoryLabel}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {list.map((channel, index) => (
                        <ChannelCard key={channel.id} channel={channel} index={index} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {shouldShowLoadMore && (
              <button
                type="button"
                onClick={() => setVisibleItems((count) => Math.min(count + 12, filteredChannels.length))}
                className="mx-auto mt-4 inline-flex items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Load more channels
              </button>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-cyan-300">Category overview</h2>
              <p className="mt-3 text-sm text-slate-400">
                Stream {categoryLabel.toLowerCase()} channels gathered from IPTV-ORG public playlists and organized by region.
              </p>
              <div className="mt-5 grid gap-3">
                {Object.entries(CATEGORY_META)
                  .filter(([key]) => getCategorySlug(key) === categorySlug)
                  .map(([name, meta]) => (
                    <div key={name} className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                      <span>{meta.icon}</span>
                      <span>{name}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-cyan-300">Countries in this category</h2>
              <div className="mt-4 space-y-3">
                {Object.entries(countryGroups)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(0, 8)
                  .map(([country, entries]) => (
                    <div key={country} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                      <span>{country}</span>
                      <span className="text-cyan-300">{entries.length}</span>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
