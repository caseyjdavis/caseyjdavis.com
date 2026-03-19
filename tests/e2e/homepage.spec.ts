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
  const heroSection = page.locator('section').first();
  await expect(heroSection.locator('a[href="/contact"]').filter({ hasText: 'Book a Free' })).toBeVisible();
  await expect(page.locator('a[href="#featured-work"]').filter({ hasText: 'See My Work' })).toBeVisible();
});

test('hero has Denver badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('span').filter({ hasText: 'Denver, CO' }).first()).toBeVisible();
});

test('how it works shows 3 steps', async ({ page }) => {
  await page.goto('/');
  const steps = page.locator('[data-step]');
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(0)).toContainText('We Talk');
  await expect(steps.nth(1)).toContainText('I Assess');
  await expect(steps.nth(2)).toContainText('We Build');
});

test('case study shows Brighton Fire Rescue', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#featured-work');
  await expect(section).toBeVisible();
  await expect(section).toContainText('Brighton Fire Rescue');
  await expect(section).toContainText('140');
  await expect(section).toContainText('100%');
});

test('services section shows 3 services', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#services');
  await expect(section).toBeVisible();
  await expect(section).toContainText('Cloud Migration');
  await expect(section).toContainText('Managed Azure');
  await expect(section).toContainText('SMB IT Support');
});

test('bottom CTA links to contact page', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('section').filter({ hasText: 'Ready to simplify' });
  await expect(cta).toBeVisible();
  await expect(cta.locator('a[href="/contact"]')).toBeVisible();
});
