"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, PackageX } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

const STORAGE_KEY = "farmlink_saved";

export function SavedProductsList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const ids: string[] = stored ? JSON.parse(stored) : [];

        if (ids.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!res.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
          <Heart className="h-7 w-7 text-red-500" strokeWidth={2} />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900">No saved products</h3>
      <p className="text-sm text-gray-500 mt-1">
        Tap the heart icon on any product to save it for later.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
      >
        Browse products
      </Link>
    </div>
  );
}