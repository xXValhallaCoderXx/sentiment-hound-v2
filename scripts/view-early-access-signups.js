#!/usr/bin/env node

/**
 * Script to view early access signups
 * Usage: node scripts/view-early-access-signups.js
 */

const { earlyAccessService } = require("../packages/services/dist/index.js");

async function main() {
    try {
        console.log("📋 Early Access Signups\n");
        console.log("========================\n");

        const signups = await earlyAccessService.getAllSignups();
        const count = await earlyAccessService.getSignupCount();

        console.log(`Total signups: ${count}\n`);

        if (signups.length === 0) {
            console.log("No signups yet. 🤷‍♂️");
            return;
        }

        signups.forEach((signup, index) => {
            console.log(`${index + 1}. ${signup.name || "Anonymous"} <${signup.email}>`);
            console.log(`   📅 Signed up: ${signup.createdAt.toLocaleDateString()}`);
            if (signup.ipAddress) {
                console.log(`   🌐 IP: ${signup.ipAddress}`);
            }
            if (signup.referrer) {
                console.log(`   🔗 Referrer: ${signup.referrer}`);
            }
            console.log("");
        });

        console.log(`\n🎉 Total: ${count} early access signups!`);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

main();
