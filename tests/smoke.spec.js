import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/'];

test.describe('Smoke', () => {
  for (const route of routes) {
    test(`page ${route} renders and is accessible`, async ({ page }) => {
      await page.goto(route);

      // Visual regression smoke
      await expect(page).toHaveScreenshot(
        `page-${route === '/' ? 'home' : route.replace(/\//g, '-')}.png`
      );

      // Accessibility check with axe
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
