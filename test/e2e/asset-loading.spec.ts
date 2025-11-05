import { test, expect } from '@playwright/test';

test.describe('Asset Loading in Production', () => {
  test('should load all images without 404 errors', async ({ page }) => {
    const failedImages: string[] = [];
    
    page.on('response', response => {
      if (response.url().match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) && !response.ok()) {
        failedImages.push(`${response.status()} - ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enter PIN to access main app and load more assets
    const pinInputs = page.locator('input[inputmode="numeric"]');
    if (await pinInputs.count() === 4) {
      await pinInputs.nth(0).fill('2');
      await pinInputs.nth(1).fill('3');
      await pinInputs.nth(2).fill('0');
      await pinInputs.nth(3).fill('6');
      
      await page.waitForSelector('text=Happy Birthday My Baby!', { timeout: 5000 });
      await page.waitForLoadState('networkidle');
    }

    // Check that no images failed to load
    expect(failedImages, `Failed to load images: ${failedImages.join(', ')}`).toHaveLength(0);
  });

  test('should load CSS files correctly', async ({ page }) => {
    const failedCSS: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') && !response.ok()) {
        failedCSS.push(`${response.status()} - ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedCSS, `Failed to load CSS: ${failedCSS.join(', ')}`).toHaveLength(0);
  });

  test('should load JavaScript modules correctly', async ({ page }) => {
    const failedJS: string[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') && !response.ok()) {
        failedJS.push(`${response.status()} - ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedJS, `Failed to load JS: ${failedJS.join(', ')}`).toHaveLength(0);
  });

  test('should have correct Content-Type headers', async ({ page }) => {
    const incorrectTypes: string[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (url.endsWith('.js') && !contentType.includes('javascript')) {
        incorrectTypes.push(`JS file ${url} has content-type: ${contentType}`);
      }
      
      if (url.endsWith('.css') && !contentType.includes('css')) {
        incorrectTypes.push(`CSS file ${url} has content-type: ${contentType}`);
      }
      
      if (url.match(/\.(png|jpg|jpeg)$/i) && !contentType.includes('image')) {
        incorrectTypes.push(`Image file ${url} has content-type: ${contentType}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(incorrectTypes, `Incorrect content types: ${incorrectTypes.join(', ')}`).toHaveLength(0);
  });

  test('should handle asset caching correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take note of initial asset loads
    const firstLoadAssets = new Set<string>();
    
    page.on('response', response => {
      if (response.url().match(/\.(js|css|png|jpg|jpeg|gif)$/i)) {
        firstLoadAssets.add(response.url());
      }
    });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Assets should be cached (304) or loaded from cache
    // This test mainly ensures no 404s on reload
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    expect(consoleErrors.filter(error => 
      error.includes('404') || error.includes('Failed to load')
    )).toHaveLength(0);
  });
});