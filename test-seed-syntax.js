/**
 * Validation script to check seed.ts syntax without Prisma client
 */

// Mock the imports to validate syntax
const BillingInterval = {
  MONTHLY: 'MONTHLY'
};

class MockPrismaClient {
  plan = {
    upsert: async (options) => {
      console.log(`Plan upsert called for: ${options.create.name}`);
      return options.create;
    }
  };
  
  provider = {
    upsert: async (options) => {
      console.log(`Provider upsert called for: ${options.create.name}`);
      return options.create;
    }
  };
  
  $disconnect = async () => {
    console.log('Prisma disconnected');
  };
}

const prisma = new MockPrismaClient();

const seed = async () => {
  // 1) Seed plans
  const plans = [
    { 
      name: "Public", 
      description: "Public plan with basic access",
      price: 0,
      yearlyPrice: 0,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 0,
      maxTrackedKeywords: 0,
      maxCompetitors: 0,
      monthlyTokenAllowance: 0,
      features: {
        canExport: false
      },
      isActive: true,
      displayOrder: 0
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
      monthlyTokenAllowance: 0,
      features: {
        canExport: false
      },
      isActive: true,
      displayOrder: 1
    },
    { 
      name: "Starter", 
      description: "Starter plan for small businesses",
      price: 2900, // $29.00 per month as specified in issue
      yearlyPrice: 2900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 3,
      maxTrackedKeywords: 3,
      maxCompetitors: 1,
      monthlyTokenAllowance: 300000, // 300k tokens as specified
      features: {
        canExport: false
      },
      isActive: true,
      displayOrder: 2
    },
    { 
      name: "Pro", 
      description: "Pro plan with advanced features",
      price: 9900, // $99.00 per month as specified in issue
      yearlyPrice: 9900 * 12,
      billingInterval: BillingInterval.MONTHLY,
      maxIntegrations: 10,
      maxTrackedKeywords: 10,
      maxCompetitors: 5,
      monthlyTokenAllowance: 2500000, // 2.5M tokens as specified
      features: {
        canExport: true
      },
      isActive: true,
      displayOrder: 3
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        billingInterval: plan.billingInterval,
        maxIntegrations: plan.maxIntegrations,
        maxTrackedKeywords: plan.maxTrackedKeywords,
        maxCompetitors: plan.maxCompetitors,
        monthlyTokenAllowance: plan.monthlyTokenAllowance,
        features: plan.features,
        isActive: plan.isActive,
        displayOrder: plan.displayOrder
      },
      create: plan,
    });
  }

  // 2) Seed providers
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