import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { ProductForm } from "@/components/ProductForm";
import { DeleteProductButton } from "@/components/DeleteProductButton";
import { requireFarmer } from "@/lib/permissions";
import {
  getCategories,
  getFarmerProfileByUserId,
  getFarmerProductById,
} from "@/lib/queries";

export const metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: PageProps) {
  const user = await requireFarmer();
  const profile = await getFarmerProfileByUserId(user.id);
  if (!profile) notFound();

  const [categories, product] = await Promise.all([
    getCategories(),
    getFarmerProductById(params.id, profile.id),
  ]);

  if (!product) notFound();

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

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Edit Product
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Update details, price, quantity, or photos.
            </p>
          </div>
          <DeleteProductButton productId={product.id} />
        </div>

        <div className="mt-6">
          <ProductForm
            categories={categories}
            mode="edit"
            initialData={{
              id: product.id,
              title: product.title,
              categoryId: product.categoryId,
              description: product.description,
              quantity: product.quantity,
              unit: product.unit,
              price: product.price,
              priceUnit: product.priceUnit,
              province: product.province,
              city: product.city,
              area: product.area,
              minimumOrder: product.minimumOrder,
              deliveryAvailable: product.deliveryAvailable,
              images: product.images.map((i) => ({ url: i.url })),
            }}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}