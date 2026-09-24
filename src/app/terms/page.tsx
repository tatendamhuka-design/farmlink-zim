import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <Section title="1. About FarmLink Zim">
            <p>
              FarmLink Zim is a marketplace that connects farmers and buyers
              in Zimbabwe. We provide the platform; we do not buy, sell, or
              deliver products listed by farmers.
            </p>
          </Section>

          <Section title="2. Accounts">
            <p>
              You must provide accurate information when creating an account.
              You are responsible for keeping your password secure and for all
              activity under your account.
            </p>
          </Section>

          <Section title="3. Listings and conduct">
            <p>
              Farmers may only list products they can genuinely supply. Buyers
              may only post genuine sourcing requests. Fraudulent, misleading,
              or duplicate listings may be removed.
            </p>
          </Section>

          <Section title="4. Transactions between users">
            <p>
              All transactions happen directly between buyers and farmers.
              FarmLink Zim is not party to any agreement, payment, or delivery
              arrangement made between users.
            </p>
          </Section>

          <Section title="5. Payments and fees">
            <p>
              Creating an account and listing products is free. Optional paid
              features (such as featured listings) are described at the point
              of purchase.
            </p>
          </Section>

          <Section title="6. Content">
            <p>
              You retain ownership of images and text you upload. By uploading,
              you grant FarmLink Zim a licence to display that content on the
              platform.
            </p>
          </Section>

          <Section title="7. Reporting and moderation">
            <p>
              Users can report listings that break these terms. We may remove
              content, suspend accounts, or refuse service to anyone who
              violates these terms.
            </p>
          </Section>

          <Section title="8. Changes">
            <p>
              These terms may be updated. Continued use of the platform after
              changes means you accept the updated terms.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              For questions about these terms, email{" "}
              <a
                href="mailto:hello@farmlink.co.zw"
                className="text-brand-700 hover:text-brand-800 font-medium"
              >
                hello@farmlink.co.zw
              </a>
              .
            </p>
          </Section>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
      {children}
    </section>
  );
}