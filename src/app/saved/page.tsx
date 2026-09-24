import Link from "next/link";
import { Heart } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { SavedProductsList } from "@/components/SavedProductsList";

export const metadata = { title: "Saved Products" };
export const dynamic = "force-dynamic";

export default function SavedPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location="Harare" />

      <main className="max-w-6xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-red-500" strokeWidth={2.5} />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Saved Products
          </h1>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Products you&apos;ve saved for later.
        </p>

        <SavedProductsList />
      </main>

      <BottomNav />
    </div>
  );
}