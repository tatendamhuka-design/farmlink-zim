import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <Section title="What we collect">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Name, email, phone number you provide</li>
              <li>Farm details (for farmer accounts)</li>
              <li>Product listings, images, and descriptions</li>
              <li>Enquiries and sourcing requests you post</li>
              <li>Basic usage logs (IP, browser, timestamps)</li>
            </ul>
          </Section>

          <Section title="Why we collect it">
            <ul className="list-disc list-inside space-y-1.5">
              <li>To operate the marketplace (listings, contacts, enquiries)</li>
              <li>To verify farmer accounts</li>
              <li>To improve the platform</li>
              <li>To prevent abuse and fraud</li>
            </ul>
          </Section>

          <Section title="How it's shared">
            <p>
              When you contact a farmer (or a buyer contacts you), your name,
              phone, and message are shared with that person so they can
              respond. We do not sell personal data to third parties.
            </p>
          </Section>

          <Section title="Storage">
            <p>
              Data is stored on secure servers. Images are stored on
              UploadThing. Passwords are hashed and never stored in plain
              text.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can request a copy of your data, correct it, or ask us to
              delete your account by emailing{" "}
              <a
                href="mailto:hello@farmlink.co.zw"
                className="text-brand-700 hover:text-brand-800 font-medium"
              >
                hello@farmlink.co.zw
              </a>
              .
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use a session cookie to keep you signed in. We don&apos;t use
              advertising cookies.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For privacy questions, email{" "}
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