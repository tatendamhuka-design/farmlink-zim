import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getPaymentProvider,
  generateReference,
  FEATURED_TIERS,
} from "@/lib/payments";

const schema = z.object({
  productId: z.string().min(1),
  tier: z.enum(["three", "seven", "fourteen"]),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role !== "FARMER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const farmer = await prisma.farmerProfile.findUnique({
      where: { userId },
    });
    if (!farmer) {
      return NextResponse.json(
        { error: "Farmer profile not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { featured: true },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    if (product.farmerId !== farmer.id && role !== "ADMIN") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const tier = FEATURED_TIERS[data.tier];
    const startDate = new Date();
    const expiryDate = new Date(
      startDate.getTime() + tier.days * 24 * 60 * 60 * 1000
    );

    const reference = generateReference("FLZ");
    const provider = getPaymentProvider();

    // 1. Create the Payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: tier.price,
        currency: "USD",
        type: "FEATURED_LISTING",
        provider: provider.name,
        reference,
        status: "PENDING",
        metadata: {
          productId: product.id,
          tier: data.tier,
          days: tier.days,
        },
      },
    });

    // 2. Charge via provider
    const result = await provider.createPayment({
      userId,
      amount: tier.price,
      currency: "USD",
      type: "FEATURED_LISTING",
      reference,
      description: `Featured listing: ${product.title} for ${tier.days} days`,
      metadata: { productId: product.id, paymentId: payment.id },
    });

    // 3. Update payment with provider response
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerRef: result.providerRef,
        status: result.status,
        completedAt: result.status === "COMPLETED" ? new Date() : null,
        metadata: {
          ...((payment.metadata as any) || {}),
          providerResponse: result.raw,
        },
      },
    });

    // 4. Create or update FeaturedListing
    const finalStatus =
      result.status === "COMPLETED" ? "COMPLETED" : "PENDING";

    if (product.featured) {
      await prisma.featuredListing.update({
        where: { productId: product.id },
        data: {
          paymentId: payment.id,
          startDate,
          expiryDate,
          amountPaid: tier.price,
          currency: "USD",
          paymentStatus: finalStatus,
          isActive: result.status === "COMPLETED",
        },
      });
    } else {
      await prisma.featuredListing.create({
        data: {
          productId: product.id,
          paymentId: payment.id,
          startDate,
          expiryDate,
          amountPaid: tier.price,
          currency: "USD",
          paymentStatus: finalStatus,
          isActive: result.status === "COMPLETED",
        },
      });
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: result.status,
      expiryDate,
      redirectUrl: result.redirectUrl,
    });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("POST /api/farmer/featured error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}  
export const dynamic = "force-dynamic"; 
