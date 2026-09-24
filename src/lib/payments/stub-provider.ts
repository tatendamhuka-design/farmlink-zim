import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "./provider";

/**
 * Stub provider — simulates payment flows.
 * When PAYMENTS_ENABLED is false (MVP), all payments auto-complete.
 * When PAYMENTS_ENABLED is true but PAYMENT_PROVIDER=stub, we simulate
 * a 2-second delay and complete successfully.
 */
export const stubProvider: PaymentProvider = {
  name: "stub",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    // Simulate provider latency
    await new Promise((r) => setTimeout(r, 300));

    return {
      providerRef: `stub_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      status: "COMPLETED",
      raw: {
        stub: true,
        input,
        completedAt: new Date().toISOString(),
      },
    };
  },

  async verifyPayment(providerRef: string) {
    return { status: "COMPLETED", raw: { stub: true, providerRef } };
  },

  async refundPayment(providerRef: string) {
    return { ok: true, raw: { stub: true, providerRef } };
  },
};