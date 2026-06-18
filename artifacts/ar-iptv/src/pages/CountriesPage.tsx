import { useMemo, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import CountryCard from "@/components/CountryCard";
import SearchBar from "@/components/SearchBar";
import { useIptvCatalog } from "@/lib/channels";

export default function CountriesPage() {
  const { data, isLoading, isError } = useIptvCatalog();
  const [query, setQuery] = useState("");

  const countries = useMemo(() => {
    if (!data) return [];
    return data.countries
      .filter((country) => country.country.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [data, query]);

  return (
    <div className="min-h-screen bg-[#02050f] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">Browse by country</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">All countries listed separately</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Find live TV channels by country. Tap any country to open a dedicated country page with all available channels grouped by category.
            </p>
          </div>

          <div className="max-w-xl">
            <SearchBar value={query} onChange={setQuery} placeholder="Search countries..." suggestions={[]} />
          </div>
        </div>

        {isError && (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200">
            Unable to load country list. Refresh the page or try again later.
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-44 rounded-3xl bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {countries.map((country, index) => (
              <CountryCard key={country.countrySlug} {...country} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
