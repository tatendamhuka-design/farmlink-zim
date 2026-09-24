import {
  Skeleton,
  StatCardSkeleton,
  CardListSkeleton,
} from "@/components/Skeleton";

export default function FarmerDashboardLoading() {
  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/50 to-transparent">
      <div className="sticky top-0 z-30 bg-[#f8faf9]/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-5">
        <div className="rounded-3xl bg-white border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="mt-7">
          <Skeleton className="h-5 w-32 mb-3" />
          <CardListSkeleton count={4} />
        </div>
      </main>
    </div>
  );
}