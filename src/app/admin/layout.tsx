import { requireAdmin } from "@/lib/permissions";
import { TopBar } from "@/components/TopBar";
import { AdminSidebar } from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-gradient-to-b from-brand-50/60 to-transparent">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}