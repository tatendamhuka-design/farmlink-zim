"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  productId: string;
  initialSaved?: boolean;
  variant?: "icon" | "button";
  className?: string;
}

export function SaveButton({
  productId,
  initialSaved = false,
  variant = "icon",
  className,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  // Simple localStorage persistence for MVP (no auth needed yet)
  useEffect(() => {
    const stored = localStorage.getItem("farmlink_saved");
    const list: string[] = stored ? JSON.parse(stored) : [];
    setSaved(list.includes(productId));
  }, [productId]);

  async function toggle() {
    setLoading(true);
    const stored = localStorage.getItem("farmlink_saved");
    const list: string[] = stored ? JSON.parse(stored) : [];

    let next: string[];
    if (list.includes(productId)) {
      next = list.filter((id) => id !== productId);
      setSaved(false);
    } else {
      next = [...list, productId];
      setSaved(true);
    }

    localStorage.setItem("farmlink_saved", JSON.stringify(next));
    setLoading(false);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border font-medium transition-colors",
          saved
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
          className
        )}
      >
        <Heart
          className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")}
          strokeWidth={2}
        />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save product"}
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 hover:bg-white transition-colors",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          saved ? "fill-red-500 text-red-500" : "text-gray-700"
        )}
        strokeWidth={2}
      />
    </button>
  );
}