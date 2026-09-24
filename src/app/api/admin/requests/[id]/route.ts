import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["remove", "close", "reopen"]),
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

    const request = await prisma.sourcingRequest.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        customer: { select: { userId: true } },
      },
    });
    if (!request) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.action === "remove" || data.action === "close") {
      await prisma.sourcingRequest.update({
        where: { id: params.id },
        data: { status: "CLOSED" },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "REMOVE_REQUEST",
          targetUserId: request.customer.userId,
          targetType: "SourcingRequest",
          targetId: request.id,
          notes: data.reason,
        },
      });

      if (request.customer.userId) {
        await prisma.notification.create({
          data: {
            userId: request.customer.userId,
            type: "SYSTEM",
            title: "Your request was closed",
            body: `"${request.title}" was closed by an admin. ${data.reason || ""}`.trim(),
          },
        });
      }
    } else if (data.action === "reopen") {
      await prisma.sourcingRequest.update({
        where: { id: params.id },
        data: { status: "OPEN" },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetUserId: request.customer.userId,
          targetType: "SourcingRequest",
          targetId: request.id,
          notes: "Reopened by admin",
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
    console.error("admin request action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}