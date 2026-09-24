import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  ids: z.array(z.string()).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ids } = bodySchema.parse(body);

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
      },
    });

    // Preserve the order the client sent (newest saved first)
    const orderMap = new Map(ids.map((id, i) => [id, i]));
    products.sort(
      (a, b) =>
        (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
    );

    return NextResponse.json({ products });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/saved error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  
export const dynamic = "force-dynamic"; 
