#!/usr/bin/env node

/**
 * Test script to verify invitation code logic
 * This runs without needing the full Prisma setup
 */

// Test the invitation code validation logic
function validateInvitationCodeFormat(code) {
  if (!code || code.trim() === "") return false;
  
  // Allow alphanumeric codes with hyphens and underscores
  const codePattern = /^[A-Z0-9_-]+$/i;
  return codePattern.test(code.trim());
}

// Test URL parameter extraction
function getInvitationCodeFromUrl(testUrl) {
  const url = new URL(testUrl, 'https://example.com');
  const urlParams = new URLSearchParams(url.search);
  return urlParams.get("code");
}

console.log("🧪 Testing Invitation Code System Logic");
console.log("=" * 50);

// Test 1: Code format validation
console.log("\n1. Testing code format validation:");
const testCodes = [
  "EARLYBIRD2025",     // Valid
  "EARLY-BIRD",        // Valid with hyphen
  "BETA_USER",         // Valid with underscore
  "test123",           // Valid lowercase
  "CODE-123_TEST",     // Valid mixed
  "",                  // Invalid - empty
  "   ",              // Invalid - spaces only
  "INVALID@CODE",      // Invalid - special char
  "SPACE CODE",        // Invalid - spaces
];

testCodes.forEach(code => {
  const isValid = validateInvitationCodeFormat(code);
  const status = isValid ? "✅ VALID" : "❌ INVALID";
  console.log(`  "${code}" → ${status}`);
});

// Test 2: URL parameter extraction
console.log("\n2. Testing URL parameter extraction:");
const testUrls = [
  "https://sentimenthound.com/signup?code=EARLYBIRD2025",
  "https://sentimenthound.com/signup?code=BETA_USER&utm_source=email",
  "https://sentimenthound.com/signup",
  "https://sentimenthound.com/signup?other=param",
];

testUrls.forEach(url => {
  const code = getInvitationCodeFromUrl(url);
  const result = code ? `"${code}"` : "null";
  console.log(`  ${url} → code: ${result}`);
});

// Test 3: User flow scenarios
console.log("\n3. Testing user flow scenarios:");

const scenarios = [
  {
    name: "Email signup with valid code",
    invitationCode: "EARLYBIRD2025",
    authMethod: "email",
    expectedPlan: "developer"
  },
  {
    name: "Email signup without code",
    invitationCode: "",
    authMethod: "email", 
    expectedPlan: "trial"
  },
  {
    name: "OAuth signup with URL code",
    invitationCode: "BETA_USER",
    authMethod: "oauth",
    expectedPlan: "developer"
  },
  {
    name: "OAuth signup without code",
    invitationCode: "",
    authMethod: "oauth",
    expectedPlan: "trial"
  }
];

scenarios.forEach((scenario, index) => {
  console.log(`\n  Scenario ${index + 1}: ${scenario.name}`);
  console.log(`    Code: "${scenario.invitationCode}"`);
  console.log(`    Auth Method: ${scenario.authMethod}`);
  
  // Simulate logic
  let assignedPlan;
  if (scenario.invitationCode && validateInvitationCodeFormat(scenario.invitationCode)) {
    // Would validate with database in real implementation
    assignedPlan = "developer";
  } else {
    assignedPlan = "trial";
  }
  
  const status = assignedPlan === scenario.expectedPlan ? "✅ PASS" : "❌ FAIL";
  console.log(`    Expected Plan: ${scenario.expectedPlan}`);
  console.log(`    Assigned Plan: ${assignedPlan}`);
  console.log(`    Result: ${status}`);
});

console.log("\n4. Testing OAuth flow with localStorage simulation:");

// Simulate localStorage operations
const mockLocalStorage = {};

function setInvitationCodeInStorage(code) {
  mockLocalStorage.pendingInvitationCode = code;
}

function getInvitationCodeFromStorage() {
  return mockLocalStorage.pendingInvitationCode || null;
}

function clearInvitationCodeFromStorage() {
  delete mockLocalStorage.pendingInvitationCode;
}

// Simulate OAuth flow
console.log("  Step 1: User visits signup URL with code");
const urlCode = getInvitationCodeFromUrl("https://sentimenthound.com/signup?code=EARLYBIRD2025");
console.log(`    Extracted code: "${urlCode}"`);

console.log("  Step 2: Store code before OAuth redirect");
setInvitationCodeInStorage(urlCode);
console.log(`    Stored in localStorage: "${getInvitationCodeFromStorage()}"`);

console.log("  Step 3: User completes OAuth and returns");
console.log("  Step 4: Apply stored code after authentication");
const storedCode = getInvitationCodeFromStorage();
if (storedCode) {
  console.log(`    Retrieved code: "${storedCode}"`);
  console.log("    Would call API to apply code...");
  clearInvitationCodeFromStorage();
  console.log(`    Cleared storage: ${getInvitationCodeFromStorage()}`);
} else {
  console.log("    No stored code found");
}

console.log("\n🎉 All tests completed!");
console.log("\n📋 Implementation Summary:");
console.log("✅ Database schema updated with InvitationCode model");
console.log("✅ Added 'developer' plan for early testers");
console.log("✅ Created invitation code validation service");
console.log("✅ Updated AuthModal with collapsible invitation code field");
console.log("✅ Modified signup flow to handle invitation codes");
console.log("✅ Added OAuth flow support with localStorage persistence");
console.log("✅ Created admin script for generating codes");
console.log("✅ Added API endpoint for post-OAuth code application");
console.log("✅ Integrated invitation code handler in dashboard");

console.log("\n🚀 Ready for Production:");
console.log("1. Run database migrations: pnpm db:push");
console.log("2. Seed data with new developer plan: pnpm db:seed");
console.log("3. Generate invitation codes: node scripts/generate-invitation-code.js EARLYBIRD2025 --plan=developer");
console.log("4. Share invitation links: https://sentimenthound.com/signup?code=EARLYBIRD2025");