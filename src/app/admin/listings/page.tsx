import Link from "next/link";
import { Star, Package, ExternalLink, Flag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AdminListingsSearch } from "@/components/AdminListingsSearch";
import { AdminListingActions } from "@/components/AdminListingActions";
import { VerificationBadge } from "@/components/VerificationBadge";
import { getAllListingsForAdmin } from "@/lib/queries";
import { formatPrice, formatQuantity, timeAgo } from "@/lib/utils";

export const metadata = { title: "Listings — Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { q?: string };
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const listings = await getAllListingsForAdmin({ q: searchParams.q, take: 100 });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Listings
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage all product listings across the marketplace.
        </p>
      </div>

      <div className="mb-4">
        <AdminListingsSearch />
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            {searchParams.q
              ? `No listings match "${searchParams.q}"`
              : "No listings yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((p) => {
            const imageUrl =
              p.images[0]?.url || "/images/placeholder-product.svg";
            const isVerified = p.farmer.verificationStatus === "VERIFIED";
            const isFeatured = p.featured?.isActive;

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-gray-100 bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  <Link
                    href={`/products/${p.id}`}
                    className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-gray-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/products/${p.id}`}
                        className="font-medium text-sm text-gray-900 truncate hover:text-brand-700"
                      >
                        {p.title}
                      </Link>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          <Star className="h-2.5 w-2.5" strokeWidth={2.5} />
                          Featured
                        </span>
                      )}
                      {!p.isActive && (
                        <Badge variant="danger">REMOVED</Badge>
                      )}
                      {p.isActive && !p.isSoldOut && (
                        <Badge variant="success">ACTIVE</Badge>
                      )}
                      {p.isSoldOut && (
                        <Badge variant="warning">SOLD OUT</Badge>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">
                        {p.farmer.user.fullName} — {p.farmer.farmName}
                      </span>
                      {isVerified && <VerificationBadge verified size="sm" />}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Package className="h-3 w-3" strokeWidth={2} />
                        {formatQuantity(p.quantity, p.unit)}
                      </span>
                      <span className="font-medium text-brand-800">
                        {formatPrice(p.price)}/{p.priceUnit}
                      </span>
                      <span>{p.category.name}</span>
                      <span>{p.city}</span>
                      <span>{timeAgo(new Date(p.createdAt))}</span>
                      {p._count.reports > 0 && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                          <Flag className="h-3 w-3" strokeWidth={2} />
                          {p._count.reports} report
                          {p._count.reports === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <AdminListingActions
                      productId={p.id}
                      isActive={p.isActive}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}