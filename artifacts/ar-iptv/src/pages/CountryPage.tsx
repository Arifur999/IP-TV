import { useParams, Link } from "wouter";
import { getChannelsByCountry } from "@/lib/channels";
import Navbar from "@/components/Navbar";
import ChannelRow from "@/components/ChannelRow";
import { ArrowLeft } from "lucide-react";

export default function CountryPage() {
  const params = useParams();
  const slug = params.slug || "";
  const channels = getChannelsByCountry(slug);

  if (channels.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl text-cyan-400 mb-4">Country Not Found</h2>
          <Link href="/">
            <div className="flex items-center gap-2 text-cyan-500 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              <span>Return Home</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  const countryName = channels[0].country;
  const countryFlag = channels[0].countryFlag;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <div className="inline-flex items-center gap-2 text-cyan-500/70 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all mb-8 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm font-bold">Back to Countries</span>
          </div>
        </Link>

        <div className="mb-8 flex items-center justify-between border-b border-cyan-500/20 pb-6 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="text-5xl drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">{countryFlag}</span>
            <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_5px_rgba(0,229,255,0.3)] sm:text-4xl">
              {countryName}
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
              {channels.length}
            </span>
            <span className="text-xs uppercase tracking-widest text-cyan-500/50">
              Channels
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          {channels.map((channel, idx) => (
            <ChannelRow key={channel.id} channel={channel} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}
