import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["dismiss", "review", "action"]),
  notes: z.string().max(500).optional(),
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

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            farmer: { select: { userId: true } },
          },
        },
      },
    });
    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.action === "dismiss") {
      await prisma.report.update({
        where: { id: params.id },
        data: {
          status: "DISMISSED",
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetType: "Report",
          targetId: report.id,
          notes: data.notes || "Report dismissed",
        },
      });
    } else if (data.action === "review") {
      await prisma.report.update({
        where: { id: params.id },
        data: {
          status: "REVIEWED",
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetType: "Report",
          targetId: report.id,
          notes: data.notes || "Report reviewed",
        },
      });
    } else if (data.action === "action") {
      // Mark report actioned and remove the listing
      await prisma.report.update({
        where: { id: params.id },
        data: {
          status: "ACTIONED",
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      if (report.product) {
        await prisma.product.update({
          where: { id: report.product.id },
          data: { isActive: false },
        });

        await prisma.adminAction.create({
          data: {
            adminId,
            action: "REMOVE_LISTING",
            targetUserId: report.product.farmer.userId,
            targetType: "Product",
            targetId: report.product.id,
            notes: data.notes || "Removed due to report",
          },
        });

        await prisma.notification.create({
          data: {
            userId: report.product.farmer.userId,
            type: "SYSTEM",
            title: "A listing was removed",
            body: `"${report.product.title}" was removed following a report. ${
              data.notes || ""
            }`.trim(),
            link: "/farmer/dashboard",
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("admin report action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}