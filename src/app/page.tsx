import Link from "next/link";
import { ArrowRight, Sprout, TrendingUp } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import {
  getCategories,
  getFeaturedProducts,
  getRecentProducts,
} from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured, recent] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getRecentProducts(12),
  ]);

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/40 to-transparent">
      <TopBar location="Harare" />

      <main className="max-w-6xl mx-auto px-4">
        {/* SEARCH */}
        <section className="pt-4">
          <SearchBar />
        </section>

        {/* HERO */}
        <section className="mt-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 md:p-10">
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
                <Sprout className="h-3.5 w-3.5" strokeWidth={2.5} />
                Zimbabwe&apos;s direct farm marketplace
              </div>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                Fresh from local farmers
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/85">
                Quality products, fair prices. Connect directly with farmers
                across Zimbabwe.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-brand-800 font-medium hover:bg-brand-50 transition-colors"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/requests/new"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Post What You Need
                </Link>
              </div>
            </div>

            <div
              aria-hidden
              className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10"
            />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Browse by category
            </h2>
            <Link
              href="/products"
              className="text-xs text-brand-700 font-medium hover:text-brand-800"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
              />
            ))}
          </div>
        </section>

        {/* FEATURED — amber tinted block */}
        {featured.length > 0 && (
          <section className="mt-8 rounded-3xl bg-gradient-to-br from-amber-50 via-amber-50/40 to-transparent border border-amber-100/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className="h-4 w-4 text-amber-600"
                  strokeWidth={2.5}
                />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  Featured Products
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* RECENT */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Fresh listings
            </h2>
            <Link
              href="/products"
              className="text-xs text-brand-700 font-medium hover:text-brand-800"
            >
              See all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                No products listed yet. Farmers, be the first to add one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recent.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}