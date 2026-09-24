import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { timeAgo } from "@/lib/utils";

interface MyEnquiriesListProps {
  enquiries: {
    id: string;
    status: string;
    message: string;
    createdAt: Date;
    product: {
      id: string;
      title: string;
      imageUrl: string | null;
    };
    farmer: {
      id: string;
      name: string;
      farmName: string;
      whatsappNumber: string;
      verified: boolean;
    };
  }[];
}

const statusVariant: Record<string, any> = {
  NEW: "brand",
  READ: "warning",
  RESPONDED: "success",
  CLOSED: "default",
};

export function MyEnquiriesList({ enquiries }: MyEnquiriesListProps) {
  if (enquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
            <MessageSquare
              className="h-7 w-7 text-brand-700"
              strokeWidth={2}
            />
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">No enquiries yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          Contact a farmer from any product page.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {enquiries.map((e) => (
        <div
          key={e.id}
          className="rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <Link
              href={`/products/${e.product.id}`}
              className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={e.product.imageUrl || "/images/placeholder-product.svg"}
                alt={e.product.title}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${e.product.id}`}
                  className="font-medium text-sm text-gray-900 truncate hover:text-brand-700"
                >
                  {e.product.title}
                </Link>
                <Badge variant={statusVariant[e.status] || "default"}>
                  {e.status}
                </Badge>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="truncate">
                  {e.farmer.name} — {e.farmer.farmName}
                </span>
                {e.farmer.verified && <VerificationBadge verified size="sm" />}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" strokeWidth={2} />
                  {timeAgo(new Date(e.createdAt))}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                {e.message}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <WhatsAppButton
              href={buildWhatsAppLink(
                e.farmer.whatsappNumber,
                `Hi ${e.farmer.name.split(" ")[0]}, following up on my enquiry about ${e.product.title} on FarmLink Zim.`
              )}
              size="sm"
              label="Message farmer"
            />
          </div>
        </div>
      ))}
    </div>
  );
}