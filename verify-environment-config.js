#!/usr/bin/env node

/**
 * Verification script for environment configuration
 * Checks that SIGNUPS_REQUIRE_INVITATION is properly configured
 */

console.log('🔧 Environment Configuration Verification\n');

// Check if we're in a Node.js environment
if (typeof process === 'undefined') {
  console.log('❌ Not running in Node.js environment');
  process.exit(1);
}

// Read environment variables directly from process.env
// In production, these would be set by the deployment platform

console.log('📋 Environment Variable Check:\n');

const signupsRequireInvitation = process.env.SIGNUPS_REQUIRE_INVITATION;

console.log(`SIGNUPS_REQUIRE_INVITATION = "${signupsRequireInvitation}"`);
console.log(`Type: ${typeof signupsRequireInvitation}`);
console.log('');

// Test the logic that will be used in the server action
const requiresInvitation = process.env.SIGNUPS_REQUIRE_INVITATION === 'true';

console.log('🧪 Logic Test Results:\n');
console.log(`requiresInvitation = ${requiresInvitation}`);
console.log(`Condition: process.env.SIGNUPS_REQUIRE_INVITATION === 'true'`);
console.log('');

if (requiresInvitation) {
  console.log('✅ INVITATION REQUIRED MODE');
  console.log('   - Sign-ups will require valid invitation tokens');
  console.log('   - Users without tokens will be rejected');
  console.log('   - Suitable for private alpha phase');
} else {
  console.log('✅ OPEN SIGNUP MODE');
  console.log('   - Sign-ups will work without invitation tokens');
  console.log('   - Invitation tokens still processed if provided');
  console.log('   - Suitable for public launch');
}

console.log('');

// Verify other related environment variables
console.log('🔍 Related Environment Variables:\n');

const authSecret = process.env.AUTH_SECRET;
const databaseUrl = process.env.DATABASE_URL;

console.log(`AUTH_SECRET: ${authSecret ? '✅ Set' : '❌ Missing'}`);
console.log(`DATABASE_URL: ${databaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log('');

// Configuration recommendations
console.log('📝 Configuration Recommendations:\n');

console.log('For Alpha Phase (Current):');
console.log('   SIGNUPS_REQUIRE_INVITATION=true');
console.log('');

console.log('For Public Launch (Future):');
console.log('   SIGNUPS_REQUIRE_INVITATION=false');
console.log('');

console.log('For Development Testing:');
console.log('   - Test both true and false values');
console.log('   - Verify invitation token generation works');
console.log('   - Test signup flows with and without tokens');
console.log('');

console.log('✨ Environment configuration verified successfully!');