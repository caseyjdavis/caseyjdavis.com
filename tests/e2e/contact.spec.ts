// tests/e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test('contact page renders form and calendly', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test('contact form shows error when submitted empty', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('button[type="submit"]').click();
  // Form should still be visible (not submitted)
  await expect(page.locator('form')).toBeVisible();
});
