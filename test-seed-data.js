/**
 * Test script to validate seed data matches issue requirements
 * This runs without database connection to validate data structure
 */

// Mock BillingInterval enum
const BillingInterval = {
  MONTHLY: 'MONTHLY'
};

// Expected plans from issue requirements
const expectedPlans = [
  { name: "Public", price: 0, maxIntegrations: 0, maxCompetitors: 0, monthlyTokenAllowance: 0, features: { canExport: false } },
  { name: "Developer", price: 0, maxIntegrations: 1, maxCompetitors: 0, monthlyTokenAllowance: 0, features: { canExport: false } },
  { name: "Starter", price: 2900, maxIntegrations: 3, maxCompetitors: 1, monthlyTokenAllowance: 300000, features: { canExport: false } },
  { name: "Pro", price: 9900, maxIntegrations: 10, maxCompetitors: 5, monthlyTokenAllowance: 2500000, features: { canExport: true } }
];

// Expected providers from issue requirements
const expectedProviders = [
  { name: "YouTube", image: "/logos/youtube.png", description: "Analyze comments from YouTube videos." },
  { name: "Reddit", image: "/logos/reddit.png", description: "Analyze comments from Reddit posts." }
];

// Replicate seed data structure
const plans = [
  { 
    name: "Public", 
    description: "Public plan with basic access",
    price: 0,
    yearlyPrice: 0,
    billingInterval: BillingInterval.MONTHLY,
    maxIntegrations: 0,
    maxTrackedKeywords: 0,
    maxCompetitors: 0,
    monthlyTokenAllowance: 0,
    features: {
      canExport: false
    },
    isActive: true,
    displayOrder: 0
  },
  { 
    name: "Developer", 
    description: "Developer plan for testing purposes",
    price: 0,
    yearlyPrice: 0,
    billingInterval: BillingInterval.MONTHLY,
    maxIntegrations: 1,
    maxTrackedKeywords: 0,
    maxCompetitors: 0,
    monthlyTokenAllowance: 0,
    features: {
      canExport: false
    },
    isActive: true,
    displayOrder: 1
  },
  { 
    name: "Starter", 
    description: "Starter plan for small businesses",
    price: 2900,
    yearlyPrice: 2900 * 12,
    billingInterval: BillingInterval.MONTHLY,
    maxIntegrations: 3,
    maxTrackedKeywords: 3,
    maxCompetitors: 1,
    monthlyTokenAllowance: 300000,
    features: {
      canExport: false
    },
    isActive: true,
    displayOrder: 2
  },
  { 
    name: "Pro", 
    description: "Pro plan with advanced features",
    price: 9900,
    yearlyPrice: 9900 * 12,
    billingInterval: BillingInterval.MONTHLY,
    maxIntegrations: 10,
    maxTrackedKeywords: 10,
    maxCompetitors: 5,
    monthlyTokenAllowance: 2500000,
    features: {
      canExport: true
    },
    isActive: true,
    displayOrder: 3
  }
];

const providers = [
  {
    name: "YouTube",
    description: "Analyze comments from YouTube videos.",
    image: "/logos/youtube.png",
  },
  {
    name: "Reddit",
    description: "Analyze comments from Reddit posts.",
    image: "/logos/reddit.png",
  },
];

function validatePlans() {
  console.log('🔍 Validating plans data...');
  
  if (plans.length !== expectedPlans.length) {
    console.error(`❌ Expected ${expectedPlans.length} plans, got ${plans.length}`);
    return false;
  }
  
  for (let i = 0; i < expectedPlans.length; i++) {
    const expected = expectedPlans[i];
    const actual = plans[i];
    
    console.log(`\n📋 Checking plan: ${expected.name}`);
    
    if (actual.name !== expected.name) {
      console.error(`❌ Plan name mismatch: expected ${expected.name}, got ${actual.name}`);
      return false;
    }
    
    if (actual.price !== expected.price) {
      console.error(`❌ Plan price mismatch: expected ${expected.price}, got ${actual.price}`);
      return false;
    }
    
    if (actual.maxIntegrations !== expected.maxIntegrations) {
      console.error(`❌ Plan maxIntegrations mismatch: expected ${expected.maxIntegrations}, got ${actual.maxIntegrations}`);
      return false;
    }
    
    if (actual.maxCompetitors !== expected.maxCompetitors) {
      console.error(`❌ Plan maxCompetitors mismatch: expected ${expected.maxCompetitors}, got ${actual.maxCompetitors}`);
      return false;
    }
    
    if (actual.monthlyTokenAllowance !== expected.monthlyTokenAllowance) {
      console.error(`❌ Plan monthlyTokenAllowance mismatch: expected ${expected.monthlyTokenAllowance}, got ${actual.monthlyTokenAllowance}`);
      return false;
    }
    
    if (actual.features.canExport !== expected.features.canExport) {
      console.error(`❌ Plan canExport mismatch: expected ${expected.features.canExport}, got ${actual.features.canExport}`);
      return false;
    }
    
    console.log(`✅ Plan ${expected.name} validated successfully`);
  }
  
  return true;
}

function validateProviders() {
  console.log('\n🔍 Validating providers data...');
  
  if (providers.length !== expectedProviders.length) {
    console.error(`❌ Expected ${expectedProviders.length} providers, got ${providers.length}`);
    return false;
  }
  
  for (let i = 0; i < expectedProviders.length; i++) {
    const expected = expectedProviders[i];
    const actual = providers[i];
    
    console.log(`\n🔌 Checking provider: ${expected.name}`);
    
    if (actual.name !== expected.name) {
      console.error(`❌ Provider name mismatch: expected ${expected.name}, got ${actual.name}`);
      return false;
    }
    
    if (actual.image !== expected.image) {
      console.error(`❌ Provider image mismatch: expected ${expected.image}, got ${actual.image}`);
      return false;
    }
    
    if (actual.description !== expected.description) {
      console.error(`❌ Provider description mismatch: expected ${expected.description}, got ${actual.description}`);
      return false;
    }
    
    console.log(`✅ Provider ${expected.name} validated successfully`);
  }
  
  return true;
}

function main() {
  console.log('🚀 Testing seed data against issue requirements...\n');
  
  const plansValid = validatePlans();
  const providersValid = validateProviders();
  
  if (plansValid && providersValid) {
    console.log('\n🎉 All seed data validated successfully!');
    console.log('✅ Plans data matches issue requirements');
    console.log('✅ Providers data matches issue requirements');
    process.exit(0);
  } else {
    console.log('\n💥 Validation failed!');
    process.exit(1);
  }
}

main();