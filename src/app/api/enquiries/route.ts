import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const enquirySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive().optional(),
  unit: z.string().max(20).optional(),
  message: z.string().min(1).max(1000),
  contactName: z.string().min(2).max(80),
  contactPhone: z.string().min(6).max(30),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = enquirySchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { id: true, farmerId: true },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const cleanPhone = data.contactPhone.replace(/[^0-9+]/g, "");

    // Reuse or create a customer
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
            create: {},
          },
        },
      });
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { userId: user.id },
    });
    if (!customer) {
      return NextResponse.json(
        { error: "Could not resolve customer" },
        { status: 500 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        productId: product.id,
        farmerId: product.farmerId,
        customerId: customer.id,
        quantity: data.quantity,
        unit: data.unit,
        message: data.message,
        contactPhone: cleanPhone,
        status: "NEW",
      },
    });

    return NextResponse.json({ id: enquiry.id }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/enquiries error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}