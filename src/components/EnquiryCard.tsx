"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, MessageSquare, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { timeAgo, formatQuantity } from "@/lib/utils";

interface EnquiryCardProps {
  enquiry: {
    id: string;
    message: string;
    quantity: number | null;
    unit: string | null;
    contactPhone: string | null;
    status: string;
    createdAt: Date;
    product: { id: string; title: string; unit: string };
    customer: {
      user: { fullName: string; phone: string | null };
    };
    farmerWhatsapp: string;
  };
}

export function EnquiryCard({ enquiry }: EnquiryCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const customerName = enquiry.customer.user.fullName;
  const customerPhone =
    enquiry.customer.user.phone || enquiry.contactPhone || "";

  const quantityLabel = enquiry.quantity
    ? formatQuantity(enquiry.quantity, enquiry.unit || enquiry.product.unit)
    : null;

  const message = `Hi ${customerName.split(" ")[0]}, thanks for your enquiry about ${enquiry.product.title} on FarmLink Zim.`;

  const whatsappHref = buildWhatsAppLink(customerPhone, message);

  async function markResponded() {
    setBusy(true);
    await fetch(`/api/enquiries/${enquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESPONDED" }),
    });
    setBusy(false);
    router.refresh();
  }

  const statusVariant: any =
    enquiry.status === "NEW"
      ? "brand"
      : enquiry.status === "RESPONDED"
      ? "success"
      : enquiry.status === "CLOSED"
      ? "default"
      : "warning";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <span className="font-medium text-brand-800">
              {customerName.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {customerName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {customerPhone || "No phone"}
            </p>
          </div>
        </div>
        <Badge variant={statusVariant}>{enquiry.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Package className="h-3.5 w-3.5" strokeWidth={2} />
          {enquiry.product.title}
        </span>
        {quantityLabel && (
          <span className="inline-flex items-center gap-1">
            {quantityLabel}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} />
          {timeAgo(new Date(enquiry.createdAt))}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">
        {enquiry.message}
      </p>

      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
        {customerPhone && (
          <WhatsAppButton
            href={whatsappHref}
            size="sm"
            label="Reply on WhatsApp"
          />
        )}
        {enquiry.status !== "RESPONDED" && enquiry.status !== "CLOSED" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markResponded}
            disabled={busy}
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            {busy ? "Marking..." : "Mark responded"}
          </Button>
        )}
      </div>
    </div>
  );
}