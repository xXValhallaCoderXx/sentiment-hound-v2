#!/usr/bin/env node

/**
 * Database migration script for spam detection feature
 * This script helps migrate existing data and set up default plan features
 */

import { PrismaClient } from "@repo/db";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Running spam detection feature migration...");

  try {
    // Update default plan features to enable spam_detection for paid plans
    console.log("📦 Updating plan features...");
    
    const plansToUpdate = ['developer', 'starter', 'pro'];
    
    for (const planName of plansToUpdate) {
      const plan = await prisma.plan.findUnique({
        where: { name: planName }
      });

      if (plan) {
        const currentFeatures = (plan.features as Record<string, any>) || {};
        currentFeatures.spam_detection = true;

        await prisma.plan.update({
          where: { id: plan.id },
          data: { features: currentFeatures }
        });

        console.log(`✅ Updated ${planName} plan to include spam_detection feature`);
      } else {
        console.log(`⚠️  Plan '${planName}' not found, skipping...`);
      }
    }

    // Ensure public/trial plan does NOT have spam detection
    const publicPlan = await prisma.plan.findFirst({
      where: { 
        OR: [
          { name: 'public' },
          { name: 'trial' },
          { name: 'free' }
        ]
      }
    });

    if (publicPlan) {
      const currentFeatures = (publicPlan.features as Record<string, any>) || {};
      currentFeatures.spam_detection = false;

      await prisma.plan.update({
        where: { id: publicPlan.id },
        data: { features: currentFeatures }
      });

      console.log(`✅ Updated ${publicPlan.name} plan to disable spam_detection feature`);
    }

    // Check existing users and display summary
    console.log("\n📊 Current system status:");
    
    const plans = await prisma.plan.findMany({
      select: { name: true, features: true, _count: { select: { users: true } } }
    });

    plans.forEach(plan => {
      const features = (plan.features as Record<string, any>) || {};
      const hasSpamDetection = features.spam_detection === true;
      console.log(`   ${plan.name}: ${hasSpamDetection ? '✅' : '❌'} spam_detection (${plan._count.users} users)`);
    });

    const usersWithOverrides = await prisma.user.count({
      where: {
        featureFlags: {
          not: null
        }
      }
    });

    console.log(`\n🎛️  Users with feature flag overrides: ${usersWithOverrides}`);

    console.log("\n🎉 Migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Run 'prisma db push' or 'prisma migrate dev' to apply schema changes");
    console.log("2. Test the feature entitlement system with test-feature-entitlement.js");
    console.log("3. Use scripts/manage-feature-flags.js to override features for specific users");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});