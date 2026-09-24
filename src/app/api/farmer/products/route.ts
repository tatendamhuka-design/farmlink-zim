import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  title: z.string().min(3).max(120),
  categoryId: z.string().min(1),
  description: z.string().max(2000).optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(20),
  price: z.number().nonnegative(),
  priceUnit: z.string().min(1).max(20),
  province: z.string().min(1),
  city: z.string().min(1),
  area: z.string().max(120).optional(),
  minimumOrder: z.number().positive().optional(),
  deliveryAvailable: z.boolean().default(false),
  imageUrls: z.array(z.string().url()).max(5).default([]),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role !== "FARMER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only farmers can create listings" },
        { status: 403 }
      );
    }

    const farmer = await prisma.farmerProfile.findUnique({
      where: { userId },
    });
    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const data = productSchema.parse(body);

    // Free plan: max 5 active listings
    const isPro = farmer.isPro;
    if (!isPro) {
      const activeCount = await prisma.product.count({
        where: { farmerId: farmer.id, isActive: true, isSoldOut: false },
      });
      if (activeCount >= 5) {
        return NextResponse.json(
          {
            error:
              "Free plan allows up to 5 active listings. Upgrade to Farmer Pro for unlimited listings.",
          },
          { status: 402 }
        );
      }
    }

    // Unique slug
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let n = 1;
    while (await prisma.product.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    const product = await prisma.product.create({
      data: {
        farmerId: farmer.id,
        categoryId: data.categoryId,
        title: data.title,
        slug,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        price: data.price,
        priceUnit: data.priceUnit,
        province: data.province,
        city: data.city,
        area: data.area,
        minimumOrder: data.minimumOrder,
        deliveryAvailable: data.deliveryAvailable,
        images: {
          create: data.imageUrls.map((url, i) => ({
            url,
            sortOrder: i,
          })),
        },
      },
    });

    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/farmer/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  
export const dynamic = "force-dynamic"; 
