import Link from "next/link";
import { Flag } from "lucide-react";
import { ReportCard } from "@/components/ReportCard";
import { getAdminReports } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "Reports — Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { status?: string };
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const status = searchParams.status || "open";

  const reports = await getAdminReports({
    status: status === "all" ? undefined : status.toUpperCase(),
    take: 100,
  });

  const tabs = [
    { value: "open", label: "Open" },
    { value: "reviewed", label: "Reviewed" },
    { value: "actioned", label: "Actioned" },
    { value: "dismissed", label: "Dismissed" },
    { value: "all", label: "All" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Reports
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review reports filed against listings by buyers.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/admin/reports?status=${tab.value}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="flex justify-center mb-3">
            <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
              <Flag className="h-7 w-7 text-brand-700" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            No {status === "all" ? "" : status} reports.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={{
                id: r.id,
                reason: r.reason,
                details: r.details,
                status: r.status,
                createdAt: r.createdAt,
                product: r.product
                  ? {
                      id: r.product.id,
                      title: r.product.title,
                      isActive: r.product.isActive,
                      farmer: {
                        id: r.product.farmer.id,
                        farmName: r.product.farmer.farmName,
                        user: {
                          fullName: r.product.farmer.user.fullName,
                        },
                      },
                    }
                  : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}