"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flag,
  ExternalLink,
  Check,
  Eye,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { timeAgo } from "@/lib/utils";

interface ReportCardProps {
  report: {
    id: string;
    reason: string;
    details: string | null;
    status: string;
    createdAt: Date;
    product: {
      id: string;
      title: string;
      isActive: boolean;
      farmer: {
        id: string;
        farmName: string;
        user: { fullName: string };
      };
    } | null;
  };
}

const statusVariant: Record<string, any> = {
  OPEN: "warning",
  REVIEWED: "brand",
  ACTIONED: "success",
  DISMISSED: "default",
};

const reasonLabel: Record<string, string> = {
  SPAM: "Spam",
  INAPPROPRIATE: "Inappropriate content",
  FRAUD: "Fraud or scam",
  WRONG_CATEGORY: "Wrong category",
  OTHER: "Other",
};

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function act(action: "dismiss" | "review" | "action") {
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/admin/reports/${report.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes: notes || undefined }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Action failed");
      setBusy(false);
      return;
    }

    setBusy(false);
    setNotesOpen(false);
    setNotes("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <Flag className="h-4 w-4 text-red-600" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm text-gray-900">
                {reasonLabel[report.reason] || report.reason}
              </p>
              <Badge variant={statusVariant[report.status] || "default"}>
                {report.status}
              </Badge>
            </div>
            {report.details && (
              <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">
                {report.details}
              </p>
            )}

            {report.product ? (
              <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-500">
                <Link
                  href={`/products/${report.product.id}`}
                  className="inline-flex items-center gap-1 text-brand-700 hover:text-brand-800 font-medium"
                >
                  {report.product.title}
                  <ExternalLink className="h-3 w-3" strokeWidth={2} />
                </Link>
                <span className="text-gray-300">•</span>
                <span>
                  {report.product.farmer.user.fullName} —{" "}
                  {report.product.farmer.farmName}
                </span>
                {!report.product.isActive && (
                  <Badge variant="danger">REMOVED</Badge>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">
                Product no longer exists
              </p>
            )}

            <p className="mt-2 text-[11px] text-gray-400">
              Reported {timeAgo(new Date(report.createdAt))}
            </p>
          </div>
        </div>
      </div>

      {report.status === "OPEN" || report.status === "REVIEWED" ? (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {!notesOpen ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => act("dismiss")}
                disabled={busy}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
                Dismiss
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => act("review")}
                disabled={busy}
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                Mark reviewed
              </Button>
              {report.product && report.product.isActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNotesOpen(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Remove listing
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 max-w-md">
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
                  onClick={() => setNotesOpen(false)}
                  className="text-red-700 hover:text-red-900"
                  aria-label="Cancel"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
              <div className="mt-2">
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  onClick={() => setNotesOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => act("action")}
                  disabled={busy}
                  className="h-8 text-xs"
                >
                  {busy ? "Removing..." : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}