import Link from "next/link";
import { Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ListingRowActions } from "@/components/ListingRowActions";
import { formatPrice, formatQuantity } from "@/lib/utils";

interface ListingRowProps {
  product: {
    id: string;
    title: string;
    price: number;
    priceUnit: string;
    quantity: number;
    unit: string;
    city: string;
    isActive: boolean;
    isSoldOut: boolean;
    images: { url: string }[];
    featured?: { isActive: boolean; expiryDate: Date } | null;
    _count?: { enquiries: number };
  };
}

export function ListingRow({ product }: ListingRowProps) {
  const imageUrl = product.images[0]?.url || "/images/placeholder-product.svg";
  const isFeatured = product.featured?.isActive;

  const status: { label: string; variant: any } = product.isSoldOut
    ? { label: "SOLD OUT", variant: "danger" }
    : product.isActive
    ? { label: "ACTIVE", variant: "success" }
    : { label: "PAUSED", variant: "warning" };

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
      <Link
        href={`/products/${product.id}`}
        className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-gray-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/products/${product.id}`}
            className="font-medium text-sm text-gray-900 line-clamp-1 hover:text-brand-700"
          >
            {product.title}
          </Link>
          {isFeatured && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <Star className="h-2.5 w-2.5" strokeWidth={2.5} />
              Featured
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span>{formatQuantity(product.quantity, product.unit)}</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-brand-800">
            {formatPrice(product.price)}/{product.priceUnit}
          </span>
          <span className="text-gray-300">•</span>
          <span>{product.city}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant={status.variant}>{status.label}</Badge>
          {typeof product._count?.enquiries === "number" &&
            product._count.enquiries > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Eye className="h-3 w-3" strokeWidth={2} />
                {product._count.enquiries} enquir
                {product._count.enquiries === 1 ? "y" : "ies"}
              </span>
            )}
        </div>
      </div>

      <ListingRowActions
        productId={product.id}
        productTitle={product.title}
        isActive={product.isActive}
        isSoldOut={product.isSoldOut}
        isFeatured={isFeatured || false}
        featuredUntil={
          product.featured?.expiryDate
            ? new Date(product.featured.expiryDate).toISOString()
            : null
        }
      />
    </div>
  );
}