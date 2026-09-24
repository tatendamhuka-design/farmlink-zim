"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye, Trash2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminListingActionsProps {
  productId: string;
  isActive: boolean;
}

export function AdminListingActions({
  productId,
  isActive,
}: AdminListingActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<"remove" | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function act(action: "remove" | "pause" | "restore", note?: string) {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: note }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Action failed");
      setBusy(false);
      return;
    }

    setBusy(false);
    setConfirming(null);
    setReason("");
    router.refresh();
  }

  if (confirming === "remove") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 w-64">
        <div className="flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-red-800">
              Remove this listing?
            </p>
            <p className="text-[11px] text-red-700 mt-0.5">
              The farmer will be notified.
            </p>
          </div>
          <button
            onClick={() => setConfirming(null)}
            className="text-red-700 hover:text-red-900"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="mt-2">
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="h-8 text-xs"
          />
        </div>
        {error && (
          <p className="mt-1 text-[11px] text-red-700">{error}</p>
        )}
        <div className="mt-2 flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfirming(null)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => act("remove", reason)}
            disabled={busy}
            className="h-8 text-xs"
          >
            {busy ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {isActive ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => act("pause")}
          disabled={busy}
          className="h-8 text-xs"
        >
          <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
          Pause
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => act("restore")}
          disabled={busy}
          className="h-8 text-xs"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Restore
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming("remove")}
        disabled={busy}
        className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        Remove
      </Button>
    </div>
  );
}