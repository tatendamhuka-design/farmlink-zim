import Link from "next/link";
import {
  Sprout,
  Users,
  ShieldCheck,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar />

      <main className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to home
        </Link>

        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
          About FarmLink Zim
        </h1>
        <p className="mt-2 text-gray-600">
          Farmers • Buyers • Better Together
        </p>

        <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            FarmLink Zim connects Zimbabwean farmers directly with buyers,
            removing unnecessary middlemen so farmers earn more and buyers pay
            fairer prices.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <Feature
              icon={Sprout}
              title="Direct connections"
              body="No middlemen. Farmers list products, buyers contact them directly through WhatsApp."
            />
            <Feature
              icon={ShieldCheck}
              title="Verified farmers"
              body="Verified accounts are reviewed by our team to help buyers trust who they're dealing with."
            />
            <Feature
              icon={Users}
              title="Built for Zimbabwe"
              body="Every feature is designed for local farmers, from WhatsApp contact to flexible delivery options."
            />
          </div>

          <p>
            Whether you&apos;re a small-scale farmer in Mashonaland or a
            commercial buyer in Bulawayo, FarmLink Zim gives you a
            straightforward way to trade — no complicated payments, no forced
            subscriptions, just a clear marketplace.
          </p>

          <p>
            Questions, feedback, or partnership ideas? Email us at{" "}
            <a
              href="mailto:hello@farmlink.co.zw"
              className="text-brand-700 font-medium hover:text-brand-800"
            >
              hello@farmlink.co.zw
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
      <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-brand-700" strokeWidth={2} />
      </div>
      <h3 className="mt-3 font-semibold text-sm text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-600 leading-relaxed">{body}</p>
    </div>
  );
}