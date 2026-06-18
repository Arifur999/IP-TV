import { Link } from "wouter";

interface CategoryCardProps {
  title: string;
  slug: string;
  count: number;
  icon: string;
  gradient: string;
}

export default function CategoryCard({ title, slug, count, icon, gradient }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/80 p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20 ${gradient}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-3xl leading-none">{icon}</p>
            <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-sm">
            {count} channels
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
    </Link>
  );
}
