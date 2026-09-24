import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label || "Loading"}
      className={cn(
        "inline-block rounded-full border-brand-200 border-t-brand-600 animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}

/**
 * Full-page centered spinner — used in loading.tsx fallbacks where
 * a skeleton isn't a good fit.
 */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      {label && (
        <p className="text-sm text-gray-500">{label}</p>
      )}
    </div>
  );
}