#!/usr/bin/env node

/**
 * Test script for early access signup functionality
 * Usage: node scripts/test-early-access.js
 */

const { earlyAccessService } = require("../packages/services/dist/index.js");

async function testEarlyAccessSignup() {
    console.log("🧪 Testing Early Access Signup Functionality\n");

    try {
        // Test 1: Create a new signup
        console.log("1. Testing new signup...");
        const result1 = await earlyAccessService.createSignup({
            name: "Test User",
            email: "test@example.com",
        });

        if (result1.success) {
            console.log("   ✅ New signup successful!");
            console.log(`   📧 Email: ${result1.data.email}`);
            console.log(`   👤 Name: ${result1.data.name}`);
        } else {
            console.log("   ❌ New signup failed:", result1.error);
        }

        // Test 2: Try to signup with the same email (should fail)
        console.log("\n2. Testing duplicate email...");
        const result2 = await earlyAccessService.createSignup({
            name: "Another User",
            email: "test@example.com", // Same email
        });

        if (!result2.success && result2.alreadyExists) {
            console.log("   ✅ Duplicate email correctly rejected!");
            console.log(`   📝 Message: ${result2.error}`);
        } else {
            console.log("   ❌ Duplicate email test failed");
        }

        // Test 3: Get signup count
        console.log("\n3. Testing signup count...");
        const count = await earlyAccessService.getSignupCount();
        console.log(`   📊 Total signups: ${count}`);

        // Test 4: Find signup by email
        console.log("\n4. Testing find by email...");
        const foundSignup = await earlyAccessService.getSignupByEmail("test@example.com");
        if (foundSignup) {
            console.log("   ✅ Found signup by email!");
            console.log(`   👤 Name: ${foundSignup.name}`);
            console.log(`   📅 Created: ${foundSignup.createdAt}`);
        } else {
            console.log("   ❌ Could not find signup by email");
        }

        console.log("\n🎉 All tests completed!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

testEarlyAccessSignup();
