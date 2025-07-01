#!/usr/bin/env node

/**
 * Invitation token generator that runs from within the database package
 * Usage: 
 *   cd packages/database && node scripts/generate-token.js --plan=Developer
 *   pnpm --filter @repo/db exec node scripts/generate-token.js --plan=Developer
 */

import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

// Generate a secure random token
function generateSecureToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 32;
  let token = '';
  
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  
  return token;
}

async function generateInvitationToken(planName = 'Developer', expiresInDays = 7) {
  try {
    console.log('🔧 Generating Invitation Token\n');

    // Find the plan
    const plan = await prisma.plan.findUnique({
      where: { name: planName }
    });

    if (!plan) {
      console.error(`❌ Error: Plan "${planName}" not found.`);
      console.error('Available plans:');
      const plans = await prisma.plan.findMany({ select: { name: true } });
      plans.forEach(p => console.error(`  - ${p.name}`));
      process.exit(1);
    }

    // Generate the token
    const tokenValue = generateSecureToken();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create the token in database
    const token = await prisma.invitationToken.create({
      data: {
        token: tokenValue,
        planToAssignId: plan.id,
        expiresAt,
        status: 'PENDING'
      },
    });

    console.log(`✅ Successfully generated invitation token`);
    console.log(`   Token: ${token.token}`);
    console.log(`   Plan: ${plan.name} (${plan.description})`);
    console.log(`   Expires: ${expiresAt.toLocaleDateString()}`);
    console.log('');
    console.log('🔗 Test URLs:');
    console.log(`   Local: http://localhost:3000/sign-up?token=${token.token}`);
    console.log(`   Production: https://sentimenthound.com/sign-up?token=${token.token}`);
    console.log('');

    return token.token;
  } catch (error) {
    console.error('❌ Error generating invitation token:', error.message);
    
    if (error.code === 'P1001') {
      console.error('💡 Database connection failed. Make sure:');
      console.error('   1. PostgreSQL is running: docker-compose up -d');
      console.error('   2. DATABASE_URL is set correctly in .env');
    } else if (error.code === 'P2002') {
      console.error('💡 Token collision occurred. Please try again.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let planName = 'Developer';
let expiresInDays = 7;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--plan=')) {
    planName = arg.split('=')[1];
  } else if (arg.startsWith('--expires-in-days=')) {
    expiresInDays = parseInt(arg.split('=')[1]);
  }
}

console.log(`📋 Generating token for plan: ${planName}`);
console.log(`⏰ Token expires in: ${expiresInDays} days\n`);

// Generate the token
generateInvitationToken(planName, expiresInDays).catch(console.error);