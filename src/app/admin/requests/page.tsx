import Link from "next/link";
import {
  MapPin,
  Package,
  Calendar,
  MessageSquare,
  User,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AdminRequestsSearch } from "@/components/AdminRequestsSearch";
import { AdminRequestActions } from "@/components/AdminRequestActions";
import { getAllSourcingRequestsForAdmin } from "@/lib/queries";
import { formatQuantity, timeAgo } from "@/lib/utils";

export const metadata = { title: "Requests — Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { q?: string };
}

export default async function AdminRequestsPage({ searchParams }: PageProps) {
  const requests = await getAllSourcingRequestsForAdmin({
    q: searchParams.q,
    take: 100,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Buyer Requests
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and moderate sourcing requests posted by buyers.
        </p>
      </div>

      <div className="mb-4">
        <AdminRequestsSearch />
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            {searchParams.q
              ? `No requests match "${searchParams.q}"`
              : "No requests yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const buyerUser = r.customer.user;
            const dueLabel = r.requiredBy
              ? new Date(r.requiredBy).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/requests/${r.id}`}
                        className="font-medium text-sm text-gray-900 hover:text-brand-700 truncate"
                      >
                        {r.title}
                      </Link>
                      <Badge
                        variant={r.status === "OPEN" ? "success" : "default"}
                      >
                        {r.status}
                      </Badge>
                      {r._count.responses > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                          <MessageSquare className="h-3 w-3" strokeWidth={2} />
                          {r._count.responses} response
                          {r._count.responses === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>

                    {r.description && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {r.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Package className="h-3 w-3" strokeWidth={2} />
                        {formatQuantity(r.quantity, r.unit)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {r.city}, {r.province}
                      </span>
                      {dueLabel && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" strokeWidth={2} />
                          By {dueLabel}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" strokeWidth={2} />
                        {buyerUser.fullName}
                      </span>
                      {buyerUser.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" strokeWidth={2} />
                          {buyerUser.phone}
                        </span>
                      )}
                      <span className="text-gray-400">
                        {timeAgo(new Date(r.createdAt))}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <AdminRequestActions
                      requestId={r.id}
                      status={r.status}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}