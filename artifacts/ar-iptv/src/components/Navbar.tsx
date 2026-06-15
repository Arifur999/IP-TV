import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="AR IPTV" className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          <span className="text-xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
            AR IPTV
          </span>
        </Link>
        <div className="flex flex-col items-end">
          <a
            href="https://github.com/Arifur999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(0,229,255,0.8)] hover:drop-shadow-[0_0_10px_rgba(0,229,255,1)]"
          >
            Arif
          </a>
          <span className="text-xs text-cyan-500/70">Developer</span>
        </div>
      </div>
    </nav>
  );
}
