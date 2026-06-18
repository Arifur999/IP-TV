import { useMemo, useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import { useIptvCatalog, getCategoryLabel, CATEGORY_META } from "@/lib/channels";

const FEATURED_CATEGORY_SLUGS = ["sports", "entertainment", "movies", "music"];

export default function CategoriesPage() {
  const { data, isLoading, isError } = useIptvCatalog();
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    if (!data) return [];
    return data.categories
      .filter((category) => category.count > 0)
      .filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [data, query]);

  const featuredCategories = useMemo(() => {
    return categories.filter((category) => FEATURED_CATEGORY_SLUGS.includes(category.slug));
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#02050f] text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">Browse by category</p>
            <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Find channels by genre</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Explore channels by major genres like sports, entertainment, movies, and music. Tap a category to browse live streams from around the world.
            </p>
          </div>

          <div className="max-w-xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search categories..."
              suggestions={[]}
            />
          </div>
        </div>

        {isError && (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200">
            Unable to load categories right now. Refresh the page or try again later.
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-48 rounded-3xl bg-slate-900/80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {featuredCategories.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">Featured</p>
                    <h2 className="mt-2 text-3xl font-bold text-white">Popular categories</h2>
                  </div>
                  <Link href="/" className="text-sm font-semibold text-cyan-300 hover:text-white">
                    Back to home
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredCategories.map((category) => {
                    const meta = CATEGORY_META[category.slug] ?? {
                      name: category.name,
                      slug: category.slug,
                      icon: "📺",
                      gradient: "from-slate-600 via-slate-700 to-slate-900",
                    };
                    return (
                      <CategoryCard
                        key={category.slug}
                        title={category.name}
                        slug={category.slug}
                        count={category.count}
                        icon={meta.icon}
                        gradient={meta.gradient}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">All categories</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Browse every genre</h2>
                </div>
                <span className="text-sm text-slate-400">{categories.length} available</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => {
                  const meta = CATEGORY_META[category.slug] ?? {
                    name: category.name,
                    slug: category.slug,
                    icon: "📺",
                    gradient: "from-slate-600 via-slate-700 to-slate-900",
                  };
                  return (
                    <CategoryCard
                      key={category.slug}
                      title={category.name}
                      slug={category.slug}
                      count={category.count}
                      icon={meta.icon}
                      gradient={meta.gradient}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
