import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Package,
  Calendar,
  User,
  Phone,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/Badge";
import { getSourcingRequestById } from "@/lib/queries";
import {
  buildWhatsAppLink,
  buildSourcingResponseMessage,
} from "@/lib/whatsapp";
import { formatQuantity, timeAgo } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: PageProps) {
  const request = await getSourcingRequestById(params.id);

  if (!request) {
    notFound();
  }

  const buyerUser = request.customer.user;
  const whatsappHref = buildWhatsAppLink(
    buyerUser.phone || "",
    buildSourcingResponseMessage({
      customerName: buyerUser.fullName.split(" ")[0],
      requestTitle: request.title,
    })
  );

  const dueLabel = request.requiredBy
    ? new Date(request.requiredBy).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location="Harare" />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          All requests
        </Link>

        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              {request.title}
            </h1>
            <Badge variant={request.status === "OPEN" ? "success" : "default"}>
              {request.status}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <Fact
              icon={Package}
              label="Quantity"
              value={formatQuantity(request.quantity, request.unit)}
            />
            <Fact
              icon={MapPin}
              label="Location"
              value={`${request.city}, ${request.province}`}
            />
            {dueLabel && (
              <Fact icon={Calendar} label="Required by" value={dueLabel} />
            )}
          </div>

          {request.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
                Details
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {request.description}
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Posted {timeAgo(new Date(request.createdAt))}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="h-5 w-5 text-brand-800" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {buyerUser.fullName}
                </p>
                <p className="text-xs text-gray-500">Buyer</p>
              </div>
            </div>
          </div>

          {request.status === "OPEN" && buyerUser.phone && (
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <WhatsAppButton
                href={whatsappHref}
                fullWidth
                label="I can supply this"
              />
              <a
                href={`tel:${buyerUser.phone}`}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium hover:border-gray-300 transition-colors"
              >
                <Phone className="h-4 w-4" strokeWidth={2} />
                Call buyer
              </a>
            </div>
          )}
        </div>

        <section className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare
              className="h-4 w-4 text-brand-700"
              strokeWidth={2}
            />
            <h2 className="text-base font-semibold text-gray-900">
              Farmer responses ({request.responses.length})
            </h2>
          </div>

          {request.responses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">
                No responses yet. Farmers will contact the buyer directly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {request.responses.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-900">
                      {r.farmer.user.fullName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {timeAgo(new Date(r.createdAt))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                    {r.message}
                  </p>
                  {r.quotedPrice && (
                    <p className="mt-2 text-sm font-medium text-brand-800">
                      Quote: ${r.quotedPrice.toFixed(2)} / {request.unit}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-brand-50/40 border border-gray-100 p-3">
      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}