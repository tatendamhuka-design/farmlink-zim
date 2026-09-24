import { stubProvider } from "./stub-provider";
import type { PaymentProvider } from "./provider";

/**
 * Returns the active payment provider.
 * Future providers (Paynow, Stripe, EcoCash) are plugged in here.
 */
export function getPaymentProvider(): PaymentProvider {
  const name = process.env.PAYMENT_PROVIDER || "stub";

  switch (name) {
    case "stub":
    default:
      return stubProvider;
  }
}

export function paymentsEnabled(): boolean {
  return process.env.PAYMENTS_ENABLED === "true";
}

export function generateReference(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

/** Featured listing pricing tiers in USD. */
export const FEATURED_TIERS = {
  three: { days: 3, price: 1 },
  seven: { days: 7, price: 3 },
  fourteen: { days: 14, price: 5 },
} as const;

export type FeaturedTier = keyof typeof FEATURED_TIERS;