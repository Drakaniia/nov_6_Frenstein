#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const testResultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const results = {
  timestamp: new Date().toISOString(),
  dev: { accessible: false, rendered: false, errors: [], screenshot: null },
  preview: { accessible: false, rendered: false, errors: [], screenshot: null },
  comparison: { consistent: false, issues: [] }
};

async function testServer(url, label, resultKey) {
  console.log(`🔍 Testing ${label} at ${url}...`);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    results[resultKey].accessible = true;
    
    // Check if page rendered content
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasContent = bodyText && bodyText.trim().length > 0;
    
    if (hasContent) {
      results[resultKey].rendered = true;
      console.log(`✅ ${label} rendered successfully`);
    } else {
      console.log(`❌ ${label} shows blank page`);
      results.comparison.issues.push(`${label} shows blank page`);
    }
    
    // Check for specific components
    const landingCardText = await page.evaluate(() => {
      return document.body.innerText.includes('Enter PIN to Unlock');
    });
    
    if (!landingCardText) {
      results.comparison.issues.push(`${label} missing LandingCard component`);
    }
    
    // Take screenshot
    const screenshotPath = path.join(testResultsDir, `${resultKey}-screenshot.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results[resultKey].screenshot = screenshotPath;
    
    // Test PIN input flow
    try {
      const pinInputs = await page.$$('input[inputmode="numeric"]');
      if (pinInputs.length === 4) {
        // Enter correct PIN
        await pinInputs[0].type('2');
        await pinInputs[1].type('3');
        await pinInputs[2].type('0');
        await pinInputs[3].type('6');
        
        // Wait for transition
        await page.waitForFunction(
          () => document.body.innerText.includes('Happy Birthday My Baby!'),
          { timeout: 5000 }
        );
        
        // Take screenshot of main app
        const mainAppScreenshot = path.join(testResultsDir, `${resultKey}-main-app.png`);
        await page.screenshot({ path: mainAppScreenshot, fullPage: true });
        
        console.log(`✅ ${label} PIN flow works correctly`);
      } else {
        results.comparison.issues.push(`${label} PIN inputs not found or incorrect count`);
      }
    } catch (error) {
      results.comparison.issues.push(`${label} PIN flow failed: ${error.message}`);
    }
    
  } catch (error) {
    console.log(`❌ ${label} failed to load: ${error.message}`);
    results.comparison.issues.push(`${label} failed to load: ${error.message}`);
  }
  
  results[resultKey].errors = errors;
  if (errors.length > 0) {
    console.log(`⚠️ ${label} console errors:`, errors.slice(0, 5)); // Show first 5 errors
  }
  
  await browser.close();
}

function waitForServer(port, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      try {
        // Use a simpler command that works cross-platform
        const isWindows = process.platform === 'win32';
        const cmd = isWindows 
          ? `netstat -ano | findstr :${port}`
          : `lsof -i :${port}`;
        
        execSync(cmd, { stdio: 'ignore' });
        clearInterval(interval);
        resolve(true);
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error(`Server on port ${port} did not start within ${maxAttempts} attempts`));
        }
      }
    }, 1000);
  });
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    // Use cross-platform approach
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    
    const devServer = spawn(npmCmd, ['run', 'dev'], { 
      cwd: path.join(__dirname, '../..'),
      shell: true,
      stdio: 'pipe'
    });
    
    let output = '';
    
    devServer.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Local:')) {
        setTimeout(() => resolve(devServer), 2000);
      }
    });
    
    devServer.stderr.on('data', (data) => {
      console.error('Dev server error:', data.toString());
    });
    
    devServer.on('error', (error) => {
      reject(new Error(`Failed to start dev server: ${error.message}`));
    });
    
    setTimeout(() => {
      if (!output.includes('Local:')) {
        reject(new Error('Dev server failed to start within timeout'));
      }
    }, 30000);
  });
}

async function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    
    const previewServer = spawn(npmCmd, ['run', 'preview'], { 
      cwd: path.join(__dirname, '../..'),
      shell: true,
      stdio: 'pipe'
    });
    
    let output = '';
    
    previewServer.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Local:')) {
        setTimeout(() => resolve(previewServer), 2000);
      }
    });
    
    previewServer.stderr.on('data', (data) => {
      console.error('Preview server error:', data.toString());
    });
    
    previewServer.on('error', (error) => {
      reject(new Error(`Failed to start preview server: ${error.message}`));
    });
    
    setTimeout(() => {
      if (!output.includes('Local:')) {
        reject(new Error('Preview server failed to start within timeout'));
      }
    }, 30000);
  });
}

async function main() {
  console.log('🚀 Starting Dev vs Preview Comparison...\n');
  
  let devServer, previewServer;
  
  try {
    // Build first
    console.log('📦 Building project...');
    execSync('npm run build', { 
      cwd: path.join(__dirname, '../..'), 
      stdio: 'inherit',
      shell: true
    });
    
    // Start dev server
    console.log('🔧 Starting dev server...');
    devServer = await startDevServer();
    await waitForServer(8080);
    
    // Test dev server
    await testServer('http://localhost:8080', 'Dev Server', 'dev');
    
    // Stop dev server
    if (devServer) {
      devServer.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Start preview server
    console.log('🔧 Starting preview server...');
    previewServer = await startPreviewServer();
    await waitForServer(4173);
    
    // Test preview server
    await testServer('http://localhost:4173', 'Preview Server', 'preview');
    
    // Compare results
    results.comparison.consistent = 
      results.dev.rendered === results.preview.rendered &&
      results.dev.accessible === results.preview.accessible;
    
    if (!results.comparison.consistent) {
      console.log('\n❌ Inconsistency detected between dev and preview!');
    } else {
      console.log('\n✅ Dev and preview servers are consistent');
    }
    
  } catch (error) {
    console.error('❌ Comparison failed:', error.message);
    results.comparison.issues.push(`Comparison failed: ${error.message}`);
  } finally {
    // Cleanup
    if (devServer) {
      try {
        devServer.kill('SIGTERM');
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    if (previewServer) {
      try {
        previewServer.kill('SIGTERM');
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
  
  // Save results
  const resultsPath = path.join(testResultsDir, 'dev-vs-preview-comparison.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log('\n📝 Comparison Summary:');
  console.log(`  Dev Accessible: ${results.dev.accessible ? '✅' : '❌'}`);
  console.log(`  Dev Rendered: ${results.dev.rendered ? '✅' : '❌'}`);
  console.log(`  Preview Accessible: ${results.preview.accessible ? '✅' : '❌'}`);
  console.log(`  Preview Rendered: ${results.preview.rendered ? '✅' : '❌'}`);
  console.log(`  Consistent: ${results.comparison.consistent ? '✅' : '❌'}`);
  console.log(`  Issues: ${results.comparison.issues.length}`);
  
  if (results.comparison.issues.length > 0) {
    console.log('\n⚠️ Issues Found:');
    results.comparison.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  console.log(`\n📋 Full results saved to: ${resultsPath}`);
  
  process.exit(results.comparison.issues.length > 0 ? 1 : 0);
}

main().catch(console.error);