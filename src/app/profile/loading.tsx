import { Skeleton, CardListSkeleton } from "@/components/Skeleton";

export default function ProfileLoading() {
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

      <main className="max-w-4xl mx-auto px-4 pt-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-gray-100 pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </div>

        <div className="mt-5">
          <CardListSkeleton count={3} />
        </div>
      </main>
    </div>
  );
}