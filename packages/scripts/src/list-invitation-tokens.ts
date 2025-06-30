#!/usr/bin/env tsx

/**
 * Admin script to list all invitation tokens
 * Usage:
 *   pnpm --filter @repo/scripts list-tokens
 *   pnpm --filter @repo/scripts list-tokens --status=pending
 *   pnpm --filter @repo/scripts list-tokens --plan=developer
 */

import { PrismaClient } from "@repo/db";
import process from "node:process";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  let statusFilter: string | undefined;
  let planFilter: string | undefined;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string" && arg.startsWith("--status=")) {
      statusFilter = arg.split("=")[1]?.toUpperCase();
    } else if (typeof arg === "string" && arg.startsWith("--plan=")) {
      planFilter = arg.split("=")[1];
    }
  }
  
  try {
    const whereClause: any = {};
    
    if (statusFilter) {
      whereClause.status = statusFilter;
    }
    
    if (planFilter) {
      whereClause.planToAssign = {
        name: {
          contains: planFilter,
          mode: 'insensitive'
        }
      };
    }
    
    const tokens = await prisma.invitationToken.findMany({
      where: whereClause,
      include: { 
        planToAssign: true,
        redeemedByUser: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (tokens.length === 0) {
      console.log("📭 No invitation tokens found matching the criteria");
      return;
    }
    
    console.log(`📋 Found ${tokens.length} invitation token(s):\n`);
    
    tokens.forEach((token, index) => {
      console.log(`${index + 1}. Token: ${token.token}`);
      console.log(`   Status: ${token.status}`);
      console.log(`   Plan: ${token.planToAssign.name}`);
      console.log(`   Expires: ${token.expiresAt.toLocaleDateString()} ${token.expiresAt.toLocaleTimeString()}`);
      console.log(`   Created: ${token.createdAt.toLocaleDateString()} ${token.createdAt.toLocaleTimeString()}`);
      
      if (token.redeemedAt && token.redeemedByUser) {
        console.log(`   ✅ Redeemed: ${token.redeemedAt.toLocaleDateString()} ${token.redeemedAt.toLocaleTimeString()}`);
        console.log(`   👤 User: ${token.redeemedByUser.name || 'N/A'} (${token.redeemedByUser.email})`);
      }
      
      // Check if expired
      if (token.status === 'PENDING' && new Date() > token.expiresAt) {
        console.log(`   ⚠️  EXPIRED (but status not updated)`);
      }
      
      console.log(`   🔗 Sign-up URL: http://localhost:3000/sign-up?token=${token.token}`);
      console.log('');
    });
    
  } catch (error) {
    console.error("❌ Error listing tokens:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);