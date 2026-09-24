import Link from "next/link";
import { MapPin, Package, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FarmerVerificationActions } from "@/components/FarmerVerificationActions";

interface FarmerRowProps {
  farmer: {
    id: string;
    farmName: string;
    province: string;
    city: string;
    area: string | null;
    verificationStatus: string;
    rejectionReason: string | null;
    createdAt: Date;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
    };
    _count: { products: number };
  };
}

const statusVariant: Record<string, any> = {
  VERIFIED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  UNVERIFIED: "default",
};

export function FarmerRow({ farmer }: FarmerRowProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-brand-200 hover:shadow-soft transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-sm">
            <span className="font-semibold text-white">
              {farmer.user.fullName.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-gray-900 truncate">
              {farmer.user.fullName}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {farmer.farmName}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" strokeWidth={2} />
                {farmer.area ? `${farmer.area}, ` : ""}
                {farmer.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <Package className="h-3 w-3" strokeWidth={2} />
                {farmer._count.products} listing
                {farmer._count.products === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" strokeWidth={2} />
                Joined{" "}
                {new Date(farmer.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" strokeWidth={2} />
                {farmer.user.email}
              </span>
              {farmer.user.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" strokeWidth={2} />
                  {farmer.user.phone}
                </span>
              )}
            </div>

            {farmer.rejectionReason && (
              <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-md px-2 py-1 inline-block">
                Rejection reason: {farmer.rejectionReason}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge variant={statusVariant[farmer.verificationStatus] || "default"}>
            {farmer.verificationStatus}
          </Badge>
          <FarmerVerificationActions
            farmerId={farmer.id}
            status={farmer.verificationStatus}
          />
        </div>
      </div>
    </div>
  );
}