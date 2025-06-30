#!/usr/bin/env tsx

/**
 * Test script to validate invitation tokens
 * Usage:
 *   pnpm --filter @repo/scripts test-token --token=YOUR_TOKEN_HERE
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
    // Check if token exists in database
    const dbToken = await prisma.invitationToken.findUnique({
      where: { token },
      include: { planToAssign: true }
    });
    
    if (!dbToken) {
      console.error("❌ Token not found in database");
      process.exit(1);
    }
    
    console.log("📋 Token Details:");
    console.log(`   Token: ${dbToken.token}`);
    console.log(`   Status: ${dbToken.status}`);
    console.log(`   Plan: ${dbToken.planToAssign.name} (${dbToken.planToAssign.description})`);
    console.log(`   Expires: ${dbToken.expiresAt.toISOString()}`);
    console.log(`   Created: ${dbToken.createdAt.toISOString()}`);
    
    if (dbToken.redeemedAt) {
      console.log(`   Redeemed: ${dbToken.redeemedAt.toISOString()}`);
      console.log(`   Redeemed by: ${dbToken.redeemedByUserId}`);
    }
    
    // Test validation without consuming
    if (dbToken.status === "PENDING") {
      console.log("\n🧪 Testing token validation (without consuming):");
      
      // Check expiration
      const isExpired = new Date() > dbToken.expiresAt;
      console.log(`   Is expired: ${isExpired ? "Yes" : "No"}`);
      console.log(`   Is valid for signup: ${!isExpired ? "Yes" : "No"}`);
      
      if (!isExpired) {
        console.log("\n✅ Token is ready for use!");
        console.log(`   Sign-up URL: http://localhost:3000/sign-up?token=${token}`);
      } else {
        console.log("\n❌ Token has expired and cannot be used");
      }
    } else {
      console.log(`\n⚠️  Token status is ${dbToken.status} - cannot be used for new signups`);
    }
    
  } catch (error) {
    console.error("❌ Error checking token:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);