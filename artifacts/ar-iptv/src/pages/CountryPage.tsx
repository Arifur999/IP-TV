import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import ChannelRow from "@/components/ChannelRow";
import SearchBar from "@/components/SearchBar";
import { ArrowLeft, Search } from "lucide-react";
import { useIptvCatalog, searchChannels, filterChannelsByLetter } from "@/lib/channels";

export default function CountryPage() {
  const params = useParams();
  const slug = params.slug || "";
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const { data, isLoading, isError } = useIptvCatalog();

  const country = data?.countries.find((item) => item.countrySlug === slug);
  const channels = useMemo(
    () => data?.channels.filter((channel) => channel.countrySlug === slug) ?? [],
    [data, slug]
  );

  const filteredChannels = useMemo(() => {
    const searched = query ? searchChannels(channels, query) : channels;
    return filterChannelsByLetter(searched, letter);
  }, [channels, query, letter]);

  const countryByCategory = useMemo(() => {
    return filteredChannels.reduce<Record<string, typeof filteredChannels>>((acc, channel) => {
      const key = channel.category || "Other";
      acc[key] = acc[key] || [];
      acc[key].push(channel);
      return acc;
    }, {});
  }, [filteredChannels]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070c] text-white font-sans">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-36 animate-pulse rounded-xl bg-slate-900/80" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-900/80" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !country || channels.length === 0) {
    return (
      <div className="min-h-screen bg-[#05070c] text-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl font-bold text-cyan-300 mb-4">{isError ? "Catalog Not Loaded" : "Country Not Found"}</h2>
          <p className="mb-6 text-slate-300">{isError ? "Refresh the page and try again." : "We could not find channels for that country yet."}</p>
          <Link href="/">
            <button className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-cyan-200 transition hover:bg-cyan-500/20">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070c] text-white font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 text-cyan-300/80">
            <Link href="/">
              <ArrowLeft className="h-5 w-5 cursor-pointer transition hover:text-white" />
            </Link>
            <span className="uppercase tracking-[0.32em] text-sm font-semibold">Back to Home</span>
          </div>
          <Link
            href="/favorites"
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            View Favorites
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <div className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-3xl">
                  {country.countryFlag}
                </div>
                <div className="min-w-0">
                  <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/70">Country</p>
                  <h1 className="truncate text-3xl font-black text-white sm:text-4xl">{country.country}</h1>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">Browse live channels from {country.country}. Search by name, filter by alphabet, and scan categories on this page.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-cyan-500/15 bg-slate-900/80 p-4">
                <p className="text-sm text-cyan-300/70">Channel count</p>
                <p className="mt-1 text-3xl font-semibold text-white">{channels.length}</p>
              </div>
              <div className="rounded-xl border border-slate-800/60 bg-slate-900/80 p-4">
                <p className="text-sm text-cyan-300/70">Category count</p>
                <p className="mt-1 text-3xl font-semibold text-white">{Object.keys(countryByCategory).length}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px]">
            <div>
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search this country"
              />
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-cyan-300/70">
                <Search className="h-4 w-4" /> Letter
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "All",
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                ].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLetter(value)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      letter === value ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {Object.entries(countryByCategory).map(([category, list]) => (
              <div key={category} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <p className="text-sm text-slate-400">{list.length} channels</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.map((channel, idx) => (
                    <ChannelRow key={channel.id} channel={channel} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
