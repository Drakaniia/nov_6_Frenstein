#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Installing test dependencies...\n');

const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Test dependencies to add
const testDependencies = {
  "vitest": "^1.0.0",
  "@vitest/ui": "^1.0.0",
  "jsdom": "^23.0.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "playwright": "^1.40.0",
  "@playwright/test": "^1.40.0",
  "puppeteer": "^21.0.0"
};

// Test scripts to add
const testScripts = {
  "test": "cd test && npm run test",
  "test:ui": "cd test && npm run test:ui",
  "test:coverage": "cd test && npm run test:coverage",
  "test:e2e": "cd test && npm run test:e2e",
  "test:e2e:headed": "cd test && npm run test:e2e:headed",
  "test:full": "cd test && npm run test:full",
  "test:build-verification": "cd test && npm run test:build-verification",
  "test:component-rendering": "cd test && npm run test:component-rendering",
  "test:dev-vs-preview": "cd test && npm run test:dev-vs-preview",
  "test:install": "node test/install-test-deps.js"
};

// Add dependencies
if (!packageJson.devDependencies) {
  packageJson.devDependencies = {};
}

Object.assign(packageJson.devDependencies, testDependencies);
Object.assign(packageJson.scripts, testScripts);

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Updated package.json with test dependencies and scripts');

// Install dependencies
try {
  console.log('\n📥 Installing dependencies...');
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Install Playwright browsers
try {
  console.log('\n🎭 Installing Playwright browsers...');
  execSync('npx playwright install', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Playwright browsers installed successfully');
} catch (error) {
  console.error('❌ Failed to install Playwright browsers:', error.message);
  console.log('⚠️ You can install them later with: npx playwright install');
}

console.log('\n🎉 Test setup complete!');
console.log('\nAvailable test commands:');
console.log('  npm run test:full              - Run all tests');
console.log('  npm run test:build-verification - Check build output');
console.log('  npm run test:dev-vs-preview     - Compare dev vs preview');
console.log('  npm run test:e2e                - Run E2E tests');
console.log('  npm run test                    - Run component tests');
console.log('  npm run test:ui                 - Run tests with UI');