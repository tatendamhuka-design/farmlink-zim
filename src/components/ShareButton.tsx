"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  variant?: "icon" | "button";
  className?: string;
}

export function ShareButton({
  title,
  text,
  variant = "icon",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareText = text || `Check out ${title} on FarmLink Zim`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:border-gray-300 transition-colors",
          className
        )}
      >
        <Share2 className="h-4 w-4" strokeWidth={2} />
        {copied ? "Link copied" : "Share"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share product"
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 backdrop-blur border border-gray-200 hover:bg-white transition-colors",
        className
      )}
    >
      <Share2 className="h-5 w-5 text-gray-700" strokeWidth={2} />
    </button>
  );
}