import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  action: z.enum(["verify", "reject", "reset"]),
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

    const farmer = await prisma.farmerProfile.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true, verificationStatus: true },
    });
    if (!farmer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.action === "verify") {
      await prisma.farmerProfile.update({
        where: { id: params.id },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          verifiedByUserId: adminId,
          rejectionReason: null,
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "VERIFY_FARMER",
          targetUserId: farmer.userId,
          targetType: "FarmerProfile",
          targetId: farmer.id,
        },
      });

      await prisma.notification.create({
        data: {
          userId: farmer.userId,
          type: "VERIFICATION_UPDATE",
          title: "Your farm is now verified",
          body: "You now show a Verified Farmer badge on all your listings.",
          link: "/farmer/dashboard",
        },
      });
    } else if (data.action === "reject") {
      await prisma.farmerProfile.update({
        where: { id: params.id },
        data: {
          verificationStatus: "REJECTED",
          rejectionReason: data.reason || "Not specified",
          verifiedAt: null,
          verifiedByUserId: null,
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "REJECT_FARMER",
          targetUserId: farmer.userId,
          targetType: "FarmerProfile",
          targetId: farmer.id,
          notes: data.reason,
        },
      });

      await prisma.notification.create({
        data: {
          userId: farmer.userId,
          type: "VERIFICATION_UPDATE",
          title: "Verification was not approved",
          body: data.reason || "Please contact support for details.",
          link: "/farmer/dashboard",
        },
      });
    } else if (data.action === "reset") {
      await prisma.farmerProfile.update({
        where: { id: params.id },
        data: {
          verificationStatus: "PENDING",
          verifiedAt: null,
          verifiedByUserId: null,
          rejectionReason: null,
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId,
          action: "OTHER",
          targetUserId: farmer.userId,
          targetType: "FarmerProfile",
          targetId: farmer.id,
          notes: "Reset verification to PENDING",
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
    console.error("verify farmer error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  
export const dynamic = "force-dynamic"; 
