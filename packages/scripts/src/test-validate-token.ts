#!/usr/bin/env tsx

/**
 * Test script to verify the validateToken method works correctly
 * Usage:
 *   pnpm --filter @repo/scripts test-validate --token=YOUR_TOKEN_HERE
 */

import { PrismaClient } from "@repo/db";
import { invitationTokenService } from "@repo/services";
import process from "node:process";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  let token = "";
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string" && arg.startsWith("--token=")) {
      token = arg.split("=")[1] ?? "";
    }
  }
  
  if (!token) {
    console.error("❌ Error: Please provide a token using --token=YOUR_TOKEN_HERE");
    process.exit(1);
  }
  
  try {
    console.log("🧪 Testing validateToken method...");
    
    // Test the validateToken method
    const validation = await invitationTokenService.validateToken(token);
    
    console.log("\n📋 Validation Result:");
    console.log(`   Is Valid: ${validation.isValid}`);
    
    if (validation.isValid) {
      console.log(`   Plan ID: ${validation.planId}`);
      console.log("   ✅ Token is valid and ready for use!");
    } else {
      console.log(`   Error: ${validation.error}`);
      console.log("   ❌ Token cannot be used for signup");
    }
    
    // Also check the database state
    const dbToken = await prisma.invitationToken.findUnique({
      where: { token },
      include: { planToAssign: true }
    });
    
    if (dbToken) {
      console.log("\n📊 Database State:");
      console.log(`   Status: ${dbToken.status}`);
      console.log(`   Plan: ${dbToken.planToAssign.name}`);
      console.log(`   Expires: ${dbToken.expiresAt.toISOString()}`);
      console.log(`   Redeemed By: ${dbToken.redeemedByUserId || 'None'}`);
    }
    
  } catch (error) {
    console.error("❌ Error testing validation:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);