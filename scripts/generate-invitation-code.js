#!/usr/bin/env node

/**
 * Admin script to generate invitation codes
 * Usage: 
 *   node scripts/generate-invitation-code.js EARLYBIRD2025 --plan=developer
 *   node scripts/generate-invitation-code.js SAVE20 --plan=starter --max-uses=100 --expires="2025-12-31"
 */

import { PrismaClient } from "@repo/db";
import { invitationCodeService } from "@repo/services";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: node scripts/generate-invitation-code.js <CODE> [options]");
    console.error("");
    console.error("Options:");
    console.error("  --plan=<plan_name>        Plan to grant (default: developer)");
    console.error("  --max-uses=<number>       Maximum number of uses");
    console.error("  --expires=<YYYY-MM-DD>    Expiration date");
    console.error("  --discount-type=<type>    Discount type (PERCENT, FIXED_AMOUNT)");
    console.error("  --discount-value=<value>  Discount value");
    console.error("");
    console.error("Examples:");
    console.error("  node scripts/generate-invitation-code.js EARLYBIRD2025 --plan=developer");
    console.error("  node scripts/generate-invitation-code.js BETA100 --plan=developer --max-uses=100");
    console.error("  node scripts/generate-invitation-code.js SAVE20 --plan=starter --discount-type=PERCENT --discount-value=20");
    process.exit(1);
  }

  const code = args[0];
  
  // Parse options
  const options = {};
  let planName = "developer"; // Default plan
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--plan=")) {
      planName = arg.split("=")[1];
    } else if (arg.startsWith("--max-uses=")) {
      options.maxUses = parseInt(arg.split("=")[1]);
    } else if (arg.startsWith("--expires=")) {
      options.expiresAt = new Date(arg.split("=")[1]);
    } else if (arg.startsWith("--discount-type=")) {
      options.discountType = arg.split("=")[1];
    } else if (arg.startsWith("--discount-value=")) {
      options.discountValue = parseFloat(arg.split("=")[1]);
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

    // Generate the invitation code
    const result = await invitationCodeService.generateCode(code, plan.id, options);

    if (result.success) {
      console.log(`✅ Successfully generated invitation code: ${code.toUpperCase()}`);
      console.log(`   Plan: ${plan.name} (${plan.description})`);
      if (options.maxUses) console.log(`   Max uses: ${options.maxUses}`);
      if (options.expiresAt) console.log(`   Expires: ${options.expiresAt.toDateString()}`);
      if (options.discountType) console.log(`   Discount: ${options.discountValue}${options.discountType === 'PERCENT' ? '%' : ' cents'} off`);
      console.log("");
      console.log("Share this link with early testers:");
      console.log(`https://sentimenthound.com/signup?code=${code.toUpperCase()}`);
    } else {
      console.error(`❌ Failed to generate invitation code: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error generating invitation code:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);