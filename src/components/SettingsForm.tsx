"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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

interface SettingsFormProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  customerProfile: {
    province: string;
    city: string;
    area: string;
  } | null;
}

export function SettingsForm({ user, customerProfile }: SettingsFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const payload: any = {
      fullName: String(form.get("fullName") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
    };

    if (user.role === "CUSTOMER") {
      payload.province = String(form.get("province") || "");
      payload.city = String(form.get("city") || "").trim();
      payload.area = String(form.get("area") || "").trim();
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save changes.");
      setBusy(false);
      return;
    }

    setBusy(false);
    setSuccess(true);
    router.refresh();
    setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <Input
        label="Full name"
        name="fullName"
        defaultValue={user.fullName}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        defaultValue={user.email}
        disabled
        hint="Email cannot be changed."
      />

      <Input
        label="Phone number"
        name="phone"
        type="tel"
        defaultValue={user.phone}
        placeholder="+263 77 123 4567"
      />

      {user.role === "CUSTOMER" && (
        <>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-3 pt-3">
              Location
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Province
              </label>
              <select
                name="province"
                defaultValue={customerProfile?.province || ""}
                className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">Select...</option>
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
              defaultValue={customerProfile?.city || ""}
              placeholder="e.g. Harare"
            />
          </div>

          <Input
            label="Area"
            name="area"
            defaultValue={customerProfile?.area || ""}
            placeholder="e.g. Borrowdale"
          />
        </>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 text-red-600 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 flex items-start gap-2">
          <CheckCircle2
            className="h-4 w-4 text-brand-700 shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-sm text-brand-800">Changes saved.</p>
        </div>
      )}

      <Button type="submit" size="lg" fullWidth disabled={busy}>
        {busy ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}