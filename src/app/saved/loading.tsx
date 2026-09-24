import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function SavedLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="sticky top-0 z-30 bg-[#f8faf9]/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-5" />
        <ProductGridSkeleton count={4} />
      </main>
    </div>
  );
}