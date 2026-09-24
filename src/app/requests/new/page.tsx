import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { RequestForm } from "@/components/RequestForm";

export const metadata = {
  title: "Post What You Need",
};

export default function NewRequestPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location="Harare" />

      <main className="max-w-2xl mx-auto px-4 pt-5">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Post What You Need
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Can&apos;t find what you&apos;re looking for? Tell farmers what you
          need and we&apos;ll help connect you.
        </p>

        <div className="mt-6">
          <RequestForm />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}