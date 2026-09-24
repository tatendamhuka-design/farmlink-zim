import { prisma, withRetry } from "@/lib/prisma";

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories() {
  return withRetry(() =>
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    })
  );
}

// ============================================================
// HOME PAGE
// ============================================================

export async function getFeaturedProducts(limit = 8) {
  return withRetry(() =>
    prisma.product.findMany({
      where: {
        isActive: true,
        isSoldOut: false,
        featured: {
          isActive: true,
          expiryDate: { gt: new Date() },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
      },
    })
  );
}

export async function getRecentProducts(limit = 12) {
  return withRetry(() =>
    prisma.product.findMany({
      where: { isActive: true, isSoldOut: false },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
      },
    })
  );
}

export async function getProductsByCategory(slug: string, limit = 12) {
  return withRetry(() =>
    prisma.product.findMany({
      where: {
        isActive: true,
        isSoldOut: false,
        category: { slug },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
      },
    })
  );
}

// ============================================================
// SEARCH
// ============================================================

export interface ProductSearchParams {
  q?: string;
  category?: string;
  province?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  delivery?: boolean;
  verified?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  perPage?: number;
}

export async function searchProducts(params: ProductSearchParams) {
  const {
    q,
    category,
    province,
    city,
    minPrice,
    maxPrice,
    delivery,
    verified,
    sort = "newest",
    page = 1,
    perPage = 24,
  } = params;

  const where: any = {
    isActive: true,
    isSoldOut: false,
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (category) where.category = { slug: category };
  if (province) where.province = province;
  if (city) where.city = city;

  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    where.price = {};
    if (typeof minPrice === "number") where.price.gte = minPrice;
    if (typeof maxPrice === "number") where.price.lte = maxPrice;
  }

  if (delivery) where.deliveryAvailable = true;
  if (verified) where.farmer = { verificationStatus: "VERIFIED" };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  return withRetry(async () => {
    const results = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
        category: { select: { name: true, slug: true } },
      },
    });

    results.sort((a, b) => {
      const af = a.featured?.isActive ? 1 : 0;
      const bf = b.featured?.isActive ? 1 : 0;
      return bf - af;
    });

    const total = await prisma.product.count({ where });

    return { results, total, page, perPage };
  });
}

// ============================================================
// PRODUCT DETAIL
// ============================================================

export async function getProductById(id: string) {
  return withRetry(() =>
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        featured: { select: { isActive: true, expiryDate: true } },
        farmer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })
  );
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
) {
  return withRetry(() =>
    prisma.product.findMany({
      where: {
        isActive: true,
        isSoldOut: false,
        categoryId,
        id: { not: excludeProductId },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: { select: { verificationStatus: true } },
        featured: { select: { isActive: true } },
      },
    })
  );
}

// ============================================================
// SOURCING REQUESTS
// ============================================================

export async function getOpenSourcingRequests(limit = 20) {
  return withRetry(() =>
    prisma.sourcingRequest.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: {
          include: {
            user: { select: { fullName: true } },
          },
        },
        _count: { select: { responses: true } },
      },
    })
  );
}

export async function getSourcingRequestById(id: string) {
  return withRetry(() =>
    prisma.sourcingRequest.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
        responses: {
          orderBy: { createdAt: "desc" },
          include: {
            farmer: {
              include: {
                user: { select: { fullName: true } },
              },
            },
          },
        },
        _count: { select: { responses: true } },
      },
    })
  );
}

// ============================================================
// FARMER DASHBOARD
// ============================================================

export async function getFarmerProfileByUserId(userId: string) {
  return withRetry(() =>
    prisma.farmerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    })
  );
}

export async function getFarmerStats(farmerId: string) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return withRetry(async () => {
    const [activeListings, totalEnquiries, soldThisWeek] = await Promise.all([
      prisma.product.count({
        where: { farmerId, isActive: true, isSoldOut: false },
      }),
      prisma.enquiry.count({ where: { farmerId } }),
      prisma.product.count({
        where: {
          farmerId,
          isSoldOut: true,
          updatedAt: { gte: oneWeekAgo },
        },
      }),
    ]);

    return { activeListings, totalEnquiries, soldThisWeek };
  });
}

export async function getFarmerListings(farmerId: string) {
  return withRetry(() =>
    prisma.product.findMany({
      where: { farmerId },
      orderBy: { updatedAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true } },
        featured: { select: { isActive: true, expiryDate: true } },
        _count: { select: { enquiries: true } },
      },
    })
  );
}

export async function getFarmerEnquiries(farmerId: string, limit = 20) {
  return withRetry(() =>
    prisma.enquiry.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        product: { select: { id: true, title: true, unit: true } },
        customer: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
      },
    })
  );
}

export async function getFarmerProductById(
  productId: string,
  farmerId: string
) {
  return withRetry(() =>
    prisma.product.findFirst({
      where: { id: productId, farmerId },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    })
  );
}

export async function getFarmerEnquiryCount(farmerId: string) {
  return withRetry(() =>
    prisma.enquiry.count({
      where: { farmerId, status: "NEW" },
    })
  );
}

// ============================================================
// ADMIN
// ============================================================

export async function getAdminStats() {
  return withRetry(async () => {
    const [
      totalFarmers,
      verifiedFarmers,
      activeListings,
      openRequests,
      totalUsers,
    ] = await Promise.all([
      prisma.farmerProfile.count(),
      prisma.farmerProfile.count({
        where: { verificationStatus: "VERIFIED" },
      }),
      prisma.product.count({
        where: { isActive: true, isSoldOut: false },
      }),
      prisma.sourcingRequest.count({ where: { status: "OPEN" } }),
      prisma.user.count(),
    ]);

    return {
      totalFarmers,
      verifiedFarmers,
      activeListings,
      openRequests,
      totalUsers,
    };
  });
}

export async function getPendingFarmers() {
  return withRetry(() =>
    prisma.farmerProfile.findMany({
      where: { verificationStatus: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        _count: { select: { products: true } },
      },
    })
  );
}

export async function getAllFarmers(limit = 50) {
  return withRetry(() =>
    prisma.farmerProfile.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        _count: { select: { products: true } },
      },
    })
  );
}

export async function getRecentListings(limit = 10) {
  return withRetry(() =>
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        farmer: {
          select: {
            id: true,
            farmName: true,
            verificationStatus: true,
          },
        },
        category: { select: { name: true } },
      },
    })
  );
}

export async function getAdminOpenReports() {
  return withRetry(() =>
    prisma.report.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            farmer: { select: { farmName: true } },
          },
        },
      },
    })
  );
}

export async function getAllListingsForAdmin(
  params: {
    q?: string;
    categoryId?: string;
    take?: number;
  } = {}
) {
  const { q, categoryId, take = 100 } = params;

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      {
        farmer: {
          OR: [
            { farmName: { contains: q, mode: "insensitive" } },
            { user: { fullName: { contains: q, mode: "insensitive" } } },
          ],
        },
      },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  return withRetry(() =>
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { id: true, name: true } },
        farmer: {
          select: {
            id: true,
            farmName: true,
            verificationStatus: true,
            user: { select: { fullName: true } },
          },
        },
        featured: { select: { isActive: true } },
        _count: { select: { enquiries: true, reports: true } },
      },
    })
  );
}

export async function getAllSourcingRequestsForAdmin(
  params: { q?: string; take?: number } = {}
) {
  const { q, take = 100 } = params;

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      {
        customer: {
          user: { fullName: { contains: q, mode: "insensitive" } },
        },
      },
    ];
  }

  return withRetry(() =>
    prisma.sourcingRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        customer: {
          include: {
            user: {
              select: { id: true, fullName: true, phone: true, email: true },
            },
          },
        },
        _count: { select: { responses: true } },
      },
    })
  );
}

// ============================================================
// ADMIN — REVENUE
// ============================================================

export async function getRevenueSummary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return withRetry(async () => {
    const [
      featuredTotal,
      featuredPending,
      subscriptionTotal,
      subscriptionPending,
      advertisingTotal,
      advertisingPending,
      sourcingTotal,
      sourcingPending,
      transactionTotal,
      monthPayments,
      refunds,
      total,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: { type: "FEATURED_LISTING", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "FEATURED_LISTING", status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "FARMER_PRO", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "FARMER_PRO", status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "ADVERTISEMENT", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "ADVERTISEMENT", status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "SOURCING_PREMIUM", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "SOURCING_PREMIUM", status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { type: "TRANSACTION_COMMISSION", status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          completedAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "REFUNDED" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

    return {
      total: total._sum.amount || 0,
      monthly: monthPayments._sum.amount || 0,
      refunds: refunds._sum.amount || 0,
      featured: {
        total: featuredTotal._sum.amount || 0,
        pending: featuredPending._sum.amount || 0,
      },
      subscription: {
        total: subscriptionTotal._sum.amount || 0,
        pending: subscriptionPending._sum.amount || 0,
      },
      advertising: {
        total: advertisingTotal._sum.amount || 0,
        pending: advertisingPending._sum.amount || 0,
      },
      sourcing: {
        total: sourcingTotal._sum.amount || 0,
        pending: sourcingPending._sum.amount || 0,
      },
      transaction: {
        total: transactionTotal._sum.amount || 0,
      },
    };
  });
}

export async function getRecentPayments(limit = 20) {
  return withRetry(() =>
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    })
  );
}

export async function getActiveFeatureListingsCount() {
  return withRetry(() =>
    prisma.featuredListing.count({
      where: {
        isActive: true,
        expiryDate: { gt: new Date() },
      },
    })
  );
}

// ============================================================
// CUSTOMER PROFILE
// ============================================================

export async function getCustomerProfileByUserId(userId: string) {
  return withRetry(() =>
    prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    })
  );
}

export async function getCustomerRequests(customerId: string, limit = 50) {
  return withRetry(() =>
    prisma.sourcingRequest.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        _count: { select: { responses: true } },
      },
    })
  );
}

export async function getCustomerEnquiries(customerId: string, limit = 50) {
  return withRetry(() =>
    prisma.enquiry.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            unit: true,
            priceUnit: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
        },
        farmer: {
          select: {
            id: true,
            farmName: true,
            whatsappNumber: true,
            verificationStatus: true,
            user: { select: { fullName: true } },
          },
        },
      },
    })
  );
}

export async function getUserNotifications(userId: string, limit = 30) {
  return withRetry(() =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  );
}

export async function getUnreadNotificationCount(userId: string) {
  return withRetry(() =>
    prisma.notification.count({
      where: { userId, isRead: false },
    })
  );
}

// ============================================================
// ADMIN — REPORTS
// ============================================================

export async function getAdminReports(params: {
  status?: string;
  take?: number;
} = {}) {
  const { status, take = 100 } = params;

  const where: any = {};
  if (status && status !== "all") where.status = status;

  return withRetry(() =>
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            isActive: true,
            farmer: {
              select: {
                id: true,
                farmName: true,
                user: { select: { fullName: true } },
              },
            },
          },
        },
      },
    })
  );
}