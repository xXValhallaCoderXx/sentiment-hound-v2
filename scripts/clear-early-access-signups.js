#!/usr/bin/env node

/**
 * Script to clear early access signups (for testing purposes)
 * Usage: node scripts/clear-early-access-signups.js
 */

const { prisma } = require("../packages/database/dist/index.js");

async function clearEarlyAccessSignups() {
    try {
        console.log("🧹 Clearing Early Access Signups...\n");

        const result = await prisma.earlyAccessSignup.deleteMany({});

        console.log(`✅ Deleted ${result.count} early access signups.`);

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearEarlyAccessSignups();
