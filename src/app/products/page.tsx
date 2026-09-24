import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { SortSelect } from "@/components/SortSelect";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, searchProducts } from "@/lib/queries";
import { PackageX } from "lucide-react";

const PROVINCES = [
  "Harare",
  "Bulawayo",
  "Manicaland",
  "Mashonaland Central",
  "Mashonaland East",
  "Mashonaland West",
  "Masvingo",
  "Matabeleland North",
  "Matabeleland South",
  "Midlands",
];

interface PageProps {
  searchParams: {
    q?: string;
    category?: string;
    province?: string;
    minPrice?: string;
    maxPrice?: string;
    delivery?: string;
    verified?: string;
    sort?: string;
    page?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: PageProps) {
  const [categories, searchResult] = await Promise.all([
    getCategories(),
    searchProducts({
      q: searchParams.q,
      category: searchParams.category,
      province: searchParams.province,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,
      delivery: searchParams.delivery === "true",
      verified: searchParams.verified === "true",
      sort: (searchParams.sort as any) || "newest",
      page: searchParams.page ? Number(searchParams.page) : 1,
    }),
  ]);

  const { results, total } = searchResult;
  const q = searchParams.q?.trim();

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/50 to-transparent">
      <TopBar location="Harare" />

      <main className="max-w-6xl mx-auto px-4">
        <section className="pt-4">
          <SearchBar defaultValue={q} />
        </section>

        <section className="mt-5 mb-2">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            {q ? (
              <>
                <span className="font-semibold">{total}</span> result
                {total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
              </>
            ) : (
              <>
                <span className="font-semibold">{total}</span> product
                {total === 1 ? "" : "s"} available
              </>
            )}
          </h1>
        </section>

        <section className="mt-4 flex flex-col md:flex-row gap-6">
          <FilterBar
            categories={categories}
            provinces={PROVINCES}
            resultCount={total}
          />

          <div className="flex-1">
            <div className="hidden md:flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{total}</span>{" "}
                product{total === 1 ? "" : "s"}
              </p>
              <SortSelect />
            </div>

            {results.length === 0 ? (
              <EmptyState q={q} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function EmptyState({ q }: { q?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
          <PackageX className="h-7 w-7 text-brand-700" strokeWidth={2} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900">
        {q ? `No products match "${q}"` : "No products available yet"}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Try a different search term or clear your filters.
      </p>
    </div>
  );
}