import Link from "next/link";
import {
  Package,
  MessageSquare,
  TrendingUp,
  Plus,
  MapPin,
  Calendar,
  Inbox,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { DashboardStat } from "@/components/DashboardStat";
import { ListingRow } from "@/components/ListingRow";
import { VerificationBadge } from "@/components/VerificationBadge";
import { requireFarmer } from "@/lib/permissions";
import {
  getFarmerProfileByUserId,
  getFarmerStats,
  getFarmerListings,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FarmerDashboardPage() {
  const user = await requireFarmer();

  const profile = await getFarmerProfileByUserId(user.id);
  if (!profile) {
    return (
      <div className="min-h-screen">
        <TopBar />
        <main className="max-w-3xl mx-auto px-4 pt-10 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Farmer profile not found
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Please contact support.
          </p>
        </main>
        <BottomNav />
      </div>
    );
  }

  const [stats, listings] = await Promise.all([
    getFarmerStats(profile.id),
    getFarmerListings(profile.id),
  ]);

  const isVerified = profile.verificationStatus === "VERIFIED";
  const greeting = getGreeting();
  const firstName = user.name?.split(" ")[0] || "Farmer";

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/50 to-transparent">
      <TopBar location={profile.city} />

      <main className="max-w-5xl mx-auto px-4 pt-5">
        {/* HEADER */}
        <section className="rounded-3xl bg-white border border-gray-100 shadow-soft p-5">
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-glow">
              <span className="font-semibold text-white text-xl">
                {firstName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {greeting}, {firstName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <VerificationBadge verified={isVerified} size="sm" />
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" strokeWidth={2} />
                  {profile.area ? `${profile.area}, ` : ""}
                  {profile.city}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" strokeWidth={2} />
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {!isVerified && profile.verificationStatus === "UNVERIFIED" && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm text-amber-900 font-medium">
                Get verified to build buyer trust
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Verified farmers get a badge on all their listings.
              </p>
            </div>
          )}
        </section>

        {/* STATS */}
        <section className="mt-5 grid grid-cols-3 gap-3">
          <DashboardStat
            icon={Package}
            label="Active listings"
            value={stats.activeListings}
            accent="brand"
          />
          <DashboardStat
            icon={MessageSquare}
            label="Total enquiries"
            value={stats.totalEnquiries}
            accent="blue"
          />
          <DashboardStat
            icon={TrendingUp}
            label="Sold this week"
            value={stats.soldThisWeek}
            accent="amber"
          />
        </section>

        {/* ACTIONS */}
        <section className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/farmer/listings/new"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add Product
          </Link>
          <Link
            href="/farmer/enquiries"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium hover:border-gray-300 transition-colors"
          >
            <Inbox className="h-4 w-4" strokeWidth={2} />
            View Enquiries
          </Link>
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-medium hover:border-gray-300 transition-colors"
          >
            Buyer Requests
          </Link>
        </section>

        {/* LISTINGS */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Your Listings
            </h2>
            <span className="text-xs text-gray-500">
              {listings.length} total
            </span>
          </div>

          {listings.length === 0 ? (
            <EmptyListings />
          ) : (
            <div className="space-y-2">
              {listings.map((listing) => (
                <ListingRow key={listing.id} product={listing} />
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

function EmptyListings() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
          <Package className="h-7 w-7 text-brand-700" strokeWidth={2} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900">No listings yet</h3>
      <p className="text-sm text-gray-500 mt-1">
        Add your first product to start selling.
      </p>
      <Link
        href="/farmer/listings/new"
        className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Add Product
      </Link>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}