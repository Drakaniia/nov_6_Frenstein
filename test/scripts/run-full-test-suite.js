#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const testResultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const fullResults = {
  timestamp: new Date().toISOString(),
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    duration: 0
  },
  stages: {}
};

function runCommand(command, description, cwd = path.join(__dirname, '../..')) {
  console.log(`\n🔄 ${description}...`);
  const startTime = Date.now();
  
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' }
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ ${description} completed in ${duration}ms`);
    
    fullResults.stages[description] = {
      success: true,
      duration,
      error: null
    };
    
    fullResults.summary.passed++;
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ ${description} failed after ${duration}ms:`, error.message);
    
    fullResults.stages[description] = {
      success: false,
      duration,
      error: error.message
    };
    
    fullResults.summary.failed++;
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Full Test Suite...\n');
  console.log('This will run comprehensive tests to diagnose production build issues.\n');
  
  const overallStart = Date.now();
  
  // 1. Build Verification
  const buildSuccess = runCommand(
    'node test/scripts/build-verification.js',
    'Build Verification'
  );
  fullResults.summary.totalTests++;
  
  // 2. Component Tests
  const componentSuccess = runCommand(
    'npm run test:component-rendering',
    'Component Tests'
  );
  fullResults.summary.totalTests++;
  
  // 3. Dev vs Preview Comparison (only if build succeeded)
  if (buildSuccess) {
    const comparisonSuccess = runCommand(
      'node test/scripts/dev-vs-preview-comparison.js',
      'Dev vs Preview Comparison'
    );
    fullResults.summary.totalTests++;
  } else {
    console.log('⏭️ Skipping Dev vs Preview Comparison due to build failure');
  }
  
  // 4. E2E Tests (only if build succeeded)
  if (buildSuccess) {
    const e2eSuccess = runCommand(
      'npm run test:e2e',
      'End-to-End Tests'
    );
    fullResults.summary.totalTests++;
  } else {
    console.log('⏭️ Skipping E2E Tests due to build failure');
  }
  
  const overallDuration = Date.now() - overallStart;
  fullResults.summary.duration = overallDuration;
  
  // Generate summary report
  console.log('\n' + '='.repeat(60));
  console.log('📊 FULL TEST SUITE SUMMARY');
  console.log('='.repeat(60));
  console.log(`⏱️  Total Duration: ${(overallDuration / 1000).toFixed(2)}s`);
  console.log(`📈 Total Tests: ${fullResults.summary.totalTests}`);
  console.log(`✅ Passed: ${fullResults.summary.passed}`);
  console.log(`❌ Failed: ${fullResults.summary.failed}`);
  console.log(`📈 Success Rate: ${((fullResults.summary.passed / fullResults.summary.totalTests) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Stage Results:');
  Object.entries(fullResults.stages).forEach(([stage, result]) => {
    const status = result.success ? '✅' : '❌';
    const duration = (result.duration / 1000).toFixed(2);
    console.log(`  ${status} ${stage}: ${duration}s`);
    if (!result.success && result.error) {
      console.log(`      Error: ${result.error}`);
    }
  });
  
  // Identify likely issues
  console.log('\n🔍 Issue Analysis:');
  const buildFailed = !fullResults.stages['Build Verification']?.success;
  const componentsFailed = !fullResults.stages['Component Tests']?.success;
  const comparisonFailed = !fullResults.stages['Dev vs Preview Comparison']?.success;
  const e2eFailed = !fullResults.stages['End-to-End Tests']?.success;
  
  if (buildFailed) {
    console.log('  🚨 Build process has issues - check Vite configuration, imports, or asset paths');
  }
  
  if (componentsFailed && !buildFailed) {
    console.log('  🚨 Component rendering issues - check React components, props, or mocked dependencies');
  }
  
  if (comparisonFailed && !buildFailed) {
    console.log('  🚨 Preview mode differs from dev - likely production build issue');
  }
  
  if (e2eFailed && !buildFailed) {
    console.log('  🚨 End-to-end issues - check browser rendering, asset loading, or user interactions');
  }
  
  if (fullResults.summary.failed === 0) {
    console.log('  🎉 No issues detected! Your app should work correctly in production.');
  }
  
  // Save full results
  const resultsPath = path.join(testResultsDir, 'full-test-suite-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(fullResults, null, 2));
  
  console.log('\n📁 Test Results Location:');
  console.log(`  📂 ${testResultsDir}`);
  console.log(`  📄 Full results: ${resultsPath}`);
  
  // List all result files
  if (fs.existsSync(testResultsDir)) {
    const resultFiles = fs.readdirSync(testResultsDir)
      .filter(f => f.endsWith('.json') || f.endsWith('.png'))
      .map(f => `    📄 ${f}`)
      .join('\n');
    if (resultFiles) {
      console.log('  📋 Individual results:');
      console.log(resultFiles);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  process.exit(fullResults.summary.failed > 0 ? 1 : 0);
}

main().catch(console.error);