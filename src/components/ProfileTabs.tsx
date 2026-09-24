"use client";

import { useState } from "react";
import { Heart, Inbox, MessageSquare, Bell, Settings } from "lucide-react";
import { SavedProductsList } from "@/components/SavedProductsList";
import { MyRequestsList } from "@/components/MyRequestsList";
import { MyEnquiriesList } from "@/components/MyEnquiriesList";
import { NotificationsList } from "@/components/NotificationsList";
import { SettingsForm } from "@/components/SettingsForm";
import { cn } from "@/lib/utils";

type Tab = "saved" | "requests" | "enquiries" | "notifications" | "settings";

interface ProfileTabsProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  requests: any[];
  enquiries: any[];
  notifications: any[];
  customerProfile: {
    province: string;
    city: string;
    area: string;
  } | null;
}

export function ProfileTabs({
  user,
  requests,
  enquiries,
  notifications,
  customerProfile,
}: ProfileTabsProps) {
  const [tab, setTab] = useState<Tab>("saved");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs: { value: Tab; label: string; icon: any; badge?: number }[] = [
    { value: "saved", label: "Saved", icon: Heart },
    { value: "requests", label: "Requests", icon: Inbox },
    { value: "enquiries", label: "Enquiries", icon: MessageSquare },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mt-6">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-gray-100">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                active
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {t.label}
              {t.badge && t.badge > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-5">
        {tab === "saved" && <SavedProductsList />}
        {tab === "requests" && <MyRequestsList requests={requests} />}
        {tab === "enquiries" && <MyEnquiriesList enquiries={enquiries} />}
        {tab === "notifications" && (
          <NotificationsList initial={notifications} />
        )}
        {tab === "settings" && (
          <SettingsForm user={user} customerProfile={customerProfile} />
        )}
      </div>
    </div>
  );
}