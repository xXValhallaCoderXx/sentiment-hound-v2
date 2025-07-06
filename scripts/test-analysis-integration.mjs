#!/usr/bin/env node

/**
 * Integration Test Script for Analysis Server Action
 * 
 * This script tests the startAnalysis server action with various scenarios
 * to ensure the fallback logic works correctly in a real environment.
 */

import { startAnalysis } from '../apps/web/actions/analysis.actions.js';

// Test URLs
const testUrls = {
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    reddit: 'https://www.reddit.com/r/programming/comments/test/example/',
    invalid: 'https://invalid-domain.com/test',
    malformed: 'not-a-url'
};

async function runIntegrationTests() {
    console.log('🚀 Starting Analysis Server Action Integration Tests\n');

    // Test 1: Valid YouTube URL (should work with master token if available)
    console.log('Test 1: Valid YouTube URL');
    try {
        const result = await startAnalysis(testUrls.youtube);
        console.log('✅ Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    console.log('');

    // Test 2: Valid Reddit URL
    console.log('Test 2: Valid Reddit URL');
    try {
        const result = await startAnalysis(testUrls.reddit);
        console.log('✅ Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    console.log('');

    // Test 3: Invalid URL
    console.log('Test 3: Invalid URL');
    try {
        const result = await startAnalysis(testUrls.invalid);
        console.log('✅ Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    console.log('');

    // Test 4: Malformed URL
    console.log('Test 4: Malformed URL');
    try {
        const result = await startAnalysis(testUrls.malformed);
        console.log('✅ Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    console.log('');

    console.log('🎯 Integration tests completed');
}

// Check environment variables
function checkEnvironment() {
    console.log('🔍 Environment Check:');
    console.log(`YOUTUBE_MASTER_API_KEY: ${process.env.YOUTUBE_MASTER_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`REDDIT_MASTER_ACCESS_TOKEN: ${process.env.REDDIT_MASTER_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log('');
}

// Main execution
async function main() {
    checkEnvironment();
    await runIntegrationTests();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { runIntegrationTests, checkEnvironment };
