// tests/e2e/blog.spec.ts
import { test, expect } from '@playwright/test';

test('blog index page renders', async ({ page }) => {
  await page.goto('/blog');
  await expect(page).toHaveTitle(/Blog/);
  await expect(page.locator('main h1')).toContainText('Blog');
});

test('blog post page renders from slug', async ({ page }) => {
  await page.goto('/blog/example-post');
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('main h1')).toBeVisible();
});

test('blog index links to posts', async ({ page }) => {
  await page.goto('/blog');
  const firstPost = page.locator('a[href^="/blog/"]').first();
  await expect(firstPost).toBeVisible();
});
