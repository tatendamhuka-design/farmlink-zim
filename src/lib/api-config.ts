/**
 * Force API routes to run at request time, not at build time.
 * Prevents Prisma from trying to connect during `next build`.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;