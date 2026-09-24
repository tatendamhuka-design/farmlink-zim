import Link from "next/link";
import { Plus, Inbox } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { RequestCard } from "@/components/RequestCard";
import { getOpenSourcingRequests } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await getOpenSourcingRequests(30);

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location="Harare" />

      <main className="max-w-4xl mx-auto px-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              Buyer requests
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {requests.length} open request{requests.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Post request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                <Inbox className="h-7 w-7 text-brand-700" strokeWidth={2} />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">
              No open requests yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to tell farmers what you need.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {requests.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}