"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  X,
  AlertCircle,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buildWhatsAppLink, buildProductEnquiryMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface EnquiryButtonProps {
  product: {
    id: string;
    title: string;
    quantity: number;
    unit: string;
  };
  farmer: {
    name: string;
    whatsappNumber: string;
    phoneNumber?: string | null;
  };
  className?: string;
}

export function EnquiryButton({
  product,
  farmer,
  className,
}: EnquiryButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      productId: product.id,
      quantity: form.get("quantity")
        ? Number(form.get("quantity"))
        : undefined,
      unit: String(form.get("unit") || product.unit),
      message: String(form.get("message") || "").trim(),
      contactName: String(form.get("contactName") || "").trim(),
      contactPhone: String(form.get("contactPhone") || "").trim(),
    };

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not send enquiry.");
      setBusy(false);
      return;
    }

    // Build WhatsApp message with the buyer's custom quantity + message
    const whatsappMessage = `Hi ${farmer.name.split(" ")[0]}, I found your ${
      product.title
    } on FarmLink Zim.${
      payload.quantity ? ` I'm interested in ${payload.quantity} ${payload.unit}.` : ""
    } ${payload.message}`.trim();

    setSuccess(true);
    setBusy(false);

    // Brief success flash, then open WhatsApp
    setTimeout(() => {
      window.open(
        buildWhatsAppLink(farmer.whatsappNumber, whatsappMessage),
        "_blank",
        "noopener,noreferrer"
      );
      setOpen(false);
      setSuccess(false);
      router.refresh();
    }, 900);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#1ebe5a] active:bg-[#19a54d] transition-colors w-full sm:w-auto",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
        Contact on WhatsApp
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-lifted max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" strokeWidth={2} />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-3">
                  <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                    <CheckCircle2
                      className="h-8 w-8 text-brand-600"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">
                  Opening WhatsApp
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your enquiry has been sent to {farmer.name.split(" ")[0]}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle
                    className="h-5 w-5 text-[#25D366]"
                    strokeWidth={2.5}
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Contact {farmer.name.split(" ")[0]}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Tell them what you need. Your details will be shared, then
                  WhatsApp opens.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Quantity needed"
                      name="quantity"
                      type="number"
                      step="any"
                      min="0"
                      placeholder={String(product.quantity)}
                      defaultValue={
                        product.quantity < 100 ? product.quantity : ""
                      }
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Unit
                      </label>
                      <select
                        name="unit"
                        defaultValue={product.unit}
                        className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {[
                          "kg",
                          "tonnes",
                          "litres",
                          "birds",
                          "head",
                          "trays",
                          "bags",
                        ].map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      maxLength={1000}
                      required
                      defaultValue={`Are these still available?`}
                      placeholder="Any questions, delivery preferences, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-3 pt-2">
                      Your details
                    </p>
                    <div className="space-y-3">
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
                      />
                    </div>
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

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      fullWidth
                      disabled={busy}
                      className="bg-[#25D366] hover:bg-[#1ebe5a]"
                    >
                      {busy ? "Sending..." : "Send and open WhatsApp"}
                    </Button>
                  </div>

                  {farmer.phoneNumber && (
                    <a
                      href={`tel:${farmer.phoneNumber}`}
                      className="flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 pt-2"
                    >
                      <Phone className="h-3 w-3" strokeWidth={2} />
                      Or call {farmer.phoneNumber}
                    </a>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}