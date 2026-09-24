import Link from "next/link";
import { MapPin, Package, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatQuantity, timeAgo } from "@/lib/utils";

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    quantity: number;
    unit: string;
    city: string;
    province: string;
    requiredBy: Date | null;
    createdAt: Date;
    status: string;
    _count?: { responses: number };
  };
}

export function RequestCard({ request }: RequestCardProps) {
  const dueLabel = request.requiredBy
    ? new Date(request.requiredBy).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link
      href={`/requests/${request.id}`}
      className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 leading-tight">
          {request.title}
        </h3>
        <Badge variant={request.status === "OPEN" ? "success" : "default"}>
          {request.status}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Package className="h-3.5 w-3.5" strokeWidth={2} />
          {formatQuantity(request.quantity, request.unit)}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          {request.city}, {request.province}
        </span>
        {dueLabel && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
            By {dueLabel}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>{timeAgo(new Date(request.createdAt))}</span>
        {typeof request._count?.responses === "number" && (
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
            {request._count.responses} response
            {request._count.responses === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </Link>
  );
}