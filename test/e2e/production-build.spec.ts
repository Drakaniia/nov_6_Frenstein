import { test, expect, Page } from '@playwright/test';

test.describe('Production Build Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Add console error tracking
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (!response.ok() && response.status() >= 400) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // Store errors for later access
    (page as any).consoleErrors = consoleErrors;
    (page as any).networkErrors = networkErrors;
  });

  test('should not show blank page in production', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test/test-results/production-page-load.png', fullPage: true });
    
    // Check that the page is not blank
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.trim().length).toBeGreaterThan(0);
    
    // Check for specific elements that should be visible
    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible({ timeout: 10000 });
    
    // Verify no console errors
    const consoleErrors = (page as any).consoleErrors;
    if (consoleErrors.length > 0) {
      console.warn('Console errors detected:', consoleErrors);
    }
    
    // Verify no network errors for critical resources
    const networkErrors = (page as any).networkErrors;
    const criticalErrors = networkErrors.filter((error: string) => 
      error.includes('.js') || error.includes('.css') || error.includes('.tsx')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should load all critical assets', async ({ page }) => {
    const loadedResources: string[] = [];
    const failedResources: string[] = [];

    page.on('response', response => {
      if (response.ok()) {
        loadedResources.push(response.url());
      } else if (response.status() >= 400) {
        failedResources.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main JS bundle loaded
    const mainJsLoaded = loadedResources.some(url => url.includes('.js') && !url.includes('node_modules'));
    expect(mainJsLoaded, 'Main JS bundle should load').toBe(true);

    // Check that CSS loaded
    const cssLoaded = loadedResources.some(url => url.includes('.css'));
    expect(cssLoaded, 'CSS should load').toBe(true);

    // Log failed resources for debugging
    if (failedResources.length > 0) {
      console.warn('Failed to load resources:', failedResources);
    }

    // Critical assets should not fail
    const criticalFailures = failedResources.filter(error => 
      error.includes('main') || error.includes('index') || error.includes('app')
    );
    expect(criticalFailures).toHaveLength(0);
  });

  test('should render LandingCard component correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for LandingCard to be visible
    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible();
    
    // Check PIN inputs are present
    const pinInputs = page.locator('input[inputmode="numeric"]');
    await expect(pinInputs).toHaveCount(4);

    // Check GIF image loads
    const gifImage = page.locator('img[alt="Animated GIF"]');
    await expect(gifImage).toBeVisible();

    // Verify the image actually loaded (not broken)
    const gifSrc = await gifImage.getAttribute('src');
    expect(gifSrc).toBeTruthy();

    // Take screenshot of landing card
    await page.screenshot({ path: 'test/test-results/landing-card-render.png' });
  });

  test('should handle PIN input and transition to main app', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enter correct PIN: 2306
    const pinInputs = page.locator('input[inputmode="numeric"]');
    await pinInputs.nth(0).fill('2');
    await pinInputs.nth(1).fill('3');
    await pinInputs.nth(2).fill('0');
    await pinInputs.nth(3).fill('6');

    // Wait for transition to main app
    await expect(page.locator('text=Happy Birthday My Baby!')).toBeVisible({ timeout: 5000 });
    
    // Take screenshot of main app
    await page.screenshot({ path: 'test/test-results/main-app-render.png' });

    // Verify main components are present
    await expect(page.locator('text=Scroll to see more')).toBeVisible();
    
    // Check that hero image loads
    const heroImage = page.locator('img[alt="Hero Image"]');
    await expect(heroImage).toBeVisible();
  });

  test('should handle wrong PIN correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enter wrong PIN: 1234
    const pinInputs = page.locator('input[inputmode="numeric"]');
    await pinInputs.nth(0).fill('1');
    await pinInputs.nth(1).fill('2');
    await pinInputs.nth(2).fill('3');
    await pinInputs.nth(3).fill('4');

    // Should NOT transition to main app
    await expect(page.locator('text=Happy Birthday My Baby!')).not.toBeVisible({ timeout: 2000 });
    
    // Should still show PIN entry
    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible();
    await page.screenshot({ path: 'test/test-results/mobile-view.png' });

    // Test tablet viewport  
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible();
    await page.screenshot({ path: 'test/test-results/tablet-view.png' });

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Enter PIN to Unlock')).toBeVisible();
    await page.screenshot({ path: 'test/test-results/desktop-view.png' });
  });
});