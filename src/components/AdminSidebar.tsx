"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Inbox,
  Flag,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/farmers", label: "Farmers", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/requests", label: "Requests", icon: Inbox },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:w-60 shrink-0">
      <div className="md:sticky md:top-20 md:rounded-3xl md:bg-gradient-to-b md:from-brand-800 md:via-brand-800 md:to-brand-900 md:p-3 md:shadow-lifted">
        {/* Section label — desktop only */}
        <div className="hidden md:block px-3 pt-2 pb-3 border-b border-white/10 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-200">
            Admin Panel
          </p>
          <p className="text-sm font-semibold text-white mt-0.5">
            FarmLink Zim
          </p>
        </div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200",
                  active
                    ? "bg-white text-brand-800 shadow-sm"
                    : "text-brand-100/85 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={active ? 2.5 : 2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer badge — desktop only */}
        <div className="hidden md:block mt-3 pt-3 border-t border-white/10 px-3 pb-2">
          <p className="text-[10px] text-brand-200/70 leading-relaxed">
            Signed in as admin
          </p>
        </div>
      </div>
    </aside>
  );
}