"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AdminRequestActionsProps {
  requestId: string;
  status: string;
}

export function AdminRequestActions({
  requestId,
  status,
}: AdminRequestActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function act(action: "remove" | "close" | "reopen", note?: string) {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/admin/requests/${requestId}`, {
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
    setConfirming(false);
    setReason("");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 w-64">
        <div className="flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div className="flex-1">
            <p className="text-xs font-medium text-red-800">
              Close this request?
            </p>
            <p className="text-[11px] text-red-700 mt-0.5">
              The buyer will be notified.
            </p>
          </div>
          <button
            onClick={() => setConfirming(false)}
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
        {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
        <div className="mt-2 flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConfirming(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => act("close", reason)}
            disabled={busy}
            className="h-8 text-xs"
          >
            {busy ? "Closing..." : "Close"}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "OPEN") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
        Close
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => act("reopen")}
      disabled={busy}
      className="h-8 text-xs"
    >
      <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
      Reopen
    </Button>
  );
}