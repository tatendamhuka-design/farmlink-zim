import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: "brand" | "amber" | "blue";
}

const accentClasses: Record<string, { bg: string; ring: string; icon: string }> = {
  brand: {
    bg: "bg-gradient-to-br from-brand-500 to-brand-700",
    ring: "ring-brand-100",
    icon: "text-white",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-400 to-amber-600",
    ring: "ring-amber-100",
    icon: "text-white",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-500 to-blue-700",
    ring: "ring-blue-100",
    icon: "text-white",
  },
};

export function DashboardStat({
  icon: Icon,
  label,
  value,
  accent = "brand",
}: DashboardStatProps) {
  const styles = accentClasses[accent] || accentClasses.brand;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shadow-sm ring-4",
            styles.bg,
            styles.ring
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} strokeWidth={2.5} />
        </div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900 tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}