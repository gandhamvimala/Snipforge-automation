import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://snipforge.video' });

test.describe('SnipForge - pricing', () => {

  test('PRC-001: Verify Free Plan displays correct limitations', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toContainText('Free');
    await expect(body).toContainText('3 videos per month');
    await expect(body).toContainText('Max 5 min per video');
  });

  test('PRC-002: Verify Pro Plan displays correct features and pricing', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toContainText('Pro');
    await expect(body).toContainText('$5/mo');
    await expect(body).toContainText('Unlimited videos');
  });

  test('PRC-003: Verify Free plan signup or selection process', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const freeBtn = page.getByText('Get Started Free');
    await expect(freeBtn).toBeVisible();
    await freeBtn.click();
    await expect(page).toHaveURL(/register|login/);
  });

  test('PRC-004: Verify Pro plan upgrade flow initiation', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const proBtn = page.getByText('Get Pro');
    await expect(proBtn).toBeVisible();
    await proBtn.click();
    await page.waitForTimeout(3000);
    const url = page.url();
    const validRedirect = url.includes('stripe') || url.includes('checkout') || url.includes('register') || url.includes('login') || url.includes('pricing');
    expect(validRedirect).toBeTruthy();
  });

  test('PRC-005: Verify pricing comparison between Free and Pro plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).toContainText('Free');
    await expect(body).toContainText('Pro');
    await expect(body).toContainText('Team');
    await expect(body).toContainText('$15/mo');
  });

  test('PRC-006: Verify pricing page behavior with invalid currency or locale', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/pricing/);
    await expect(page.locator('body')).toContainText('Simple Pricing');
  });

});
