import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://snipforge.video' });

test.describe('SnipForge - register', () => {

  test('REG_001: Register page has all required fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('.submit-btn')).toBeVisible();
    await expect(page.locator('.submit-btn')).toHaveText(/create account/i);
  });

  test('REG_002: Register with empty fields stays on page', async ({ page }) => {
    await page.goto('/register');
    await page.locator('.submit-btn').click();
    await expect(page).toHaveURL(/register/);
  });

  test('REG_003: Register with invalid email format', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('notanemail');
    await page.locator('#password').fill('password123');
    await page.locator('.submit-btn').click();
    await expect(page).toHaveURL(/register/);
  });

  test('REG_004: Register with short password', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('short');
    await page.locator('.submit-btn').click();
    await expect(page).toHaveURL(/register/);
  });

  test('REG_005: Register page loads correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/register/);
    await expect(page.locator('#email')).toBeVisible();
  });

  test('REG_006: Register page has link to login', async ({ page }) => {
    await page.goto('/register');
    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

});
