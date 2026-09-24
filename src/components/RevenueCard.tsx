import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueCardProps {
  icon: LucideIcon;
  label: string;
  amount: number;
  pendingAmount?: number;
  accent?: "brand" | "amber" | "blue";
}

const accentClasses: Record<string, { bg: string; ring: string }> = {
  brand: { bg: "bg-gradient-to-br from-brand-500 to-brand-700", ring: "ring-brand-100" },
  amber: { bg: "bg-gradient-to-br from-amber-400 to-amber-600", ring: "ring-amber-100" },
  blue: { bg: "bg-gradient-to-br from-blue-500 to-blue-700", ring: "ring-blue-100" },
};

function fmt(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function RevenueCard({
  icon: Icon,
  label,
  amount,
  pendingAmount,
  accent = "brand",
}: RevenueCardProps) {
  const styles = accentClasses[accent] || accentClasses.brand;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shadow-sm ring-4",
            styles.bg,
            styles.ring
          )}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 tabular-nums tracking-tight">
        {fmt(amount)}
      </p>
      {typeof pendingAmount === "number" && pendingAmount > 0 && (
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          {fmt(pendingAmount)} pending
        </span>
      )}
    </div>
  );
}