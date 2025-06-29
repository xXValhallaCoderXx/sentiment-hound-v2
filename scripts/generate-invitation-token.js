#!/usr/bin/env node

/**
 * Admin script to generate invitation tokens
 * Usage: 
 *   node scripts/generate-invitation-token.js --plan=developer
 *   node scripts/generate-invitation-token.js --plan=developer --expires-in-days=30
 */

import { PrismaClient } from "@repo/db";
import { invitationTokenService } from "@repo/services";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const options = {};
  let planName = "developer"; // Default plan
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--plan=")) {
      planName = arg.split("=")[1];
    } else if (arg.startsWith("--expires-in-days=")) {
      options.expiresInDays = parseInt(arg.split("=")[1]);
    }
  }

  try {
    // Find the plan
    const plan = await prisma.plan.findUnique({
      where: { name: planName }
    });

    if (!plan) {
      console.error(`Error: Plan "${planName}" not found.`);
      console.error("Available plans:");
      const plans = await prisma.plan.findMany({ select: { name: true } });
      plans.forEach(p => console.error(`  - ${p.name}`));
      process.exit(1);
    }

    // Generate the invitation token
    const result = await invitationTokenService.generateToken(plan.id, options);

    if (result.success) {
      console.log(`✅ Successfully generated invitation token`);
      console.log(`   Token: ${result.token}`);
      console.log(`   Plan: ${plan.name} (${plan.description})`);
      if (options.expiresInDays) console.log(`   Expires in: ${options.expiresInDays} days`);
      console.log("");
      console.log("Share this link with the invited user:");
      console.log(`https://sentimenthound.com/sign-up?token=${result.token}`);
    } else {
      console.error(`❌ Failed to generate invitation token: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error generating invitation token:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);