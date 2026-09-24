import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function VerificationBadge({
  verified,
  size = "sm",
  className,
}: VerificationBadgeProps) {
  if (!verified) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium text-brand-700",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
      aria-label="Verified Farmer"
    >
      <ShieldCheck
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={2.5}
      />
      Verified Farmer
    </span>
  );
}