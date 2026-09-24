import Link from "next/link";
import {
  Carrot,
  Apple,
  Wheat,
  Beef,
  Bird,
  Egg,
  Milk,
  Package,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  carrot: Carrot,
  apple: Apple,
  wheat: Wheat,
  beef: Beef,
  bird: Bird,
  egg: Egg,
  milk: Milk,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  icon?: string | null;
  className?: string;
}

export function CategoryCard({
  name,
  slug,
  icon,
  className,
}: CategoryCardProps) {
  const Icon = (icon && iconMap[icon]) || Package;

  return (
    <Link
      href={`/products?category=${slug}`}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white",
        "shadow-glow hover:shadow-glow-hover ring-1 ring-brand-100/60",
        "card-3d",
        "transition-all",
        className
      )}
    >
      <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 group-hover:from-brand-100 group-hover:to-brand-200 transition-colors ring-inset-soft">
        <Icon
          className="h-6 w-6 text-brand-700 transition-transform duration-500 ease-bounce group-hover:scale-110"
          strokeWidth={2}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {name}
      </span>
    </Link>
  );
}