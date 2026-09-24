"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Package, Flag, ShieldCheck } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  initial: {
    id: string;
    title: string;
    body: string;
    link: string | null;
    isRead: boolean;
    type: string;
    createdAt: Date;
  }[];
}

const typeIcon: Record<string, any> = {
  PRODUCT_ENQUIRY: Package,
  SOURCING_REQUEST_MATCH: Flag,
  NEW_LISTING_NEARBY: Package,
  VERIFICATION_UPDATE: ShieldCheck,
  SYSTEM: Bell,
};

export function NotificationsList({ initial }: NotificationsListProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);

  const unread = items.filter((n) => !n.isRead).length;

  async function markAll() {
    setBusy(true);
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setBusy(false);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
            <Bell className="h-7 w-7 text-brand-700" strokeWidth={2} />
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">No notifications</h3>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll let you know when something happens.
        </p>
      </div>
    );
  }

  return (
    <div>
      {unread > 0 && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{unread}</span> unread
          </p>
          <button
            type="button"
            onClick={markAll}
            disabled={busy}
            className="text-xs text-brand-700 font-medium hover:text-brand-800 inline-flex items-center gap-1"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((n) => {
          const Icon = typeIcon[n.type] || Bell;
          const inner = (
            <div
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                n.isRead
                  ? "border-gray-100 bg-white"
                  : "border-brand-200 bg-brand-50/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    n.isRead
                      ? "bg-gray-100 text-gray-600"
                      : "bg-brand-600 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm text-gray-900">
                      {n.title}
                    </p>
                    <span className="text-[11px] text-gray-500 shrink-0">
                      {timeAgo(new Date(n.createdAt))}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{n.body}</p>
                </div>
              </div>
            </div>
          );

          return n.link ? (
            <Link key={n.id} href={n.link}>
              {inner}
            </Link>
          ) : (
            <div key={n.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}