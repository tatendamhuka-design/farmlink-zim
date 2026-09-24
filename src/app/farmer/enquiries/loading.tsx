import { Skeleton, CardListSkeleton } from "@/components/Skeleton";

export default function EnquiriesLoading() {
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

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-40 mt-4" />
        <Skeleton className="h-4 w-64 mt-1" />

        <div className="mt-6">
          <CardListSkeleton count={3} />
        </div>
      </main>
    </div>
  );
}