import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://snipforge.video' });

test.describe('SnipForge - login', () => {

  test('LOGIN_001: Successful login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await page.locator('#email').fill(process.env.TEST_EMAIL || '');
    await page.locator('#password').fill(process.env.TEST_PASSWORD || '');
    await page.locator('.submit-btn').click();
    await page.waitForURL('https://snipforge.video/', { timeout: 15000 });
    await expect(page).toHaveTitle(/snipforge/i);
  });

  test('LOGIN_002: Login failure with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('wrong@email.com');
    await page.locator('#password').fill('wrongpassword123');
    await page.locator('.submit-btn').click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('LOGIN_003: Login with empty fields shows validation', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.submit-btn').click();
    await expect(page).toHaveURL(/login/);
  });

  test('LOGIN_004: Login page has all required elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('.submit-btn')).toBeVisible();
    await expect(page.locator('.submit-btn')).toHaveText(/sign in/i);
  });

  test('LOGIN_005: Login page loads with correct URL', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#email')).toBeVisible();
  });

  test('LOGIN_006: Redirect to login from protected page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login|register/);
  });

});
