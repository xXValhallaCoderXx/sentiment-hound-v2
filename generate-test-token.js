#!/usr/bin/env node

/**
 * Simple test token generator for testing signup flow
 * 
 * This script generates a test token that you can use to test the signup functionality
 * without needing to set up the full database.
 */

console.log('🔧 Test Token Generator for Signup Testing\n');

// Generate a simple test token (32 characters)
function generateTestToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

const testToken = generateTestToken();

console.log('📋 Generated Test Token:\n');
console.log(`Token: ${testToken}`);
console.log('');

console.log('🔗 Test URLs:\n');
console.log('Local Development:');
console.log(`http://localhost:3000/sign-up?token=${testToken}`);
console.log('');
console.log('Alternative with "code" parameter:');
console.log(`http://localhost:3000/sign-up?code=${testToken}`);
console.log('');

console.log('⚠️  Important Notes:\n');
console.log('1. This is a FAKE token for UI testing only');
console.log('2. It will show "failed to validate token" error (which is correct)');
console.log('3. This tests the error handling and form validation');
console.log('4. For real testing, you need to:');
console.log('   - Start the database: docker-compose up -d');
console.log('   - Seed the database: pnpm turbo db:seed');
console.log('   - Generate real token: node scripts/generate-invitation-token.js --plan=Developer');
console.log('');

console.log('🧪 What You Can Test with This Fake Token:\n');

const testableFeatures = [
  'Form loads with invitation code pre-filled from URL',
  'Invitation code field is readonly when populated from URL',
  'Lock icon appears in readonly invitation field',
  'Form submission triggers server action',
  'Loading state appears on submit button',
  'Error message displays: "failed to validate token"',
  'Error alert appears with red styling',
  'Form remains active after error for correction',
  'Both ?token= and ?code= URL parameters work'
];

testableFeatures.forEach((feature, index) => {
  console.log(`✅ ${feature}`);
});

console.log('');

console.log('🚀 Quick Testing Steps:\n');
console.log('1. Start the development server:');
console.log('   pnpm dev');
console.log('');
console.log('2. Visit the test URL:');
console.log(`   http://localhost:3000/sign-up?token=${testToken}`);
console.log('');
console.log('3. Verify the form behavior:');
console.log('   - Invitation code field should be pre-filled');
console.log('   - Field should be readonly with lock icon');
console.log('   - Fill in other fields and submit');
console.log('   - Should see "failed to validate token" error');
console.log('');

console.log('4. Test manual token entry:');
console.log('   - Visit: http://localhost:3000/sign-up');
console.log('   - Should redirect to sign-in (if SIGNUPS_REQUIRE_INVITATION=true)');
console.log('   - Or allow manual token entry (if SIGNUPS_REQUIRE_INVITATION=false)');
console.log('');

console.log('🔧 For Real Token Testing:\n');
console.log('Once you have the database running, use these commands:');
console.log('');
console.log('# Start database');
console.log('docker-compose up -d');
console.log('');
console.log('# Seed database with plans');
console.log('pnpm turbo db:seed');
console.log('');
console.log('# Generate real invitation token');
console.log('node scripts/generate-invitation-token.js --plan=Developer');
console.log('');
console.log('# Use the real token URL for complete testing');
console.log('');

console.log('📊 Expected Behavior Summary:\n');
console.log('With Fake Token (this script):');
console.log('  ✅ Form UI works correctly');
console.log('  ✅ Token population from URL works');
console.log('  ✅ Error handling displays properly');
console.log('  ❌ User creation fails (expected)');
console.log('');
console.log('With Real Token (database setup):');
console.log('  ✅ Form UI works correctly');
console.log('  ✅ Token population from URL works');
console.log('  ✅ Token validation succeeds');
console.log('  ✅ User creation succeeds');
console.log('  ✅ Automatic sign-in and redirect');
console.log('');

console.log('🎯 This fake token is perfect for testing the UI and error handling!');
console.log('Use it to verify the form works before setting up the full database.');