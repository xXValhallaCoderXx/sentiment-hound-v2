/**
 * Test script for the new invitation token system
 * 
 * This script tests:
 * 1. Generating a new invitation token
 * 2. Consuming an invitation token
 * 3. Attempting to use an already consumed token
 */

const { prisma } = require("@repo/db");
const { invitationTokenService } = require("@repo/services");

async function main() {
  try {
    console.log("🔑 Testing Invitation Token System");
    console.log("=================================");

    // Get a plan to assign
    console.log("\n1. Finding a plan to use for testing...");
    const plan = await prisma.plan.findFirst({
      where: { isActive: true }
    });

    if (!plan) {
      console.error("❌ No active plans found in the database");
      return;
    }

    console.log(`   ✅ Found plan: ${plan.name} (ID: ${plan.id})`);

    // Generate a token
    console.log("\n2. Generating a new invitation token...");
    const result = await invitationTokenService.generateToken(plan.id, {
      expiresInDays: 7
    });

    if (!result.success) {
      console.error(`   ❌ Failed to generate token: ${result.error}`);
      return;
    }

    const token = result.token;
    console.log(`   ✅ Generated token: ${token}`);

    // Verify token in database
    console.log("\n3. Verifying token in database...");
    const savedToken = await prisma.invitationToken.findUnique({
      where: { token },
      include: { planToAssign: true }
    });

    if (!savedToken) {
      console.error("   ❌ Token not found in database");
      return;
    }

    console.log(`   ✅ Token found in database with status: ${savedToken.status}`);
    console.log(`   ✅ Associated plan: ${savedToken.planToAssign.name}`);
    console.log(`   ✅ Expires at: ${savedToken.expiresAt}`);

    // Consume the token
    console.log("\n4. Consuming the token...");
    const testUserId = "test-user-" + Date.now();
    const consumeResult = await invitationTokenService.consumeInvitationToken(token, testUserId);

    if (!consumeResult.isValid) {
      console.error(`   ❌ Failed to consume token: ${consumeResult.error}`);
      return;
    }

    console.log(`   ✅ Token consumed successfully`);
    console.log(`   ✅ Plan ID to assign: ${consumeResult.planId}`);

    // Verify token status after consumption
    console.log("\n5. Verifying token status after consumption...");
    const updatedToken = await prisma.invitationToken.findUnique({
      where: { token }
    });

    if (!updatedToken) {
      console.error("   ❌ Token not found in database");
      return;
    }

    console.log(`   ✅ Token status updated to: ${updatedToken.status}`);
    console.log(`   ✅ Redeemed by user: ${updatedToken.redeemedByUserId}`);
    console.log(`   ✅ Redeemed at: ${updatedToken.redeemedAt}`);

    // Try to consume the token again
    console.log("\n6. Attempting to consume the token again...");
    const secondConsumeResult = await invitationTokenService.consumeInvitationToken(token, "another-user");

    if (secondConsumeResult.isValid) {
      console.error("   ❌ Token was consumed again, but should have been rejected!");
      return;
    }

    console.log(`   ✅ Token reuse correctly rejected with error: ${secondConsumeResult.error}`);

    console.log("\n✅ All tests passed! The invitation token system is working correctly.");

  } catch (error) {
    console.error("Error testing invitation token system:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();