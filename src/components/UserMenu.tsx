"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Heart,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-300"
      >
        <User className="h-4 w-4" strokeWidth={2} />
        Sign in
      </Link>
    );
  }

  const user = session.user as any;
  const role = user.role as string;
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  const dashboardHref =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "FARMER"
      ? "/farmer/dashboard"
      : "/profile";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-9 w-9 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center hover:bg-brand-700 transition-colors"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lifted overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || "Account"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
              {role}
            </p>
          </div>

          <div className="py-1">
            <MenuItem href={dashboardHref} icon={LayoutDashboard}>
              Dashboard
            </MenuItem>

            {role === "CUSTOMER" && (
              <MenuItem href="/saved" icon={Heart}>
                Saved products
              </MenuItem>
            )}

            {role === "ADMIN" && (
              <MenuItem href="/admin/dashboard" icon={ShieldCheck}>
                Admin panel
              </MenuItem>
            )}

            <MenuItem href="/profile" icon={Settings}>
              Profile settings
            </MenuItem>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
      {children}
    </Link>
  );
}