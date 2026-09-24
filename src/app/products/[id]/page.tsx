import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Truck,
  Package,
  Calendar,
  ArrowLeft,
  Star,
  type LucideIcon,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { VerificationBadge } from "@/components/VerificationBadge";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { EnquiryButton } from "@/components/EnquiryButton";
import { getProductById, getRelatedProducts } from "@/lib/queries";
import { formatPrice, formatQuantity } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductById(params.id);

  if (!product || !product.isActive) {
    notFound();
  }

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  const farmer = product.farmer;
  const farmerUser = farmer.user;
  const isVerified = farmer.verificationStatus === "VERIFIED";
  const isFeatured = product.featured?.isActive;

  return (
    <div className="min-h-screen pb-28 md:pb-12 bg-gradient-to-b from-brand-50/50 to-transparent">
      <TopBar location="Harare" />

      <main className="max-w-6xl mx-auto px-4">
        {/* BACK */}
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to products
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* GALLERY */}
          <div className="relative">
            <ProductGallery images={product.images} title={product.title} />

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <SaveButton productId={product.id} />
              <ShareButton title={product.title} />
            </div>
          </div>

          {/* DETAILS */}
          <div>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-500/30">
                <Star className="h-3 w-3 fill-white" strokeWidth={2.5} />
                Featured
              </span>
            )}

            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-bold text-brand-800 tracking-tight">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                /{product.priceUnit}
              </span>
            </div>

            {/* QUICK FACTS */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Fact
                icon={Package}
                label="Quantity available"
                value={formatQuantity(product.quantity, product.unit)}
              />
              <Fact icon={MapPin} label="Location" value={product.city} />
              {product.minimumOrder && (
                <Fact
                  icon={Package}
                  label="Minimum order"
                  value={`${product.minimumOrder} ${product.unit}`}
                />
              )}
              <Fact
                icon={Truck}
                label="Delivery"
                value={product.deliveryAvailable ? "Available" : "Pickup only"}
              />
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <div className="mt-7">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="mt-6">
              <EnquiryButton
                product={{
                  id: product.id,
                  title: product.title,
                  quantity: product.quantity,
                  unit: product.unit,
                }}
                farmer={{
                  name: farmerUser.fullName,
                  whatsappNumber: farmer.whatsappNumber,
                  phoneNumber: farmer.phoneNumber,
                }}
              />
            </div>

            {/* FARMER CARD — deep green treatment */}
            <div className="mt-6 rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 text-white p-5 shadow-lifted">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center shrink-0 ring-1 ring-inset ring-white/25">
                  <span className="font-semibold text-white text-lg">
                    {farmerUser.fullName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {farmerUser.fullName}
                  </p>
                  <p className="text-xs text-brand-100/80 truncate">
                    {farmer.farmName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-50 bg-white/10 backdrop-blur px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        Verified Farmer
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-brand-100/80">
                      <Calendar className="h-3 w-3" strokeWidth={2} />
                      Member since{" "}
                      {new Date(farmerUser.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-1.5 text-xs text-brand-100/80">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                {farmer.area ? `${farmer.area}, ` : ""}
                {farmer.city}, {farmer.province}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                More in {product.category.name}
              </h2>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs text-brand-700 font-medium hover:text-brand-800"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
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
    <div className="rounded-2xl bg-white border border-brand-100/70 p-3.5 shadow-soft">
      <div className="flex items-center gap-1.5 text-brand-700 text-xs font-medium">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}