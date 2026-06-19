import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="AR IPTV" className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <div>
            <p className="text-xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">AR IPTV</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Global TV Directory</p>
          </div>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/favorites" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Favorites
          </Link>
          <Link href="/categories" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Categories
          </Link>
          <Link href="/countries" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Countries
          </Link>
          <Link href="/hd-plus" className="text-sm font-medium text-cyan-200 hover:text-white transition-colors">
            HD+
          </Link>
        </div>
        <div className="flex flex-col items-end text-right text-xs text-cyan-400/80">
          <span className="font-semibold">Arif</span>
          <span>Developer</span>
        </div>
      </div>
    </nav>
  );
}
