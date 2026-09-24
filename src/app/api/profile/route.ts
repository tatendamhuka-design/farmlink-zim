import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().min(2).max(80).optional(),
  phone: z.string().min(6).max(30).optional(),
  province: z.string().min(1).max(60).optional(),
  city: z.string().min(1).max(60).optional(),
  area: z.string().max(120).optional(),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Update User fields
    const userData: any = {};
    if (data.fullName !== undefined) userData.fullName = data.fullName;
    if (data.phone !== undefined) userData.phone = data.phone;

    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    }

    // Update Customer profile fields
    if (role === "CUSTOMER") {
      const profileData: any = {};
      if (data.province !== undefined) profileData.province = data.province;
      if (data.city !== undefined) profileData.city = data.city;
      if (data.area !== undefined) profileData.area = data.area;

      if (Object.keys(profileData).length > 0) {
        await prisma.customerProfile.update({
          where: { userId },
          data: profileData,
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
    console.error("PATCH /api/profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}