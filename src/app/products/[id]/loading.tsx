import { Skeleton } from "@/components/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen pb-28 md:pb-12 bg-gradient-to-b from-brand-50/50 to-transparent">
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
        <Skeleton className="h-4 w-32" />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-10 w-40" />

            <div className="grid grid-cols-2 gap-3 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>

            <Skeleton className="h-4 w-full mt-6" />
            <Skeleton className="h-4 w-5/6" />

            <Skeleton className="h-12 w-full rounded-xl mt-6" />
            <Skeleton className="h-28 w-full rounded-3xl mt-6" />
          </div>
        </div>
      </main>
    </div>
  );
}