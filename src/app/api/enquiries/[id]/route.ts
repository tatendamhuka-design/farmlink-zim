import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["NEW", "READ", "RESPONDED", "CLOSED"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
    include: { farmer: { select: { userId: true } } },
  });

  if (!enquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (role !== "ADMIN" && enquiry.farmer.userId !== userId) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        ...data,
        respondedAt:
          data.status === "RESPONDED" ? new Date() : enquiry.respondedAt,
      },
    });

    return NextResponse.json({ id: updated.id });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("PATCH enquiry error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}