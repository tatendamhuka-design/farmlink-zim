import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(20),
  province: z.string().min(1),
  city: z.string().min(1),
  requiredBy: z.string().optional(),
  contactName: z.string().min(2).max(80),
  contactPhone: z.string().min(6).max(30),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = requestSchema.parse(body);

    // For MVP: create a customer on the fly (or reuse if phone matches)
    // We store name + phone so farmers can contact buyers without full auth.
    const cleanPhone = data.contactPhone.replace(/[^0-9+]/g, "");

    // Find or create a User + CustomerProfile for this buyer
    let user = await prisma.user.findFirst({
      where: { phone: cleanPhone, role: "CUSTOMER" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `guest-${cleanPhone.replace(/[^0-9]/g, "")}@farmlink.local`,
          fullName: data.contactName,
          phone: cleanPhone,
          passwordHash: "guest-no-login",
          role: "CUSTOMER",
          customerProfile: {
            create: {
              province: data.province,
              city: data.city,
            },
          },
        },
      });
    }

    const profile = await prisma.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Could not create customer profile" },
        { status: 500 }
      );
    }

    const request = await prisma.sourcingRequest.create({
      data: {
        customerId: profile.id,
        title: data.title,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        province: data.province,
        city: data.city,
        requiredBy: data.requiredBy ? new Date(data.requiredBy) : null,
        status: "OPEN",
      },
    });

    return NextResponse.json({ id: request.id }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/requests error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}