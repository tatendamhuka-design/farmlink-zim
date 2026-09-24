import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ping() {
  const t = new Date().toLocaleTimeString();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[keep-alive] pinged at ${t}`);
  } catch (err: any) {
    console.error(`[keep-alive] failed at ${t}:`, err?.message || err);
  }
}

ping();
setInterval(ping, 4 * 60 * 1000); // every 4 minutes