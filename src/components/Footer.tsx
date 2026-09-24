import Link from "next/link";
import { MapPin, Mail, Phone, Sprout } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-28 md:pb-12">
        {/* TOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
                <span className="text-brand-700 font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-white text-base">
                FarmLink <span className="text-brand-200">Zim</span>
              </span>
            </Link>
            <p className="mt-4 text-xs text-brand-100/80 leading-relaxed max-w-xs">
              Farmers • Buyers • Better Together. Connecting Zimbabwean farmers
              directly with buyers nationwide.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-xs text-brand-100">
              <Sprout className="h-3.5 w-3.5 text-brand-200" strokeWidth={2} />
              Proudly Zimbabwean
            </div>
          </div>

          {/* MARKETPLACE */}
          <div>
            <h3 className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Browse products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?verified=true"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Verified farmers
                </Link>
              </li>
              <li>
                <Link
                  href="/requests"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Buyer requests
                </Link>
              </li>
              <li>
                <Link
                  href="/requests/new"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Post what you need
                </Link>
              </li>
            </ul>
          </div>

          {/* FOR FARMERS */}
          <div>
            <h3 className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-4">
              For farmers
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/register"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Create account
                </Link>
              </li>
              <li>
                <Link
                  href="/farmer/dashboard"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Farmer dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/farmer/listings/new"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Add a product
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-brand-50/90 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-brand-50/90">
                <MapPin
                  className="h-4 w-4 text-brand-200 shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                Harare, Zimbabwe
              </li>
              <li>
                <a
                  href="mailto:hello@farmlink.co.zw"
                  className="flex items-center gap-2 text-brand-50/90 hover:text-white transition-colors break-all"
                >
                  <Mail
                    className="h-4 w-4 text-brand-200 shrink-0"
                    strokeWidth={2}
                  />
                  hello@farmlink.co.zw
                </a>
              </li>
              <li>
                <a
                  href="tel:+263771234567"
                  className="flex items-center gap-2 text-brand-50/90 hover:text-white transition-colors"
                >
                  <Phone
                    className="h-4 w-4 text-brand-200 shrink-0"
                    strokeWidth={2}
                  />
                  +263 77 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-brand-100/70">
              © {year} FarmLink Zim. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs">
              <Link
                href="/terms"
                className="text-brand-100/80 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-brand-100/80 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/about"
                className="text-brand-100/80 hover:text-white transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* POWERED BY — MOBILE ONLY */}
          <div className="mt-4 md:hidden text-center">
            <a
              href="https://inkspiredigitaldesigns.co.zw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 hover:text-amber-200 transition-colors"
            >
              Powered by <span className="font-semibold">Inkspire Digital Designs</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}