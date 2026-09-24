import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Package,
  Inbox,
  UserCircle2,
  ArrowRight,
} from "lucide-react";
import { DashboardStat } from "@/components/DashboardStat";
import { Badge } from "@/components/ui/Badge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getAdminStats,
  getPendingFarmers,
  getRecentListings,
} from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, pending, recent] = await Promise.all([
    getAdminStats(),
    getPendingFarmers(),
    getRecentListings(8),
  ]);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of FarmLink Zim activity.
        </p>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <DashboardStat
          icon={Users}
          label="Total farmers"
          value={stats.totalFarmers}
          accent="brand"
        />
        <DashboardStat
          icon={ShieldCheck}
          label="Verified farmers"
          value={stats.verifiedFarmers}
          accent="brand"
        />
        <DashboardStat
          icon={Package}
          label="Active listings"
          value={stats.activeListings}
          accent="blue"
        />
        <DashboardStat
          icon={Inbox}
          label="Open requests"
          value={stats.openRequests}
          accent="amber"
        />
        <DashboardStat
          icon={UserCircle2}
          label="Total users"
          value={stats.totalUsers}
          accent="blue"
        />
      </section>

      {/* PENDING VERIFICATIONS */}
      <section className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Pending verifications
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Farmers waiting for review
            </p>
          </div>
          <Link
            href="/admin/farmers?filter=pending"
            className="text-xs text-brand-700 font-medium hover:text-brand-800 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </Link>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-100 bg-brand-50/40 p-6 text-center">
            <p className="text-sm text-gray-600">
              No farmers waiting for verification.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pending.slice(0, 5).map((farmer) => (
              <div
                key={farmer.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
                  <span className="font-medium text-white text-sm">
                    {farmer.user.fullName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {farmer.user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {farmer.farmName} — {farmer.city}, {farmer.province}
                  </p>
                </div>
                <Badge variant="warning">PENDING</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RECENT LISTINGS */}
      <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Recent listings
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest products added by farmers
            </p>
          </div>
          <Link
            href="/admin/listings"
            className="text-xs text-brand-700 font-medium hover:text-brand-800 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="space-y-2">
          {recent.map((p) => {
            const imageUrl =
              p.images[0]?.url || "/images/placeholder-product.svg";
            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {p.farmer.farmName} — {p.category.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">
                    {timeAgo(new Date(p.createdAt))}
                  </p>
                  {p.farmer.verificationStatus === "VERIFIED" && (
                    <div className="mt-1">
                      <VerificationBadge verified size="sm" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}