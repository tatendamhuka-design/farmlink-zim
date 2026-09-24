import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  password: z.string().min(6).max(100),
  role: z.enum(["CUSTOMER", "FARMER"]),
  // Farmer-only fields (optional for customers)
  farmName: z.string().min(2).max(120).optional(),
  whatsappNumber: z.string().min(6).max(30).optional(),
  province: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  area: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const email = data.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (data.role === "FARMER") {
      if (
        !data.farmName ||
        !data.whatsappNumber ||
        !data.province ||
        !data.city
      ) {
        return NextResponse.json(
          {
            error:
              "Farm name, WhatsApp number, province, and city are required for farmer accounts.",
          },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        fullName: data.fullName,
        phone: data.phone,
        passwordHash,
        role: data.role,
        ...(data.role === "FARMER"
          ? {
              farmerProfile: {
                create: {
                  farmName: data.farmName!,
                  whatsappNumber: data.whatsappNumber!,
                  phoneNumber: data.phone,
                  province: data.province!,
                  city: data.city!,
                  area: data.area,
                  verificationStatus: "UNVERIFIED",
                },
              },
            }
          : {
              customerProfile: {
                create: {
                  province: data.province,
                  city: data.city,
                  area: data.area,
                },
              },
            }),
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}