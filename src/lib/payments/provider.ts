/**
 * Payment provider abstraction.
 *
 * The app never calls a real provider directly. All payments flow through
 * these interfaces so we can swap in Paynow, Stripe, EcoCash, etc. later
 * without touching the rest of the codebase.
 */

export type PaymentType =
  | "FEATURED_LISTING"
  | "FARMER_PRO"
  | "ADVERTISEMENT"
  | "SOURCING_PREMIUM"
  | "TRANSACTION_COMMISSION"
  | "WEBSITE_SERVICE";

export interface CreatePaymentInput {
  userId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  reference: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResult {
  providerRef: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  redirectUrl?: string;
  /** Raw provider response — stored for debugging. */
  raw?: unknown;
}

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(providerRef: string): Promise<{
    status: "PENDING" | "COMPLETED" | "FAILED";
    raw?: unknown;
  }>;
  refundPayment?(providerRef: string): Promise<{ ok: boolean; raw?: unknown }>;
}