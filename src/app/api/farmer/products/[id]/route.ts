import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  categoryId: z.string().min(1).optional(),
  description: z.string().max(2000).optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().min(1).max(20).optional(),
  price: z.number().nonnegative().optional(),
  priceUnit: z.string().min(1).max(20).optional(),
  province: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  area: z.string().max(120).optional(),
  minimumOrder: z.number().positive().nullable().optional(),
  deliveryAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
});

async function assertOwner(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Not signed in", status: 401 as const };

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const farmer = await prisma.farmerProfile.findUnique({
    where: { userId },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, farmerId: true },
  });

  if (!product) return { error: "Product not found", status: 404 as const };

  if (role === "ADMIN") return { product };

  if (!farmer || farmer.id !== product.farmerId) {
    return { error: "Not allowed", status: 403 as const };
  }

  return { product };
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const check = await assertOwner(params.id);
  if ("error" in check) {
    return NextResponse.json(
      { error: check.error },
      { status: check.status }
    );
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.product.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ id: updated.id });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("PATCH product error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const check = await assertOwner(params.id);
  if ("error" in check) {
    return NextResponse.json(
      { error: check.error },
      { status: check.status }
    );
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE product error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  
export const dynamic = "force-dynamic"; 
