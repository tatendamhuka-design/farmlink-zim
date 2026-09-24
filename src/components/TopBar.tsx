import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { NotificationBell } from "@/components/NotificationBell";

interface TopBarProps {
  location?: string;
}

export function TopBar({ location = "Harare" }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#f8faf9]/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-brand-800 text-base hidden sm:inline">
            FarmLink <span className="text-brand-600">Zim</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-brand-300 transition-colors"
          >
            <MapPin className="h-4 w-4 text-brand-600" strokeWidth={2} />
            <span className="font-medium">{location}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
          </button>
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}