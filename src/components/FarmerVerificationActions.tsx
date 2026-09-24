"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, X, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FarmerVerificationActionsProps {
  farmerId: string;
  status: string;
}

export function FarmerVerificationActions({
  farmerId,
  status,
}: FarmerVerificationActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function act(
    action: "verify" | "reject" | "reset",
    reasonText?: string
  ) {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/admin/farmers/${farmerId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: reasonText }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Action failed.");
      setBusy(false);
      return;
    }

    setBusy(false);
    setRejectOpen(false);
    setReason("");
    router.refresh();
  }

  if (status === "VERIFIED") {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => act("reset")}
          disabled={busy}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => act("verify")}
          disabled={busy}
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={2} />
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => act("reset")}
          disabled={busy}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
      </div>
    );
  }

  // UNVERIFIED or PENDING
  return (
    <div className="flex flex-col items-end gap-2">
      {!rejectOpen ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => act("verify")}
            disabled={busy}
          >
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
            Verify
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRejectOpen(true)}
            disabled={busy}
          >
            <X className="h-4 w-4" strokeWidth={2} />
            Reject
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-xs rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-800 font-medium mb-2">
            Reason for rejection
          </p>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Farm photos unclear"
            className="h-9 text-sm"
          />
          {error && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-700">
              <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" strokeWidth={2} />
              {error}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectOpen(false);
                setReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => act("reject", reason)}
              disabled={busy}
            >
              {busy ? "Rejecting..." : "Confirm rejection"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}