import Navbar from "@/components/Navbar";
import CountryCard from "@/components/CountryCard";
import { getCountries } from "@/lib/channels";

export default function HomePage() {
  const countries = getCountries();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-mono">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <img
            src={import.meta.env.BASE_URL + "logo.png"}
            alt="AR IPTV Logo"
            className="mb-6 h-32 w-32 object-contain animate-logo-breathe"
          />
          <h1 className="mb-4 text-5xl font-black tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.6)] md:text-7xl">
            AR IPTV
          </h1>
          <p className="text-lg uppercase tracking-widest text-cyan-100/70 border-b border-cyan-500/30 pb-2">
            Live Sports — Worldwide
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <h2 className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">
            SELECT A COUNTRY
          </h2>
          <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {countries.map((country, idx) => (
            <CountryCard
              key={country.countrySlug}
              country={country.country}
              countrySlug={country.countrySlug}
              countryFlag={country.countryFlag}
              count={country.count}
              index={idx}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
