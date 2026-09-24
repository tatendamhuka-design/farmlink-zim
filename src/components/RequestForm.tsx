"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

export function RequestForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim() || undefined,
      quantity: Number(form.get("quantity")),
      unit: String(form.get("unit") || ""),
      province: String(form.get("province") || ""),
      city: String(form.get("city") || "").trim(),
      requiredBy: String(form.get("requiredBy") || "") || undefined,
      contactName: String(form.get("contactName") || "").trim(),
      contactPhone: String(form.get("contactPhone") || "").trim(),
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccessId(data.id);
      setTimeout(() => {
        router.push(`/requests/${data.id}`);
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
      setSubmitting(false);
    }
  }

  if (successId) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-brand-600" strokeWidth={2} />
          </div>
        </div>
        <h3 className="font-semibold text-brand-900">Request posted</h3>
        <p className="text-sm text-brand-800 mt-1">
          Farmers can now see what you need.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Product needed"
        name="title"
        placeholder="e.g. Red onions"
        required
        minLength={3}
        maxLength={120}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          step="any"
          min="0.01"
          placeholder="5"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Unit
          </label>
          <select
            name="unit"
            required
            defaultValue="tonnes"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Province
          </label>
          <select
            name="province"
            required
            defaultValue="Harare"
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
          required
        />
      </div>

      <Input
        label="Required by"
        name="requiredBy"
        type="date"
        hint="Optional. Helps farmers know your timeline."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional details
        </label>
        <textarea
          name="description"
          rows={4}
          maxLength={2000}
          placeholder="Grade, packaging, delivery preferences, etc."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 p-4 space-y-4">
        <p className="text-sm font-medium text-gray-900">
          How should farmers reach you?
        </p>
        <Input
          label="Your name"
          name="contactName"
          placeholder="e.g. Sarah Dube"
          required
        />
        <Input
          label="Phone / WhatsApp number"
          name="contactPhone"
          type="tel"
          placeholder="+263 77 123 4567"
          required
          hint="Farmers will contact you on this number."
        />
      </div>

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
        {submitting ? "Posting..." : "Post Request"}
      </Button>
    </form>
  );
}