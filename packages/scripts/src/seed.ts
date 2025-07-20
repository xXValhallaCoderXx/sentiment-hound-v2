#!/usr/bin/env tsx

/**
 * Database seeding script for Sentiment Hound
 * Usage: pnpm --filter @repo/scripts db-seed
 */

import { PrismaClient, BillingInterval } from "@repo/db";

const prisma = new PrismaClient();

interface Plan {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  billingInterval: BillingInterval;
  maxIntegrations: number;
  maxTrackedKeywords: number;
  maxCompetitors: number;
  monthlyTokenAllowance: number;
  features: {
    canExport: boolean;
  };
  isActive: boolean;
  displayOrder: number;
}

const seed = async (): Promise<void> => {
  // 1) Seed plans
  const plans: Plan[] = [
    {
      name: "Trial",
      description: "Trial plan with basic access",
      price: 0,
      yearlyPrice: 0,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 0,
      maxTrackedKeywords: 0,
      maxCompetitors: 0,
      monthlyTokenAllowance: 0,
      features: { canExport: false },
      isActive: true,
      displayOrder: 0,
    },
    {
      name: "Developer",
      description: "Developer plan for testing purposes",
      price: 0,
      yearlyPrice: 0,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 1,
      maxTrackedKeywords: 0,
      maxCompetitors: 0,
      monthlyTokenAllowance: 5000,
      features: { canExport: false },
      isActive: true,
      displayOrder: 1,
    },
    {
      name: "Starter",
      description: "Starter plan for small businesses",
      price: 2900, // $29.00 per month
      yearlyPrice: 2900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 3,
      maxTrackedKeywords: 3,
      maxCompetitors: 1,
      monthlyTokenAllowance: 300000, // 300k tokens
      features: { canExport: false },
      isActive: true,
      displayOrder: 2,
    },
    {
      name: "Pro",
      description: "Pro plan with advanced features",
      price: 9900, // $99.00 per month
      yearlyPrice: 9900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 10,
      maxTrackedKeywords: 10,
      maxCompetitors: 5,
      monthlyTokenAllowance: 2500000, // 2.5M tokens
      features: { canExport: true },
      isActive: true,
      displayOrder: 3,
    },
  ];

  console.log("Seeding plans...");
  for (const plan of plans) {
    const existingPlan = await prisma.plan.findUnique({
      where: { name: plan.name },
    });
    if (existingPlan) {
      console.log(`  ✓ Plan "${plan.name}" already exists, skipping...`);
    } else {
      await prisma.plan.create({ data: plan });
      console.log(`  ✅ Created plan "${plan.name}"`);
    }
  }

  // 2) Seed providers
  console.log("Seeding providers...");
  const providers = [
    {
      name: "YouTube",
      description: "Analyze comments from YouTube videos.",
      image: "/logos/youtube.png",
    },
    {
      name: "Reddit",
      description: "Analyze comments from Reddit posts.",
      image: "/logos/reddit.png",
    },
  ];

  for (const provider of providers) {
    const existingProvider = await prisma.provider.findUnique({
      where: { name: provider.name },
    });
    if (existingProvider) {
      console.log(
        `  ✓ Provider "${provider.name}" already exists, skipping...`,
      );
    } else {
      await prisma.provider.create({ data: provider });
      console.log(`  ✅ Created provider "${provider.name}"`);
    }
  }

  console.log("✅ Seed completed successfully!");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
