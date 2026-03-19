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

test('nav has logo and book a call CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('nav a[href="/contact"]').filter({ hasText: 'Book a Call' })).toBeVisible();
});

test('nav links point to correct anchors', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav a[href="#services"]')).toBeVisible();
  await expect(page.locator('nav a[href="#featured-work"]')).toBeVisible();
  await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
});

test('mobile nav drawer opens on hamburger click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const drawer = page.locator('[data-mobile-menu]');
  await expect(drawer).toBeHidden();
  await page.locator('[data-hamburger]').click();
  await expect(drawer).toBeVisible();
});

test('hero has headline and dual CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Stop Managing');
  await expect(page.locator('a[href="/contact"]').filter({ hasText: 'Book a Free' })).toBeVisible();
  await expect(page.locator('a[href="#featured-work"]').filter({ hasText: 'See My Work' })).toBeVisible();
});

test('hero has Denver badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Denver, CO')).toBeVisible();
});
