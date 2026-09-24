import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/40 to-transparent">
      {/* TOPBAR */}
      <div className="sticky top-0 z-30 bg-[#f8faf9]/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-4">
        <Skeleton className="h-12 w-full rounded-xl" />

        <section className="mt-5">
          <Skeleton className="h-48 md:h-64 w-full rounded-3xl" />
        </section>

        <section className="mt-7">
          <Skeleton className="h-5 w-40 mb-3" />
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <Skeleton className="h-5 w-40 mb-3" />
          <ProductGridSkeleton count={4} />
        </section>
      </main>
    </div>
  );
}