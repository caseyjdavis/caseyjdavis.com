// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('page has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Casey Davis/);
});

test('page has viewport meta tag', async ({ page }) => {
  await page.goto('/');
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute('content', /width=device-width/);
});
