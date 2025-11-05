# Comprehensive Test Suite

This test suite is designed to diagnose production build issues, specifically the blank page problem in Vite preview mode.

## Quick Start

1. **Install test dependencies:**
   ```bash
   npm run test:install
   ```

2. **Run all tests:**
   ```bash
   npm run test:full
   ```

## Test Structure

### 🔧 Build Verification
- **Purpose**: Verify build output and asset integrity
- **Command**: `npm run test:build-verification`
- **Checks**:
  - Build process completes successfully
  - Dist directory contains expected files
  - index.html has proper structure
  - Asset paths are correct
  - Bundle sizes are reasonable

### 🧪 Component Tests
- **Purpose**: Unit tests for React components
- **Command**: `npm run test:component-rendering`
- **Location**: `test/components/`
- **Checks**:
  - Components render without crashing
  - Props are handled correctly
  - Asset imports work
  - Event handlers function properly

### 🎭 End-to-End Tests
- **Purpose**: Full browser testing of production build
- **Command**: `npm run test:e2e`
- **Framework**: Playwright
- **Checks**:
  - No blank page in production
  - All components render correctly
  - Asset loading works
  - User interactions function
  - Responsive design
  - Console errors

### ⚖️ Dev vs Preview Comparison
- **Purpose**: Compare development and preview modes
- **Command**: `npm run test:dev-vs-preview`
- **Checks**:
  - Both modes accessible
  - Content renders consistently
  - No preview-specific issues
  - Screenshots for visual comparison

## Common Issues Detected

### 1. Asset Path Problems
- **Symptoms**: Images/assets don't load in preview
- **Detection**: Build verification checks asset paths
- **Solutions**: Check Vite base configuration, asset import paths

### 2. Import Path Issues
- **Symptoms**: Components don't render, console errors
- **Detection**: Component tests and E2E console monitoring
- **Solutions**: Verify @/ alias configuration, relative paths

### 3. Environment Variable Issues
- **Symptoms**: Different behavior between dev/preview
- **Detection**: Dev vs preview comparison
- **Solutions**: Check import.meta.env usage, build-time vs runtime

### 4. CSS/Styling Problems
- **Symptoms**: Blank page, invisible content
- **Detection**: E2E visual testing, screenshot comparison
- **Solutions**: Check Tailwind config, CSS imports

### 5. Bundle/Chunk Issues
- **Symptoms**: JavaScript errors, missing modules
- **Detection**: Build verification, network monitoring
- **Solutions**: Check Vite build configuration, dynamic imports

## Test Results

All test results are saved to `test/test-results/`:

- `build-verification.json` - Build analysis results
- `component-test-results.json` - Component test results
- `playwright-results.json` - E2E test results
- `dev-vs-preview-comparison.json` - Comparison results
- `*.png` - Screenshots for debugging

## Debugging Tips

### If Preview Shows Blank Page:

1. **Check build verification results:**
   ```bash
   npm run test:build-verification
   ```
   Look for asset path issues or missing files.

2. **Compare dev vs preview:**
   ```bash
   npm run test:dev-vs-preview
   ```
   This will create screenshots to visually compare.

3. **Run E2E tests with headed browser:**
   ```bash
   npm run test:e2e:headed
   ```
   Watch the browser to see what's happening.

4. **Check console errors:**
   E2E tests capture console errors. Look in the test results for error messages.

### Manual Debugging:

1. **Build and preview manually:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Open browser dev tools and check:**
   - Console for JavaScript errors
   - Network tab for failed asset loads
   - Elements tab to see if content is present but invisible

3. **Compare built files:**
   - Check `dist/index.html` structure
   - Verify asset file names and paths
   - Look for missing or malformed files

## Configuration

### Customizing Tests

- **Component tests**: Add new tests in `test/components/`
- **E2E tests**: Add new tests in `test/e2e/`
- **Build verification**: Modify `test/scripts/build-verification.js`

### Test Environments

- **Vitest**: For fast component testing
- **Playwright**: For comprehensive E2E testing
- **JSDOM**: For DOM simulation in component tests

### Asset Mocking

Test setup includes mocks for:
- Image assets (`.png`, `.jpg`, `.gif`)
- Audio files (`.mp3`)
- GSAP animations
- Canvas confetti
- Browser APIs (IntersectionObserver, ResizeObserver)

## Continuous Integration

To run in CI environments:

```bash
# Install dependencies
npm ci
npm run test:install

# Run all tests
npm run test:full
```

Set `CI=true` environment variable for optimized CI behavior.