import {
  DollarSign,
  Calendar,
  Star,
  Users,
  Megaphone,
  Inbox,
  CreditCard,
  RotateCcw,
  AlertCircle,
  Info,
} from "lucide-react";
import { RevenueCard } from "@/components/RevenueCard";
import { Badge } from "@/components/ui/Badge";
import {
  getRevenueSummary,
  getRecentPayments,
  getActiveFeatureListingsCount,
} from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Revenue — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  const [summary, payments, activeFeatured] = await Promise.all([
    getRevenueSummary(),
    getRecentPayments(20),
    getActiveFeatureListingsCount(),
  ]);

  const paymentsDisabled =
    process.env.PAYMENTS_ENABLED !== "true";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Revenue
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Monetization overview across all revenue streams.
        </p>
      </div>

      {/* MVP notice */}
      {paymentsDisabled && (
        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
          <Info
            className="h-5 w-5 text-blue-700 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Payments are disabled in this version
            </p>
            <p className="text-xs text-blue-800 mt-0.5">
              The payment architecture is in place. Revenue will populate here
              once a payment provider is connected.
            </p>
          </div>
        </div>
      )}

      {/* PRIMARY STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RevenueCard
          icon={DollarSign}
          label="Total revenue"
          amount={summary.total}
        />
        <RevenueCard
          icon={Calendar}
          label="This month"
          amount={summary.monthly}
          accent="blue"
        />
        <RevenueCard
          icon={Star}
          label="Active featured"
          amount={activeFeatured}
          accent="amber"
        />
        <RevenueCard
          icon={RotateCcw}
          label="Refunds"
          amount={summary.refunds}
          accent="blue"
        />
      </section>

      {/* REVENUE BY STREAM */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Revenue by stream
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <RevenueCard
            icon={Star}
            label="Featured listings"
            amount={summary.featured.total}
            pendingAmount={summary.featured.pending}
            accent="amber"
          />
          <RevenueCard
            icon={Users}
            label="Farmer Pro subscriptions"
            amount={summary.subscription.total}
            pendingAmount={summary.subscription.pending}
          />
          <RevenueCard
            icon={Megaphone}
            label="Agricultural advertising"
            amount={summary.advertising.total}
            pendingAmount={summary.advertising.pending}
            accent="blue"
          />
          <RevenueCard
            icon={Inbox}
            label="Commercial sourcing"
            amount={summary.sourcing.total}
            pendingAmount={summary.sourcing.pending}
            accent="amber"
          />
          <RevenueCard
            icon={CreditCard}
            label="Transaction commission"
            amount={summary.transaction.total}
            accent="blue"
          />
        </div>
      </section>

      {/* RECENT PAYMENTS */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Recent payments
        </h2>

        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                <DollarSign
                  className="h-7 w-7 text-brand-700"
                  strokeWidth={2}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              No payments recorded yet.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Payments will appear here once a payment provider is enabled.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 truncate max-w-[200px]">
                        {p.user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {p.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {p.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          p.status === "COMPLETED"
                            ? "success"
                            : p.status === "PENDING"
                            ? "warning"
                            : p.status === "REFUNDED"
                            ? "default"
                            : "danger"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500">
                      {timeAgo(new Date(p.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ROADMAP */}
      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-start gap-2 mb-3">
          <AlertCircle
            className="h-4 w-4 text-brand-700 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <h2 className="text-sm font-semibold text-gray-900">
            Monetization roadmap
          </h2>
        </div>
        <ol className="space-y-2 text-sm text-gray-600">
          <li>1. Free marketplace — build farmers and buyers</li>
          <li>2. Featured listings — $1, $3, $5 for visibility</li>
          <li>3. Farmer Pro — $5/month subscription</li>
          <li>4. Agricultural advertising — banner placements</li>
          <li>5. Commercial sourcing — premium buyer requests</li>
          <li>6. Transaction commission — 1–3% platform fee</li>
        </ol>
      </section>
    </div>
  );
}