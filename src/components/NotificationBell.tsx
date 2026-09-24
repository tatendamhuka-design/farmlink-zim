"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bell,
  Check,
  Package,
  Flag,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { timeAgo, cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  type: string;
  createdAt: string;
}

const typeIcon: Record<string, any> = {
  PRODUCT_ENQUIRY: Package,
  SOURCING_REQUEST_MATCH: Flag,
  NEW_LISTING_NEARBY: Package,
  VERIFICATION_UPDATE: ShieldCheck,
  SYSTEM: Bell,
};

export function NotificationBell() {
  const { status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (cancelled) return;
        setItems(data.notifications || []);
        setUnread(data.unread || 0);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60_000); // refresh every 60s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status]);

  async function markAllRead() {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
    router.refresh();
  }

  async function markOneRead(id: string) {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnread((prev) => Math.max(0, prev - 1));
  }

  if (status !== "authenticated") return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative h-9 w-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-brand-300 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-gray-700" strokeWidth={2} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-100 bg-white shadow-lifted overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              Notifications
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-brand-700 font-medium hover:text-brand-800 inline-flex items-center gap-1"
              >
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center">
                    <Bell
                      className="h-6 w-6 text-brand-700"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  You&apos;re all caught up
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  No new notifications.
                </p>
              </div>
            ) : (
              <ul>
                {items.map((n) => {
                  const Icon = typeIcon[n.type] || Bell;
                  const inner = (
                    <div
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors",
                        !n.isRead && "bg-brand-50/30"
                      )}
                    >
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
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-gray-500 shrink-0">
                            {timeAgo(new Date(n.createdAt))}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                          {n.body}
                        </p>
                      </div>
                    </div>
                  );

                  return (
                    <li key={n.id}>
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => {
                            if (!n.isRead) markOneRead(n.id);
                            setOpen(false);
                          }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!n.isRead) markOneRead(n.id);
                          }}
                          className="w-full text-left"
                        >
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-4 py-3 border-t border-gray-100 text-xs font-medium text-brand-700 hover:bg-brand-50"
          >
            View all in profile
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}