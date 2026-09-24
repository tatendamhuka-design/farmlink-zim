import Link from "next/link";
import { getAllFarmers, getPendingFarmers } from "@/lib/queries";
import { FarmerRow } from "@/components/FarmerRow";
import { cn } from "@/lib/utils";

export const metadata = { title: "Farmers — Admin" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { filter?: string };
}

export default async function AdminFarmersPage({ searchParams }: PageProps) {
  const filter = searchParams.filter || "all";

  const farmers =
    filter === "pending" ? await getPendingFarmers() : await getAllFarmers(100);

  const tabs = [
    { value: "all", label: "All farmers" },
    { value: "pending", label: "Pending verification" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Farmers
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage verification and farmer accounts.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {tabs.map((tab) => {
          const active = filter === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/admin/farmers${tab.value === "all" ? "" : `?filter=${tab.value}`}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
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

      {farmers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            {filter === "pending"
              ? "No farmers waiting for verification."
              : "No farmers registered yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {farmers.map((farmer) => (
            <FarmerRow key={farmer.id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
}