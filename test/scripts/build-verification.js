#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Build Verification...\n');

const rootDir = path.join(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const testResultsDir = path.join(__dirname, '../test-results');

// Ensure test results directory exists
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

const results = {
  timestamp: new Date().toISOString(),
  buildSuccess: false,
  distExists: false,
  indexHtml: { exists: false, hasRootDiv: false, hasScriptTag: false },
  assets: { js: [], css: [], images: [], other: [] },
  bundleAnalysis: { totalSize: 0, jsSize: 0, cssSize: 0 },
  issues: []
};

try {
  console.log('📦 Building project...');
  process.chdir(rootDir);
  execSync('npm run build', { stdio: 'inherit' });
  results.buildSuccess = true;
  console.log('✅ Build completed successfully\n');
} catch (error) {
  results.issues.push('Build failed: ' + error.message);
  console.error('❌ Build failed:', error.message);
}

// Check if dist directory exists
if (fs.existsSync(distDir)) {
  results.distExists = true;
  console.log('✅ Dist directory exists');
  
  // Analyze index.html
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    results.indexHtml.exists = true;
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    results.indexHtml.hasRootDiv = indexContent.includes('<div id="root">');
    results.indexHtml.hasScriptTag = indexContent.includes('<script');
    
    if (!results.indexHtml.hasRootDiv) {
      results.issues.push('index.html missing root div');
    }
    if (!results.indexHtml.hasScriptTag) {
      results.issues.push('index.html missing script tags');
    }
    
    console.log('✅ index.html exists and contains:', {
      rootDiv: results.indexHtml.hasRootDiv,
      scriptTag: results.indexHtml.hasScriptTag
    });
  } else {
    results.issues.push('index.html not found in dist');
  }
  
  // Analyze assets
  function analyzeDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(fullPath, relativePath);
      } else {
        const ext = path.extname(item).toLowerCase();
        const size = stat.size;
        results.bundleAnalysis.totalSize += size;
        
        const assetInfo = { path: relativePath, size };
        
        if (ext === '.js') {
          results.assets.js.push(assetInfo);
          results.bundleAnalysis.jsSize += size;
        } else if (ext === '.css') {
          results.assets.css.push(assetInfo);
          results.bundleAnalysis.cssSize += size;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
          results.assets.images.push(assetInfo);
        } else {
          results.assets.other.push(assetInfo);
        }
      }
    }
  }
  
  analyzeDirectory(distDir);
  
  console.log('📊 Bundle Analysis:');
  console.log(`  Total Size: ${(results.bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  JS Size: ${(results.bundleAnalysis.jsSize / 1024).toFixed(2)} KB`);
  console.log(`  CSS Size: ${(results.bundleAnalysis.cssSize / 1024).toFixed(2)} KB`);
  console.log(`  JS Files: ${results.assets.js.length}`);
  console.log(`  CSS Files: ${results.assets.css.length}`);
  console.log(`  Images: ${results.assets.images.length}`);
  
  // Check for critical issues
  if (results.assets.js.length === 0) {
    results.issues.push('No JavaScript files found in build');
  }
  
  if (results.assets.css.length === 0) {
    results.issues.push('No CSS files found in build');
  }
  
  // Check for asset path issues
  const potentialPathIssues = results.assets.js.concat(results.assets.css)
    .filter(asset => asset.path.includes('..') || asset.path.startsWith('/'));
  
  if (potentialPathIssues.length > 0) {
    results.issues.push('Potential asset path issues detected');
  }
  
} else {
  results.issues.push('Dist directory not found');
  console.error('❌ Dist directory not found');
}

// Save results
const resultsPath = path.join(testResultsDir, 'build-verification.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

console.log('\n📝 Results Summary:');
console.log(`  Build Success: ${results.buildSuccess ? '✅' : '❌'}`);
console.log(`  Dist Exists: ${results.distExists ? '✅' : '❌'}`);
console.log(`  Issues Found: ${results.issues.length}`);

if (results.issues.length > 0) {
  console.log('\n⚠️ Issues:');
  results.issues.forEach(issue => console.log(`  - ${issue}`));
}

console.log(`\n📋 Full results saved to: ${resultsPath}`);

process.exit(results.issues.length > 0 ? 1 : 0);