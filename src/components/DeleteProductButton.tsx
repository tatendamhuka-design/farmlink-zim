"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DeleteProductButtonProps {
  productId: string;
  className?: string;
}

export function DeleteProductButton({
  productId,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/farmer/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not delete.");
        setDeleting(false);
        return;
      }

      router.push("/farmer/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error.");
      setDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setConfirming(true)}
        className={cn("text-red-600 border-red-200 hover:bg-red-50", className)}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
        Delete
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 w-full max-w-sm">
      <div className="flex items-start gap-2">
        <AlertCircle
          className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
          strokeWidth={2}
        />
        <div className="flex-1">
          <p className="text-sm text-red-800 font-medium">
            Delete this listing?
          </p>
          <p className="text-xs text-red-700 mt-0.5">
            This cannot be undone.
          </p>
          {error && (
            <p className="text-xs text-red-800 mt-1">{error}</p>
          )}
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}