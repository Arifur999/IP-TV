import { Link } from "wouter";
import { Heart, Home, Tv } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/15 bg-[#05070c]/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="AR IPTV" className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.65)]" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-widest text-cyan-300 sm:text-xl">AR IPTV</p>
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-slate-400">Country TV Directory</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-white">
            <Home className="h-4 w-4 text-cyan-300" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link href="/favorites" className="inline-flex h-10 items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/15">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 md:flex">
          <Tv className="h-4 w-4 text-cyan-300" />
          <span>Live Sports</span>
        </div>
      </div>
    </nav>
  );
}
