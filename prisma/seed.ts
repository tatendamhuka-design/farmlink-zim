import { PrismaClient, UserRole, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding FarmLink Zim demo data...");

  // ---------- CLEAR EXISTING DATA (safe order) ----------
  await prisma.adminAction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedProduct.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.sourcingResponse.deleteMany();
  await prisma.sourcingRequest.deleteMany();
  await prisma.featuredListing.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ---------- CATEGORIES ----------
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Vegetables", slug: "vegetables", icon: "carrot", sortOrder: 1 } }),
    prisma.category.create({ data: { name: "Fruits", slug: "fruits", icon: "apple", sortOrder: 2 } }),
    prisma.category.create({ data: { name: "Grain", slug: "grain", icon: "wheat", sortOrder: 3 } }),
    prisma.category.create({ data: { name: "Livestock", slug: "livestock", icon: "beef", sortOrder: 4 } }),
    prisma.category.create({ data: { name: "Poultry", slug: "poultry", icon: "bird", sortOrder: 5 } }),
    prisma.category.create({ data: { name: "Eggs", slug: "eggs", icon: "egg", sortOrder: 6 } }),
    prisma.category.create({ data: { name: "Dairy", slug: "dairy", icon: "milk", sortOrder: 7 } }),
  ]);

  const [vegetables, fruits, grain, livestock, poultry, eggs, dairy] = categories;

  // ---------- USERS ----------
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@farmlink.co.zw",
      fullName: "Admin User",
      passwordHash,
      role: UserRole.ADMIN,
      phone: "+263771000001",
    },
  });

  const farmer1User = await prisma.user.create({
    data: {
      email: "tendai@farmlink.co.zw",
      fullName: "Tendai Moyo",
      passwordHash,
      role: UserRole.FARMER,
      phone: "+263771000002",
    },
  });

  const farmer2User = await prisma.user.create({
    data: {
      email: "rudo@farmlink.co.zw",
      fullName: "Rudo Chikafu",
      passwordHash,
      role: UserRole.FARMER,
      phone: "+263771000003",
    },
  });

  const farmer3User = await prisma.user.create({
    data: {
      email: "john@farmlink.co.zw",
      fullName: "John Nyathi",
      passwordHash,
      role: UserRole.FARMER,
      phone: "+263771000004",
    },
  });

  const customer1User = await prisma.user.create({
    data: {
      email: "buyer1@farmlink.co.zw",
      fullName: "Sarah Dube",
      passwordHash,
      role: UserRole.CUSTOMER,
      phone: "+263771000005",
    },
  });

  const customer2User = await prisma.user.create({
    data: {
      email: "buyer2@farmlink.co.zw",
      fullName: "Michael Banda",
      passwordHash,
      role: UserRole.CUSTOMER,
      phone: "+263771000006",
    },
  });

  // ---------- FARMER PROFILES ----------
  const farmer1 = await prisma.farmerProfile.create({
    data: {
      userId: farmer1User.id,
      farmName: "Moyo Family Farm",
      farmDescription: "Family-run farm in Harare specializing in fresh vegetables and onions.",
      whatsappNumber: "+263771000002",
      phoneNumber: "+263771000002",
      province: "Harare",
      city: "Harare",
      area: "Mabvuku",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      verifiedByUserId: admin.id,
      isPro: true,
      proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const farmer2 = await prisma.farmerProfile.create({
    data: {
      userId: farmer2User.id,
      farmName: "Chikafu Poultry",
      farmDescription: "Free-range chickens and fresh eggs from Chitungwiza.",
      whatsappNumber: "+263771000003",
      phoneNumber: "+263771000003",
      province: "Harare",
      city: "Chitungwiza",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      verifiedByUserId: admin.id,
    },
  });

  const farmer3 = await prisma.farmerProfile.create({
    data: {
      userId: farmer3User.id,
      farmName: "Nyathi Mixed Farm",
      farmDescription: "Maize, tomatoes, and livestock in Masvingo Province.",
      whatsappNumber: "+263771000004",
      phoneNumber: "+263771000004",
      province: "Masvingo",
      city: "Masvingo",
      verificationStatus: VerificationStatus.PENDING,
    },
  });

  // ---------- CUSTOMER PROFILES ----------
  const customer1 = await prisma.customerProfile.create({
    data: {
      userId: customer1User.id,
      province: "Harare",
      city: "Harare",
      area: "Borrowdale",
    },
  });

  const customer2 = await prisma.customerProfile.create({
    data: {
      userId: customer2User.id,
      province: "Bulawayo",
      city: "Bulawayo",
      isCommercial: true,
    },
  });

  // ---------- PRODUCTS ----------
  const p1 = await prisma.product.create({
    data: {
      farmerId: farmer1.id,
      categoryId: vegetables.id,
      title: "Red Onions",
      slug: "red-onions-moyo",
      description: "Fresh red onions, harvested this week. Firm, well-cured, ready for market.",
      quantity: 2000,
      unit: "kg",
      price: 0.7,
      priceUnit: "kg",
      province: "Harare",
      city: "Harare",
      area: "Mabvuku",
      minimumOrder: 100,
      deliveryAvailable: true,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      farmerId: farmer1.id,
      categoryId: vegetables.id,
      title: "Tomatoes",
      slug: "tomatoes-moyo",
      description: "Ripe red tomatoes, perfect for resale or home use.",
      quantity: 500,
      unit: "kg",
      price: 0.6,
      priceUnit: "kg",
      province: "Harare",
      city: "Harare",
      area: "Mabvuku",
      minimumOrder: 20,
      deliveryAvailable: true,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      farmerId: farmer2.id,
      categoryId: poultry.id,
      title: "Live Chickens",
      slug: "chickens-chikafu",
      description: "Healthy free-range chickens, average 2kg each.",
      quantity: 200,
      unit: "birds",
      price: 6,
      priceUnit: "bird",
      province: "Harare",
      city: "Chitungwiza",
      minimumOrder: 5,
      deliveryAvailable: false,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      farmerId: farmer2.id,
      categoryId: eggs.id,
      title: "Fresh Eggs",
      slug: "eggs-chikafu",
      description: "Farm-fresh eggs, collected daily.",
      quantity: 1500,
      unit: "trays",
      price: 3.5,
      priceUnit: "tray",
      province: "Harare",
      city: "Chitungwiza",
      minimumOrder: 5,
      deliveryAvailable: true,
    },
  });

  const p5 = await prisma.product.create({
    data: {
      farmerId: farmer3.id,
      categoryId: grain.id,
      title: "White Maize",
      slug: "maize-nyathi",
      description: "Clean, dry white maize from last season's harvest.",
      quantity: 5000,
      unit: "kg",
      price: 0.45,
      priceUnit: "kg",
      province: "Masvingo",
      city: "Masvingo",
      minimumOrder: 100,
      deliveryAvailable: true,
    },
  });

  const p6 = await prisma.product.create({
    data: {
      farmerId: farmer3.id,
      categoryId: livestock.id,
      title: "Cattle (Brahman)",
      slug: "cattle-nyathi",
      description: "Healthy Brahman cattle, well-fed and vaccinated.",
      quantity: 15,
      unit: "head",
      price: 650,
      priceUnit: "head",
      province: "Masvingo",
      city: "Masvingo",
      minimumOrder: 1,
      deliveryAvailable: false,
    },
  });

  const p7 = await prisma.product.create({
    data: {
      farmerId: farmer1.id,
      categoryId: fruits.id,
      title: "Mangoes",
      slug: "mangoes-moyo",
      description: "Sweet, ripe mangoes from our orchard.",
      quantity: 300,
      unit: "kg",
      price: 0.85,
      priceUnit: "kg",
      province: "Harare",
      city: "Harare",
      minimumOrder: 10,
      deliveryAvailable: true,
    },
  });

  const p8 = await prisma.product.create({
    data: {
      farmerId: farmer2.id,
      categoryId: dairy.id,
      title: "Fresh Milk",
      slug: "milk-chikafu",
      description: "Raw cow's milk, delivered fresh daily.",
      quantity: 100,
      unit: "litres",
      price: 1.2,
      priceUnit: "litre",
      province: "Harare",
      city: "Chitungwiza",
      minimumOrder: 5,
      deliveryAvailable: true,
    },
  });

  // ---------- PRODUCT IMAGES (placeholder URLs) ----------
  // We use picsum.photos for stable demo images. Replace with real uploads later.
  await prisma.productImage.createMany({
    data: [
      { productId: p1.id, url: "https://picsum.photos/seed/onions/800/600", sortOrder: 0 },
      { productId: p2.id, url: "https://picsum.photos/seed/tomatoes/800/600", sortOrder: 0 },
      { productId: p3.id, url: "https://picsum.photos/seed/chickens/800/600", sortOrder: 0 },
      { productId: p4.id, url: "https://picsum.photos/seed/eggs/800/600", sortOrder: 0 },
      { productId: p5.id, url: "https://picsum.photos/seed/maize/800/600", sortOrder: 0 },
      { productId: p6.id, url: "https://picsum.photos/seed/cattle/800/600", sortOrder: 0 },
      { productId: p7.id, url: "https://picsum.photos/seed/mangoes/800/600", sortOrder: 0 },
      { productId: p8.id, url: "https://picsum.photos/seed/milk/800/600", sortOrder: 0 },
    ],
  });

  // ---------- FEATURED LISTING (demo) ----------
  await prisma.featuredListing.create({
    data: {
      productId: p1.id,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      amountPaid: 3,
      paymentStatus: "PENDING",
      isActive: true,
    },
  });

  // ---------- SOURCING REQUESTS ----------
  await prisma.sourcingRequest.create({
    data: {
      customerId: customer1.id,
      title: "Need 5 tonnes of onions",
      description: "Looking for red or brown onions. Delivery to Harare CBD preferred.",
      quantity: 5,
      unit: "tonnes",
      province: "Harare",
      city: "Harare",
      requiredBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.sourcingRequest.create({
    data: {
      customerId: customer2.id,
      title: "Maize for milling - 10 tonnes",
      description: "White maize, dry and clean. Will collect from farmer.",
      quantity: 10,
      unit: "tonnes",
      province: "Bulawayo",
      city: "Bulawayo",
      requiredBy: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Seed complete.");
  console.log("");
  console.log("Demo accounts (all passwords: password123)");
  console.log("  Admin:    admin@farmlink.co.zw");
  console.log("  Farmer 1: tendai@farmlink.co.zw   (Verified, Pro)");
  console.log("  Farmer 2: rudo@farmlink.co.zw     (Verified)");
  console.log("  Farmer 3: john@farmlink.co.zw     (Pending verification)");
  console.log("  Buyer 1:  buyer1@farmlink.co.zw");
  console.log("  Buyer 2:  buyer2@farmlink.co.zw   (Commercial)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });