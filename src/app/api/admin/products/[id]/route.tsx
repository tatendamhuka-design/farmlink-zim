import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["remove", "pause", "restore"]),
  reason: z.string().max(500).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const adminId = (session.user as any).id;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        farmer: { select: { userId: true } },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.action === "remove") {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "REMOVE_LISTING",
          targetUserId: product.farmer.userId,
          targetType: "Product",
          targetId: product.id,
          notes: data.reason,
        },
      });

      await prisma.notification.create({
        data: {
          userId: product.farmer.userId,
          type: "SYSTEM",
          title: "A listing was removed",
          body: `"${product.title}" was removed by an admin. ${data.reason || ""}`.trim(),
          link: "/farmer/dashboard",
        },
      });
    } else if (data.action === "pause") {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetUserId: product.farmer.userId,
          targetType: "Product",
          targetId: product.id,
          notes: "Paused by admin",
        },
      });
    } else if (data.action === "restore") {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: true },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetUserId: product.farmer.userId,
          targetType: "Product",
          targetId: product.id,
          notes: "Restored by admin",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("admin product action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}