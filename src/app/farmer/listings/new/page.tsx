import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { ProductForm } from "@/components/ProductForm";
import { requireFarmer } from "@/lib/permissions";
import { getCategories } from "@/lib/queries";

export const metadata = { title: "Add Product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireFarmer();
  const categories = await getCategories();

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar />

      <main className="max-w-2xl mx-auto px-4 pt-4">
        <Link
          href="/farmer/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to dashboard
        </Link>

        <h1 className="mt-4 text-xl md:text-2xl font-semibold text-gray-900">
          Add Product
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          List a new product for buyers to discover.
        </p>

        <div className="mt-6">
          <ProductForm categories={categories} mode="create" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}