"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MoreVertical,
  Pencil,
  Package,
  PauseCircle,
  PlayCircle,
  Trash2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureListingModal } from "@/components/FeatureListingModal";

interface ListingRowActionsProps {
  productId: string;
  productTitle?: string;
  isActive: boolean;
  isSoldOut: boolean;
  isFeatured?: boolean;
  featuredUntil?: string | null;
}

export function ListingRowActions({
  productId,
  productTitle = "this listing",
  isActive,
  isSoldOut,
  isFeatured,
  featuredUntil,
}: ListingRowActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function patch(data: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/farmer/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setBusy(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
        className="h-9 w-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
        aria-label="Listing actions"
      >
        <MoreVertical className="h-4 w-4" strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 rounded-xl border border-gray-100 bg-white shadow-lifted overflow-hidden z-40">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setFeatureOpen(true);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-800 hover:bg-amber-50"
          >
            <Star className="h-4 w-4" strokeWidth={2} />
            {isFeatured ? "Extend feature" : "Feature listing"}
          </button>

          <Link
            href={`/farmer/listings/${productId}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
            Edit listing
          </Link>

          {!isSoldOut && (
            <button
              type="button"
              onClick={() => patch({ isSoldOut: true })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Package className="h-4 w-4" strokeWidth={2} />
              Mark as sold out
            </button>
          )}

          {isSoldOut && (
            <button
              type="button"
              onClick={() => patch({ isSoldOut: false })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Package className="h-4 w-4" strokeWidth={2} />
              Back in stock
            </button>
          )}

          {isActive ? (
            <button
              type="button"
              onClick={() => patch({ isActive: false })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <PauseCircle className="h-4 w-4" strokeWidth={2} />
              Pause listing
            </button>
          ) : (
            <button
              type="button"
              onClick={() => patch({ isActive: true })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <PlayCircle className="h-4 w-4" strokeWidth={2} />
              Resume listing
            </button>
          )}

          <div className="border-t border-gray-100">
            <Link
              href={`/farmer/listings/${productId}/edit`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              )}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Delete
            </Link>
          </div>
        </div>
      )}

      {featureOpen && (
        <FeatureListingModal
          productId={productId}
          productTitle={productTitle}
          isFeatured={isFeatured}
          expiresAt={featuredUntil}
          onClose={() => setFeatureOpen(false)}
        />
      )}
    </div>
  );
}