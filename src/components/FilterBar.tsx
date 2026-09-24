"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: { name: string; slug: string }[];
  provinces: string[];
  resultCount: number;
}

export function FilterBar({
  categories,
  provinces,
  resultCount,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = {
    category: searchParams.get("category") || "",
    province: searchParams.get("province") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    delivery: searchParams.get("delivery") === "true",
    verified: searchParams.get("verified") === "true",
    sort: searchParams.get("sort") || "newest",
  };

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/products?${params.toString()}`);
  }

  const activeCount = [
    current.category,
    current.province,
    current.minPrice,
    current.maxPrice,
    current.delivery,
    current.verified,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile filter toggle row */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{resultCount}</span>{" "}
          result{resultCount === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-brand-700 text-[10px] font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop filter sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-20 rounded-2xl bg-gradient-to-b from-brand-50/80 to-brand-100/40 border border-brand-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-brand-900">Filters</h3>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-brand-700 hover:text-brand-800 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-5">
            <FilterBlock label="Category">
              <select
                value={current.category}
                onChange={(e) => updateParam("category", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-brand-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Location">
              <select
                value={current.province}
                onChange={(e) => updateParam("province", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-brand-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All provinces</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FilterBlock>

            <FilterBlock label="Price range (USD)">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  defaultValue={current.minPrice}
                  onBlur={(e) => updateParam("minPrice", e.target.value)}
                  className="h-10 text-sm"
                />
                <span className="text-brand-400">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  defaultValue={current.maxPrice}
                  onBlur={(e) => updateParam("maxPrice", e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </FilterBlock>

            <FilterBlock label="Options">
              <div className="space-y-2">
                <CheckboxRow
                  label="Delivery available"
                  checked={current.delivery}
                  onChange={(checked) =>
                    updateParam("delivery", checked ? "true" : null)
                  }
                />
                <CheckboxRow
                  label="Verified farmers only"
                  checked={current.verified}
                  onChange={(checked) =>
                    updateParam("verified", checked ? "true" : null)
                  }
                />
              </div>
            </FilterBlock>
          </div>
        </div>
      </aside>

      {/* Mobile filter drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              <FilterBlock label="Category">
                <select
                  value={current.category}
                  onChange={(e) => updateParam("category", e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FilterBlock>

              <FilterBlock label="Location">
                <select
                  value={current.province}
                  onChange={(e) => updateParam("province", e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm"
                >
                  <option value="">All provinces</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </FilterBlock>

              <FilterBlock label="Price range (USD)">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    defaultValue={current.minPrice}
                    onBlur={(e) => updateParam("minPrice", e.target.value)}
                  />
                  <span className="text-gray-400">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    defaultValue={current.maxPrice}
                    onBlur={(e) => updateParam("maxPrice", e.target.value)}
                  />
                </div>
              </FilterBlock>

              <FilterBlock label="Options">
                <div className="space-y-2">
                  <CheckboxRow
                    label="Delivery available"
                    checked={current.delivery}
                    onChange={(checked) =>
                      updateParam("delivery", checked ? "true" : null)
                    }
                  />
                  <CheckboxRow
                    label="Verified farmers only"
                    checked={current.verified}
                    onChange={(checked) =>
                      updateParam("verified", checked ? "true" : null)
                    }
                  />
                </div>
              </FilterBlock>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" fullWidth onClick={clearAll}>
                Clear all
              </Button>
              <Button fullWidth onClick={() => setOpen(false)}>
                Show {resultCount} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-brand-900 mb-2">{label}</p>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500"
        )}
      />
      <span className="text-sm text-brand-900">{label}</span>
    </label>
  );
}