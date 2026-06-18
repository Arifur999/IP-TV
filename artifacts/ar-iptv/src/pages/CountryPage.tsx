import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import ChannelRow from "@/components/ChannelRow";
import SearchBar from "@/components/SearchBar";
import { ArrowLeft } from "lucide-react";
import { useIptvCatalog, searchChannels, filterChannelsByLetter } from "@/lib/channels";

export default function CountryPage() {
  const params = useParams();
  const slug = params.slug || "";
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const { data } = useIptvCatalog();

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

  if (!country || channels.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4">Country Not Found</h2>
          <p className="mb-6 text-slate-300">We could not find a catalog for that country slug yet.</p>
          <Link href="/">
            <button className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-cyan-200 transition hover:bg-cyan-500/20">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050f] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 text-cyan-300/80">
            <Link href="/">
              <ArrowLeft className="h-5 w-5 cursor-pointer transition hover:text-white" />
            </Link>
            <span className="uppercase tracking-[0.32em] text-sm font-semibold">Back to Home</span>
          </div>
          <Link
            href="/favorites"
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            View Favorites
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-3xl">
                  {country.countryFlag}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/70">Country</p>
                  <h1 className="text-4xl font-black text-white">{country.country}</h1>
                </div>
              </div>
              <p className="max-w-2xl text-slate-400">Browse all available live channels from {country.country}. Search by name, filter by alphabet, and jump into specific categories.</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl border border-cyan-500/15 bg-slate-900/80 p-4">
                <p className="text-sm text-cyan-300/70">Channel count</p>
                <p className="mt-1 text-3xl font-semibold text-white">{channels.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-4">
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
                onSubmit={() => undefined}
                placeholder="Search this country"
              />
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">Quick filter</p>
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
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                      letter === value ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10">
            {Object.entries(countryByCategory).map(([category, list]) => (
              <div key={category} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <p className="text-sm text-slate-400">{list.length} channels</p>
                  </div>
                  <Link
                    href={`/category/${category.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}`}
                    className="text-sm font-semibold text-cyan-300 hover:text-white"
                  >
                    Browse category
                  </Link>
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
