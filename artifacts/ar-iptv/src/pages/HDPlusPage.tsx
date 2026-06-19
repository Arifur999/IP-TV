import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ChannelRow from "@/components/ChannelRow";
import SearchBar from "@/components/SearchBar";
import { searchChannels, useHdPlusCatalog } from "@/lib/channels";
import { Lock, ShieldCheck } from "lucide-react";

const HD_PLUS_PASSWORD = "AR-7043";
const HD_PLUS_SESSION_KEY = "ar-iptv-hd-plus-unlocked";

export default function HDPlusPage() {
  const { data, isLoading, isError } = useHdPlusCatalog();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setIsUnlocked(sessionStorage.getItem(HD_PLUS_SESSION_KEY) === "true");
  }, []);

  const channels = data?.hdPlusChannels ?? [];
  const filteredChannels = useMemo(
    () => (query ? searchChannels(channels, query) : channels),
    [channels, query]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.trim() === HD_PLUS_PASSWORD) {
      sessionStorage.setItem(HD_PLUS_SESSION_KEY, "true");
      setIsUnlocked(true);
      setError("");
      return;
    }
    setError("Wrong password. Try again.");
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#02050f] text-white font-sans">
        <Navbar />
        <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-black/40"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">Protected</p>
                <h1 className="text-3xl font-black text-white">HD+</h1>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="hd-plus-password">
              Password
            </label>
            <input
              id="hd-plus-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              autoComplete="current-password"
            />
            {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <ShieldCheck className="h-4 w-4" />
              Unlock HD+
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050f] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">Protected catalog</p>
          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">HD+</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Private channels separated from the public country and category catalog.
          </p>
          <div className="mt-6 max-w-xl">
            <SearchBar value={query} onChange={setQuery} placeholder="Search HD+ channels..." suggestions={[]} />
          </div>
        </div>

        {isError && (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200">
            Unable to load HD+ channels. Refresh the page or try again later.
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-24 rounded-3xl bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : filteredChannels.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-300">
            No HD+ channels match your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredChannels.map((channel, index) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                index={index}
                watchHref={`/hd-plus/watch/${channel.id}`}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
