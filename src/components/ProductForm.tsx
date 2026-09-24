"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "@/components/ImageUploader";

const PROVINCES = [
  "Harare",
  "Bulawayo",
  "Manicaland",
  "Mashonaland Central",
  "Mashonaland East",
  "Mashonaland West",
  "Masvingo",
  "Matabeleland North",
  "Matabeleland South",
  "Midlands",
];

const UNITS = ["kg", "tonnes", "litres", "birds", "head", "trays", "bags"];

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  mode?: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    categoryId: string;
    description?: string | null;
    quantity: number;
    unit: string;
    price: number;
    priceUnit: string;
    province: string;
    city: string;
    area?: string | null;
    minimumOrder?: number | null;
    deliveryAvailable: boolean;
    images?: { url: string }[];
  };
}

export function ProductForm({
  categories,
  mode = "create",
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images?.map((i) => i.url) || []
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload: any = {
      title: String(form.get("title") || "").trim(),
      categoryId: String(form.get("categoryId") || ""),
      description: String(form.get("description") || "").trim() || undefined,
      quantity: Number(form.get("quantity")),
      unit: String(form.get("unit") || ""),
      price: Number(form.get("price")),
      priceUnit: String(form.get("priceUnit") || ""),
      province: String(form.get("province") || ""),
      city: String(form.get("city") || "").trim(),
      area: String(form.get("area") || "").trim() || undefined,
      deliveryAvailable: form.get("deliveryAvailable") === "on",
      imageUrls,
    };

    const minOrder = form.get("minimumOrder");
    if (minOrder && String(minOrder).trim() !== "") {
      payload.minimumOrder = Number(minOrder);
    }

    const url =
      mode === "create"
        ? "/api/farmer/products"
        : `/api/farmer/products/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      router.push("/farmer/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Product name"
        name="title"
        placeholder="e.g. Red Onions"
        defaultValue={initialData?.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Category
        </label>
        <select
          name="categoryId"
          required
          defaultValue={initialData?.categoryId || ""}
          className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity available"
          name="quantity"
          type="number"
          step="any"
          min="0.01"
          placeholder="500"
          defaultValue={initialData?.quantity}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Unit
          </label>
          <select
            name="unit"
            required
            defaultValue={initialData?.unit || "kg"}
            className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.70"
          defaultValue={initialData?.price}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price per
          </label>
          <select
            name="priceUnit"
            required
            defaultValue={initialData?.priceUnit || "kg"}
            className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Minimum order (optional)"
        name="minimumOrder"
        type="number"
        step="any"
        min="0"
        placeholder="e.g. 100"
        defaultValue={initialData?.minimumOrder ?? ""}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Province
          </label>
          <select
            name="province"
            required
            defaultValue={initialData?.province || "Harare"}
            className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="City / Town"
          name="city"
          placeholder="e.g. Harare"
          defaultValue={initialData?.city}
          required
        />
      </div>

      <Input
        label="Area (optional)"
        name="area"
        placeholder="e.g. Mabvuku"
        defaultValue={initialData?.area ?? ""}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          maxLength={2000}
          defaultValue={initialData?.description ?? ""}
          placeholder="Grade, packaging, harvest date, etc."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="deliveryAvailable"
          defaultChecked={initialData?.deliveryAvailable}
          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-700">Delivery available</span>
      </label>

      <ImageUploader value={imageUrls} onChange={setImageUrls} max={5} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" fullWidth isLoading={submitting}>
        {submitting
          ? "Saving..."
          : mode === "create"
          ? "Publish listing"
          : "Save changes"}
      </Button>
    </form>
  );
}