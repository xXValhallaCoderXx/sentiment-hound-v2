#!/usr/bin/env node

/**
 * Complete testing guide for signup flow with valid invitation tokens
 * 
 * This script provides step-by-step instructions for testing the signup functionality
 * with properly generated invitation tokens.
 */

console.log('🧪 Testing Signup Flow with Valid Invitation Tokens\n');

console.log('📋 Available Plans for Token Generation:\n');

const availablePlans = [
  {
    name: 'Trial',
    description: 'Trial plan with basic access',
    features: 'No integrations, keywords, or competitors',
    usage: 'Default plan for users without tokens'
  },
  {
    name: 'Developer', 
    description: 'Developer plan for testing purposes',
    features: '1 integration, no keywords/competitors',
    usage: 'Good for testing signup flow'
  },
  {
    name: 'Starter',
    description: 'Starter plan for small businesses',
    features: '3 integrations, 3 keywords, 1 competitor, 300k tokens',
    usage: 'Production plan for small teams'
  },
  {
    name: 'Pro',
    description: 'Pro plan with advanced features',
    features: '10 integrations, 10 keywords, 5 competitors, 2.5M tokens',
    usage: 'Production plan for larger teams'
  }
];

availablePlans.forEach((plan, index) => {
  console.log(`${index + 1}. ${plan.name}`);
  console.log(`   Description: ${plan.description}`);
  console.log(`   Features: ${plan.features}`);
  console.log(`   Usage: ${plan.usage}`);
  console.log('');
});

console.log('🚀 Step-by-Step Testing Instructions:\n');

console.log('Step 1: Ensure Database is Seeded');
console.log('   Command: pnpm turbo db:seed');
console.log('   Purpose: Creates the plans in the database');
console.log('   Expected: Plans (Trial, Developer, Starter, Pro) created');
console.log('');

console.log('Step 2: Generate a Valid Invitation Token');
console.log('   Command: node scripts/generate-invitation-token.js --plan=Developer');
console.log('   Alternative: node scripts/generate-invitation-token.js --plan=Starter');
console.log('   Purpose: Creates a valid token linked to a specific plan');
console.log('   Expected: Token string and signup URL generated');
console.log('');

console.log('Step 3: Start Development Server');
console.log('   Command: pnpm dev');
console.log('   Purpose: Runs the Next.js app and NestJS server');
console.log('   Expected: Server running on http://localhost:3000');
console.log('');

console.log('Step 4: Test Signup with Generated Token');
console.log('   URL: http://localhost:3000/sign-up?token=<generated_token>');
console.log('   Purpose: Test the complete signup flow');
console.log('   Expected: Form pre-filled with readonly invitation code');
console.log('');

console.log('Step 5: Fill Out and Submit Form');
console.log('   Fields to fill:');
console.log('     - Name: Test User (optional)');
console.log('     - Email: test@example.com');
console.log('     - Password: password123');
console.log('     - Invitation Code: (auto-filled from URL)');
console.log('   Expected: Form submits successfully');
console.log('');

console.log('Step 6: Verify Success');
console.log('   Expected Results:');
console.log('     ✅ User created in database');
console.log('     ✅ User automatically signed in');
console.log('     ✅ Redirected to /dashboard');
console.log('     ✅ User assigned to correct plan');
console.log('     ✅ Invitation token marked as USED');
console.log('');

console.log('🔧 Quick Test Commands:\n');

console.log('# Complete test sequence');
console.log('pnpm turbo db:seed');
console.log('node scripts/generate-invitation-token.js --plan=Developer');
console.log('# Copy the generated token');
console.log('# Visit: http://localhost:3000/sign-up?token=<token>');
console.log('# Fill form and submit');
console.log('');

console.log('🧪 Different Test Scenarios:\n');

const testScenarios = [
  {
    scenario: 'Valid Token - Developer Plan',
    command: 'node scripts/generate-invitation-token.js --plan=Developer',
    expected: 'User gets Developer plan with 1 integration limit'
  },
  {
    scenario: 'Valid Token - Starter Plan',
    command: 'node scripts/generate-invitation-token.js --plan=Starter',
    expected: 'User gets Starter plan with 3 integrations, 3 keywords'
  },
  {
    scenario: 'Valid Token - Pro Plan',
    command: 'node scripts/generate-invitation-token.js --plan=Pro',
    expected: 'User gets Pro plan with 10 integrations, export features'
  },
  {
    scenario: 'Token with Expiration',
    command: 'node scripts/generate-invitation-token.js --plan=Developer --expires-in-days=1',
    expected: 'Token expires in 1 day, can test expiration logic'
  }
];

testScenarios.forEach((test, index) => {
  console.log(`${index + 1}. ${test.scenario}`);
  console.log(`   Command: ${test.command}`);
  console.log(`   Expected: ${test.expected}`);
  console.log('');
});

console.log('❌ Error Testing Scenarios:\n');

const errorScenarios = [
  {
    scenario: 'Invalid Token',
    url: 'http://localhost:3000/sign-up?token=invalid123',
    expected: 'Error: "Invalid invitation token"'
  },
  {
    scenario: 'No Token (with SIGNUPS_REQUIRE_INVITATION=true)',
    url: 'http://localhost:3000/sign-up',
    expected: 'Redirected to /sign-in page'
  },
  {
    scenario: 'Expired Token',
    setup: 'Generate token with --expires-in-days=0, wait, then use',
    expected: 'Error: "This invitation token has expired"'
  },
  {
    scenario: 'Used Token',
    setup: 'Use same token twice',
    expected: 'Error: "This invitation token has already been used"'
  },
  {
    scenario: 'Duplicate Email',
    setup: 'Sign up with same email twice',
    expected: 'Error: "An account with this email already exists. Please sign in."'
  }
];

errorScenarios.forEach((test, index) => {
  console.log(`${index + 1}. ${test.scenario}`);
  if (test.url) console.log(`   URL: ${test.url}`);
  if (test.setup) console.log(`   Setup: ${test.setup}`);
  console.log(`   Expected: ${test.expected}`);
  console.log('');
});

console.log('🔍 Debugging Tips:\n');

console.log('If token generation fails:');
console.log('  1. Check database connection: DATABASE_URL in .env');
console.log('  2. Ensure database is seeded: pnpm turbo db:seed');
console.log('  3. Check plan names are correct (case-sensitive)');
console.log('');

console.log('If signup fails:');
console.log('  1. Check server logs for detailed error messages');
console.log('  2. Verify SIGNUPS_REQUIRE_INVITATION environment variable');
console.log('  3. Check invitation token service is working');
console.log('  4. Ensure NextAuth is properly configured');
console.log('');

console.log('If form submission fails:');
console.log('  1. Check browser console for JavaScript errors');
console.log('  2. Verify server action is properly connected');
console.log('  3. Check network tab for 500 errors');
console.log('  4. Ensure all required fields are filled');
console.log('');

console.log('📊 Database Verification Queries:\n');

console.log('Check if plans exist:');
console.log('  SELECT * FROM "Plan";');
console.log('');

console.log('Check generated tokens:');
console.log('  SELECT * FROM "InvitationToken" ORDER BY "createdAt" DESC;');
console.log('');

console.log('Check created users:');
console.log('  SELECT email, name, "planId" FROM "User" ORDER BY "createdAt" DESC;');
console.log('');

console.log('Check token usage:');
console.log('  SELECT token, status, "redeemedAt", "redeemedByUserId" FROM "InvitationToken";');
console.log('');

console.log('🎯 Success Indicators:\n');

const successIndicators = [
  'Token generation script outputs valid token and URL',
  'Signup page loads with invitation code pre-filled',
  'Form submission shows loading state',
  'No console errors during submission',
  'User redirected to dashboard after signup',
  'User can access dashboard features',
  'Database shows user with correct plan assignment',
  'Invitation token marked as USED in database'
];

successIndicators.forEach((indicator, index) => {
  console.log(`✅ ${indicator}`);
});

console.log('');

console.log('🚀 Ready to Test!\n');

console.log('Run these commands to start testing:');
console.log('');
console.log('# 1. Seed the database');
console.log('pnpm turbo db:seed');
console.log('');
console.log('# 2. Generate a test token');
console.log('node scripts/generate-invitation-token.js --plan=Developer');
console.log('');
console.log('# 3. Start the server (in another terminal)');
console.log('pnpm dev');
console.log('');
console.log('# 4. Use the generated URL to test signup');
console.log('# The script will output a URL like:');
console.log('# https://sentimenthound.com/sign-up?token=<token>');
console.log('# Change it to: http://localhost:3000/sign-up?token=<token>');
console.log('');

console.log('Happy testing! 🎉');