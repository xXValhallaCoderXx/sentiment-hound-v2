#!/usr/bin/env node

/**
 * Test script to verify feature entitlement logic
 * This tests the hierarchical feature checking system
 */

// Mock the feature checking logic locally for testing
function hasFeatureAccess(user, featureName) {
  // 1. Check for a manual override first
  if (user.featureFlags && typeof user.featureFlags === 'object') {
    const userOverride = user.featureFlags[featureName];
    if (typeof userOverride === 'boolean') {
      return userOverride; // Returns true if enabled, false if disabled
    }
  }

  // 2. If no override, fall back to the user's plan
  const planHasFeature = user.plan?.features && 
    typeof user.plan.features === 'object' &&
    Boolean(user.plan.features[featureName]);
  
  return planHasFeature;
}

console.log("🧪 Testing Feature Entitlement System");
console.log("=" * 50);

// Test scenarios
const testScenarios = [
  {
    name: "Pro plan user with spam_detection enabled by default",
    user: {
      id: "user1",
      plan: { features: { spam_detection: true } },
      featureFlags: null
    },
    feature: "spam_detection",
    expectedResult: true
  },
  {
    name: "Public plan user without spam_detection",
    user: {
      id: "user2", 
      plan: { features: {} },
      featureFlags: null
    },
    feature: "spam_detection",
    expectedResult: false
  },
  {
    name: "Pro plan user with spam_detection manually disabled",
    user: {
      id: "user3",
      plan: { features: { spam_detection: true } },
      featureFlags: { spam_detection: false }
    },
    feature: "spam_detection",
    expectedResult: false
  },
  {
    name: "Public plan user with spam_detection manually enabled",
    user: {
      id: "user4",
      plan: { features: {} },
      featureFlags: { spam_detection: true }
    },
    feature: "spam_detection",
    expectedResult: true
  },
  {
    name: "Developer plan user with spam_detection enabled by default",
    user: {
      id: "user5",
      plan: { features: { spam_detection: true } },
      featureFlags: null
    },
    feature: "spam_detection",
    expectedResult: true
  },
  {
    name: "User with mixed feature flags",
    user: {
      id: "user6",
      plan: { features: { spam_detection: false, other_feature: true } },
      featureFlags: { spam_detection: true }
    },
    feature: "spam_detection",
    expectedResult: true
  }
];

// Run tests
console.log("\n📋 Running test scenarios:\n");

let passed = 0;
let failed = 0;

testScenarios.forEach((scenario, index) => {
  const result = hasFeatureAccess(scenario.user, scenario.feature);
  const success = result === scenario.expectedResult;
  
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   Expected: ${scenario.expectedResult}`);
  console.log(`   Got: ${result}`);
  console.log(`   Status: ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log("");
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log("📊 Test Results:");
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);
console.log(`   Total: ${testScenarios.length}`);

if (failed === 0) {
  console.log("\n🎉 All tests passed! Feature entitlement logic is working correctly.");
} else {
  console.log("\n❌ Some tests failed. Please review the feature entitlement logic.");
  process.exit(1);
}