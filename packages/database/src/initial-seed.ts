import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  const plans = [
    { name: "trial", description: "Trial plan with limited features" },
    { name: "starter", description: "Starter plan with basic features" },
    { name: "premium", description: "Premium plan with all features" },
  ];

  const providers = [
    { name: "youtube", description: "Youtube integration" },
    { name: "instagram", description: "Instagram integration" },
    { name: "facebook", description: "Facebook integration" },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    });
  }

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { name: provider.name },
      update: {},
      create: provider,
    });
  }

  console.log("Seed data inserted");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
