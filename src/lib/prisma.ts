import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Wraps any Prisma operation and retries once on connection errors.
 * Handles Neon's serverless idle-disconnect behavior gracefully.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = String(err?.message || "");
      const isConnError =
        msg.includes("Can't reach database") ||
        msg.includes("ConnectionReset") ||
        msg.includes("Connection refused") ||
        msg.includes("Server has closed the connection") ||
        err?.code === "P1001" ||
        err?.code === "P1017";

      if (!isConnError || i === retries) throw err;

      lastError = err;
      // Small backoff to let Neon wake up
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastError;
}