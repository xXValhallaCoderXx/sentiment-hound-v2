#!/usr/bin/env node

/**
 * Admin script to manage user feature flags
 * Usage: 
 *   node scripts/manage-feature-flags.js set USER_ID spam_detection true
 *   node scripts/manage-feature-flags.js set USER_ID spam_detection false
 *   node scripts/manage-feature-flags.js remove USER_ID spam_detection
 *   node scripts/manage-feature-flags.js get USER_ID
 */

import { PrismaClient } from "@repo/db";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: node scripts/manage-feature-flags.js <command> [options]");
    console.error("");
    console.error("Commands:");
    console.error("  set <user_id> <feature_name> <value>    Set a feature flag (true/false)");
    console.error("  remove <user_id> <feature_name>         Remove a feature flag");
    console.error("  get <user_id>                           Get all feature flags for a user");
    console.error("");
    console.error("Examples:");
    console.error("  node scripts/manage-feature-flags.js set user123 spam_detection true");
    console.error("  node scripts/manage-feature-flags.js set user456 spam_detection false");
    console.error("  node scripts/manage-feature-flags.js remove user123 spam_detection");
    console.error("  node scripts/manage-feature-flags.js get user123");
    process.exit(1);
  }

  const command = args[0];

  try {
    switch (command) {
      case 'set':
        await setFeatureFlag(args[1], args[2], args[3]);
        break;
      case 'remove':
        await removeFeatureFlag(args[1], args[2]);
        break;
      case 'get':
        await getFeatureFlags(args[1]);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function setFeatureFlag(userId: string, featureName: string, value: string) {
  if (!userId || !featureName || !value) {
    throw new Error("Usage: set <user_id> <feature_name> <value>");
  }

  const boolValue = value.toLowerCase() === 'true';
  
  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, featureFlags: true, plan: { select: { name: true } } }
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Update feature flags
  const currentFlags = (user.featureFlags as Record<string, any>) || {};
  currentFlags[featureName] = boolValue;

  await prisma.user.update({
    where: { id: userId },
    data: { featureFlags: currentFlags }
  });

  console.log(`✅ Set feature flag "${featureName}" to ${boolValue} for user ${userId}`);
  console.log(`   User plan: ${user.plan?.name || 'No plan'}`);
  console.log(`   Updated feature flags:`, currentFlags);
}

async function removeFeatureFlag(userId: string, featureName: string) {
  if (!userId || !featureName) {
    throw new Error("Usage: remove <user_id> <feature_name>");
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, featureFlags: true, plan: { select: { name: true } } }
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Remove feature flag
  const currentFlags = (user.featureFlags as Record<string, any>) || {};
  delete currentFlags[featureName];

  await prisma.user.update({
    where: { id: userId },
    data: { featureFlags: Object.keys(currentFlags).length > 0 ? currentFlags : null }
  });

  console.log(`✅ Removed feature flag "${featureName}" for user ${userId}`);
  console.log(`   User plan: ${user.plan?.name || 'No plan'}`);
  console.log(`   Remaining feature flags:`, Object.keys(currentFlags).length > 0 ? currentFlags : 'None');
}

async function getFeatureFlags(userId: string) {
  if (!userId) {
    throw new Error("Usage: get <user_id>");
  }

  // Get current user with plan
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      id: true, 
      email: true,
      featureFlags: true, 
      plan: { 
        select: { 
          name: true, 
          features: true 
        } 
      } 
    }
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  console.log(`📋 Feature flags for user ${userId}:`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Plan: ${user.plan?.name || 'No plan'}`);
  console.log("");
  
  const planFeatures = (user.plan?.features as Record<string, any>) || {};
  const userFlags = (user.featureFlags as Record<string, any>) || {};

  console.log("📦 Plan features:");
  if (Object.keys(planFeatures).length > 0) {
    Object.entries(planFeatures).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
  } else {
    console.log("   None");
  }

  console.log("");
  console.log("🎛️  User-level overrides:");
  if (Object.keys(userFlags).length > 0) {
    Object.entries(userFlags).forEach(([key, value]) => {
      console.log(`   ${key}: ${value} (overrides plan)`);
    });
  } else {
    console.log("   None");
  }

  console.log("");
  console.log("🎯 Final effective features:");
  const allFeatures = new Set([...Object.keys(planFeatures), ...Object.keys(userFlags)]);
  allFeatures.forEach(feature => {
    const hasUserOverride = feature in userFlags;
    const finalValue = hasUserOverride ? userFlags[feature] : planFeatures[feature];
    const source = hasUserOverride ? '(user override)' : '(from plan)';
    console.log(`   ${feature}: ${finalValue} ${source}`);
  });
}

main().catch(console.error);