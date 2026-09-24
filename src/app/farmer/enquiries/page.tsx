import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { EnquiryCard } from "@/components/EnquiryCard";
import { requireFarmer } from "@/lib/permissions";
import {
  getFarmerEnquiries,
  getFarmerProfileByUserId,
} from "@/lib/queries";

export const metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function FarmerEnquiriesPage() {
  const user = await requireFarmer();
  const profile = await getFarmerProfileByUserId(user.id);

  if (!profile) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="max-w-3xl mx-auto px-4 pt-10 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Profile not found
          </h1>
        </main>
        <BottomNav />
      </div>
    );
  }

  const enquiries = await getFarmerEnquiries(profile.id, 50);

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location={profile.city} />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <Link
          href="/farmer/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Enquiries
          </h1>
          <span className="text-xs text-gray-500">
            {enquiries.length} total
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Buyers interested in your products.
        </p>

        <div className="mt-6 space-y-3">
          {enquiries.length === 0 ? (
            <EmptyState />
          ) : (
            enquiries.map((e) => (
              <EnquiryCard
                key={e.id}
                enquiry={{
                  id: e.id,
                  message: e.message,
                  quantity: e.quantity,
                  unit: e.unit,
                  contactPhone: e.contactPhone,
                  status: e.status,
                  createdAt: e.createdAt,
                  product: {
                    id: e.product.id,
                    title: e.product.title,
                    unit: e.product.unit,
                  },
                  customer: {
                    user: {
                      fullName: e.customer.user.fullName,
                      phone: e.customer.user.phone,
                    },
                  },
                  farmerWhatsapp: profile.whatsappNumber,
                }}
              />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
          <Inbox className="h-7 w-7 text-brand-700" strokeWidth={2} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900">No enquiries yet</h3>
      <p className="text-sm text-gray-500 mt-1">
        When buyers contact you about your products, they&apos;ll show up here.
      </p>
    </div>
  );
}