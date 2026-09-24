"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, User, Sprout, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

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

type Role = "CUSTOMER" | "FARMER";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload: any = {
      fullName: String(form.get("fullName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      password: String(form.get("password") || ""),
      role,
    };

    if (role === "FARMER") {
      payload.farmName = String(form.get("farmName") || "").trim();
      payload.whatsappNumber = String(form.get("whatsappNumber") || "").trim();
      payload.province = String(form.get("province") || "");
      payload.city = String(form.get("city") || "").trim();
      payload.area = String(form.get("area") || "").trim() || undefined;
    } else {
      payload.province = String(form.get("province") || "") || undefined;
      payload.city = String(form.get("city") || "").trim() || undefined;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Try again.");
        setSubmitting(false);
        return;
      }

      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Account created, but sign-in failed. Please sign in manually."
        );
        setSubmitting(false);
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      router.push(role === "FARMER" ? "/farmer/dashboard" : "/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          I want to join as
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            active={role === "CUSTOMER"}
            onClick={() => setRole("CUSTOMER")}
            icon={User}
            title="Buyer"
            description="Find and buy from farmers"
          />
          <RoleCard
            active={role === "FARMER"}
            onClick={() => setRole("FARMER")}
            icon={Sprout}
            title="Farmer"
            description="List and sell your products"
          />
        </div>
      </div>

      <Input
        label="Full name"
        name="fullName"
        placeholder="e.g. Tendai Moyo"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />

      <Input
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="+263 77 123 4567"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="At least 6 characters"
        minLength={6}
        required
      />

      {role === "FARMER" && (
        <>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-3 pt-3">
              Farm details
            </p>
          </div>

          <Input
            label="Farm name"
            name="farmName"
            placeholder="e.g. Moyo Family Farm"
            required
          />

          <Input
            label="WhatsApp number"
            name="whatsappNumber"
            type="tel"
            placeholder="+263 77 123 4567"
            hint="Buyers will use this to reach you."
            required
          />

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
            label="Area (optional)"
            name="area"
            placeholder="e.g. Mabvuku"
          />
        </>
      )}

      {role === "CUSTOMER" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Province (optional)
            </label>
            <select
              name="province"
              defaultValue=""
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
            label="City / Town (optional)"
            name="city"
            placeholder="e.g. Harare"
          />
        </div>
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

      <Button type="submit" size="lg" fullWidth isLoading={submitting}>
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

function RoleCard({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 p-3.5 rounded-xl border-2 text-left transition-colors",
        active
          ? "border-brand-600 bg-brand-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center",
          active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div>
        <p
          className={cn(
            "font-medium text-sm",
            active ? "text-brand-900" : "text-gray-900"
          )}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-tight">
          {description}
        </p>
      </div>
    </button>
  );
}