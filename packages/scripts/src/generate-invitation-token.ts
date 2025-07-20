#!/usr/bin/env tsx

/**
 * Admin script to generate invitation tokens
 * Usage:
 *   pnpm --filter @repo/scripts gen-token --plan=developer
 *   pnpm --filter @repo/scripts gen-token --plan=developer --expires-in-days=30
 */

// This script was moved from packages/database/scripts/generate-token.mjs and refactored for the scripts package.
// It generates invitation tokens for user sign-up flows.

import { PrismaClient } from "@repo/db";

const prisma = new PrismaClient();

function generateSecureToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const tokenLength = 32;
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

async function generateInvitationToken(
  planName = "Developer",
  expiresInDays = 7,
) {
  try {
    console.log("🔧 Generating Invitation Token\n");
    const plan = await prisma.plan.findUnique({ where: { name: planName } });
    if (!plan) {
      console.error(`❌ Error: Plan "${planName}" not found.`);
      console.error("Available plans:");
      const plans = await prisma.plan.findMany({ select: { name: true } });
      plans.forEach((p) => console.error(`  - ${p.name}`));
      process.exit(1);
    }
    const tokenValue = generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const token = await prisma.invitationToken.create({
      data: {
        token: tokenValue,
        planToAssignId: plan.id,
        expiresAt,
        status: "PENDING",
      },
    });
    console.log(`✅ Successfully generated invitation token`);
    console.log(`   Token: ${token.token}`);
    console.log(`   Plan: ${plan.name} (${plan.description})`);
    console.log(`   Expires: ${expiresAt.toLocaleDateString()}`);
    console.log("");
    console.log("🔗 Test URLs:");
    console.log(`   Local: http://localhost:3000/sign-up?token=${token.token}`);
    console.log(
      `   Production: https://sentimenthound.com/sign-up?token=${token.token}`,
    );
    console.log("");
    return token.token;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      console.error(
        "❌ Error generating invitation token:",
        (error as any).message,
      );
    } else {
      console.error("❌ Error generating invitation token:", error);
    }
    if (error && typeof error === "object" && "code" in error) {
      if ((error as any).code === "P1001") {
        console.error("💡 Database connection failed. Make sure:");
        console.error("   1. PostgreSQL is running: docker-compose up -d");
        console.error("   2. DATABASE_URL is set correctly in .env");
      } else if ((error as any).code === "P2002") {
        console.error("💡 Token collision occurred. Please try again.");
      }
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let planName = "Developer";
let expiresInDays = 7;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (typeof arg === "string" && arg.startsWith("--plan=")) {
    const planArg = arg.split("=")[1];
    if (planArg) planName = planArg;
  } else if (typeof arg === "string" && arg.startsWith("--expires-in-days=")) {
    const daysArg = arg.split("=")[1];
    if (daysArg) expiresInDays = parseInt(daysArg);
  }
}

// Run the script
(async () => {
  await generateInvitationToken(planName, expiresInDays);
})();
