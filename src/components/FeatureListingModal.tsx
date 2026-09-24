"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Tier = {
  id: "three" | "seven" | "fourteen";
  days: number;
  price: number;
  label: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  { id: "three", days: 3, price: 1, label: "3 days" },
  { id: "seven", days: 7, price: 3, label: "7 days", popular: true },
  { id: "fourteen", days: 14, price: 5, label: "14 days" },
];

interface FeatureListingModalProps {
  productId: string;
  productTitle: string;
  isFeatured?: boolean;
  expiresAt?: string | null;
  onClose: () => void;
}

export function FeatureListingModal({
  productId,
  productTitle,
  isFeatured,
  expiresAt,
  onClose,
}: FeatureListingModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Tier["id"]>("seven");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const paymentsEnabled = false; // reflects PAYMENTS_ENABLED env

  async function submit() {
    setBusy(true);
    setError(null);

    const res = await fetch("/api/farmer/featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, tier: selected }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not feature listing.");
      setBusy(false);
      return;
    }

    setSuccess(true);
    setBusy(false);

    setTimeout(() => {
      router.refresh();
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-lifted">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-500" strokeWidth={2} />
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                <CheckCircle2
                  className="h-8 w-8 text-brand-600"
                  strokeWidth={2}
                />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">
              Listing is now featured
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              It will appear at the top of search results.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-amber-500" strokeWidth={2.5} />
              <h2 className="text-lg font-semibold text-gray-900">
                Feature this listing
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Push &ldquo;{productTitle}&rdquo; to the top of search results
              and add a Featured label.
            </p>

            {isFeatured && expiresAt && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                <Info
                  className="h-4 w-4 text-amber-700 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-xs text-amber-800">
                  Already featured until{" "}
                  {new Date(expiresAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  . Extending will add more time.
                </p>
              </div>
            )}

            {!paymentsEnabled && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 flex items-start gap-2">
                <Info
                  className="h-4 w-4 text-blue-700 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-xs text-blue-800">
                  Demo mode — no real payment is taken. Featured status will
                  apply immediately.
                </p>
              </div>
            )}

            <div className="mt-5 space-y-2">
              {TIERS.map((tier) => {
                const active = selected === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelected(tier.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-colors",
                      active
                        ? "border-brand-600 bg-brand-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                          active
                            ? "border-brand-600 bg-brand-600"
                            : "border-gray-300 bg-white"
                        )}
                      >
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium text-sm",
                            active ? "text-brand-900" : "text-gray-900"
                          )}
                        >
                          {tier.label}
                          {tier.popular && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              Popular
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Higher in search results
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-base font-semibold",
                        active ? "text-brand-800" : "text-gray-900"
                      )}
                    >
                      ${tier.price}
                    </span>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
                <AlertCircle
                  className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Button variant="outline" fullWidth onClick={onClose}>
                Cancel
              </Button>
              <Button fullWidth onClick={submit} disabled={busy}>
                {busy ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}