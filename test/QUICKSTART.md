# 🚀 Quick Start Guide

## Problem: Blank Page in Production Build

If your Vite React app works in development but shows a blank page in production (`npm run preview`), this test suite will help diagnose the issue.

## ⚡ Instant Setup & Run

```bash
# 1. Install test dependencies
node test/install-test-deps.js

# 2. Run comprehensive diagnosis
cd test && npm run test:full
```

## 🔍 What Gets Tested

### Build Verification
- ✅ Build process completes successfully
- ✅ Dist folder contains all required files
- ✅ index.html has proper structure
- ✅ Asset paths are correct
- ✅ Bundle sizes are reasonable

### Component Rendering
- ✅ All React components render without errors
- ✅ Asset imports work correctly
- ✅ Props and state handling functions
- ✅ No JavaScript runtime errors

### Production Build Testing
- ✅ No blank page in preview mode
- ✅ All assets load successfully
- ✅ User interactions work
- ✅ Responsive design functions
- ✅ No console errors

### Dev vs Preview Comparison
- ✅ Both modes render consistently
- ✅ Screenshots for visual comparison
- ✅ Performance comparison
- ✅ Asset loading comparison

## 🎯 Common Issues & Solutions

### Issue: Blank Page in Preview
**Likely Causes:**
- Asset path problems
- CSS not loading
- JavaScript bundle errors
- Router configuration issues

**Diagnosis:**
```bash
cd test && npm run test:build-verification
```

### Issue: Assets Not Loading
**Likely Causes:**
- Incorrect import paths
- Vite base URL misconfiguration
- Asset optimization issues

**Diagnosis:**
```bash
cd test && npm run test:e2e
```

### Issue: Component Rendering Problems
**Likely Causes:**
- Import path errors
- Missing dependencies
- TypeScript/JSX compilation issues

**Diagnosis:**
```bash
cd test && npm run test:component-rendering
```

## 📊 Reading Test Results

Results are saved in `test/test-results/`:

- `build-verification.json` - Build analysis
- `component-test-results.json` - Component tests
- `playwright-results.json` - E2E test results
- `dev-vs-preview-comparison.json` - Mode comparison
- `*.png` - Screenshots for debugging

## 🛠️ Manual Debugging

If tests fail, try these manual steps:

```bash
# 1. Check build output
npm run build
ls -la dist/

# 2. Test preview mode
npm run preview
# Open http://localhost:4173 in browser

# 3. Compare with dev mode
npm run dev
# Open http://localhost:8080 in browser

# 4. Check browser console for errors
```

## 🎁 Bonus Features

- **Visual Screenshots**: See exactly what renders
- **Performance Metrics**: Bundle size analysis
- **Cross-browser Testing**: Chromium, Firefox, Safari
- **Responsive Testing**: Mobile, tablet, desktop views
- **Console Error Tracking**: Catch runtime issues

## ⚡ Quick Commands

| Command | Purpose |
|---------|---------|
| `cd test && npm run test:full` | Run everything |
| `cd test && npm run test:build-verification` | Check build only |
| `cd test && npm run test:e2e:headed` | Watch browser tests |
| `cd test && npm run test:dev-vs-preview` | Compare modes |

## 🔧 Advanced Usage

### Custom Configuration
Edit these files to customize tests:
- `test/vitest.config.ts` - Component test config
- `test/playwright.config.ts` - E2E test config
- `test/scripts/build-verification.js` - Build checks

### Adding New Tests
- Components: Add to `test/components/`
- E2E: Add to `test/e2e/`
- Diagnostics: Add to `test/diagnostic/`

### CI Integration
```bash
# In your CI pipeline
npm ci
node test/install-test-deps.js
cd test && npm run test:full
```

## 🆘 Need Help?

1. **Check test results** in `test/test-results/`
2. **Look at screenshots** to see what's rendering
3. **Review console errors** in test output
4. **Compare dev vs preview** screenshots
5. **Run tests with `--headed`** to watch browser behavior

The test suite will identify the most likely cause of your blank page issue and provide specific guidance for fixing it!