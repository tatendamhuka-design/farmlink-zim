import Link from "next/link";
import {
  Package,
  MapPin,
  Calendar,
  MessageSquare,
  Inbox,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatQuantity, timeAgo } from "@/lib/utils";

interface MyRequestsListProps {
  requests: {
    id: string;
    title: string;
    quantity: number;
    unit: string;
    city: string;
    province: string;
    status: string;
    createdAt: Date;
    responsesCount: number;
  }[];
}

export function MyRequestsList({ requests }: MyRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
            <Inbox className="h-7 w-7 text-brand-700" strokeWidth={2} />
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">No requests yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell farmers what you need.
        </p>
        <Link
          href="/requests/new"
          className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Post request
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <Link
          key={r.id}
          href={`/requests/${r.id}`}
          className="block rounded-2xl border border-gray-100 bg-white p-4 hover:border-gray-200 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-sm text-gray-900">{r.title}</h3>
            <Badge
              variant={
                r.status === "OPEN"
                  ? "success"
                  : r.status === "FULFILLED"
                  ? "brand"
                  : "default"
              }
            >
              {r.status}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Package className="h-3 w-3" strokeWidth={2} />
              {formatQuantity(r.quantity, r.unit)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" strokeWidth={2} />
              {r.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" strokeWidth={2} />
              {timeAgo(new Date(r.createdAt))}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" strokeWidth={2} />
              {r.responsesCount} response{r.responsesCount === 1 ? "" : "s"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}