import {
  Skeleton,
  PageHeaderSkeleton,
  StatCardSkeleton,
  CardListSkeleton,
} from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div>
      <PageHeaderSkeleton />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <CardListSkeleton count={3} />
      </div>

      <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <CardListSkeleton count={3} />
      </div>
    </div>
  );
}