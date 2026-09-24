import Link from "next/link";
import { MapPin, Truck, Star, Heart } from "lucide-react";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatPrice, formatQuantity, cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    priceUnit: string;
    quantity: number;
    unit: string;
    city: string;
    deliveryAvailable: boolean;
    images: { url: string }[];
    farmer: {
      verificationStatus: string;
    };
    featured?: { isActive: boolean } | null;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = product.images[0]?.url || "/images/placeholder-product.svg";
  const isVerified = product.farmer.verificationStatus === "VERIFIED";
  const isFeatured = product.featured?.isActive;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden",
        "card-3d shine-sweep texture-fine",
        isFeatured
          ? "shadow-glow-amber hover:shadow-glow-amber-hover ring-1 ring-amber-200/60"
          : "shadow-glow hover:shadow-glow-hover ring-1 ring-brand-100/60",
        className
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md shadow-amber-500/30">
            <Star className="h-3 w-3 fill-white" strokeWidth={2.5} />
            Featured
          </div>
        )}

        {/* Save heart in top-right */}
        <div className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart className="h-4 w-4 text-gray-600" strokeWidth={2} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-[15px] leading-snug">
            {product.title}
          </h3>
        </div>

        <p className="text-xs text-gray-500 -mt-1">
          {formatQuantity(product.quantity, product.unit)} available
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-bold text-brand-800 tracking-tight">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            /{product.priceUnit}
          </span>
        </div>

        {/* Location + delivery row */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="line-clamp-1">{product.city}</span>
          </div>
          {product.deliveryAvailable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-md shrink-0">
              <Truck className="h-3 w-3" strokeWidth={2.5} />
              Delivery
            </span>
          )}
        </div>

        {/* Verified row */}
        {isVerified && (
          <div className="mt-1 pt-2 border-t border-gray-100">
            <VerificationBadge verified size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
}