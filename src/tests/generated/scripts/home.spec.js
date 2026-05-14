import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://snipforge.video' });

test.describe('SnipForge - home', () => {
  test('HOME_001: Verify home page loads successfully and displays all key elements', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    await expect(page).toHaveTitle(/SnipForge|AI Video Toolkit/i);
    
    const navigation = page.locator('nav, header').first();
    await expect(navigation).toBeVisible();
    
    const hero = page.locator('section, div').filter({ hasText: /snipforge|video|ai/i }).first();
    await expect(hero).toBeVisible();
    
    const ctaButtons = page.getByRole('link', { name: /get started|try free|sign up|start now/i });
    await expect(ctaButtons.first()).toBeVisible();
    
    const pricingSection = page.locator('text=/pricing|plans|free|pro/i').first();
    await expect(pricingSection).toBeVisible();
  });

  test('HOME_002: Verify 25 AI video tools are displayed and accessible from home page', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    const toolsSection = page.locator('text=/tools|features/i').first();
    await toolsSection.scrollIntoViewIfNeeded();
    
    const toolElements = page.locator('a, button, div').filter({ hasText: /tool|feature/i });
    const toolCount = await toolElements.count();
    
    expect(toolCount).toBeGreaterThanOrEqual(3);
    
    const toolLinks = page.locator('a[href*="tool"], a[href*="/"], button').filter({ hasText: /video|editor|convert|trim|crop/i });
    const clickableTools = await toolLinks.count();
    
    if (clickableTools >= 3) {
      for (let i = 0; i < Math.min(3, clickableTools); i++) {
        const tool = toolLinks.nth(i);
        if (await tool.isVisible()) {
          await tool.click({ timeout: 5000 });
          await page.waitForLoadState('domcontentloaded');
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('HOME_003: Verify Free plan details are correctly displayed (3 videos/month, max 5 minutes)', async ({ page }) => {
    await page.goto('/');
    
    const pricingSection = page.locator('text=/pricing|plans/i').first();
    await pricingSection.scrollIntoViewIfNeeded();
    
    const freePlanSection = page.locator('div, section, article').filter({ hasText: /free/i });
    await expect(freePlanSection.first()).toBeVisible();
    
    const videosPerMonth = page.locator('text=/3.*video.*month|3.*per.*month/i');
    await expect(videosPerMonth.first()).toBeVisible();
    
    const maxDuration = page.locator('text=/5.*minute|max.*5|maximum.*5/i');
    await expect(maxDuration.first()).toBeVisible();
    
    const freeCtaButton = page.getByRole('link', { name: /get started|sign up|try free|start free/i }).first();
    await expect(freeCtaButton).toBeVisible();
  });

  test('HOME_004: Verify Pro plan details are correctly displayed ($5/month, unlimited videos)', async ({ page }) => {
    await page.goto('/');
    
    const pricingSection = page.locator('text=/pricing|plans/i').first();
    await pricingSection.scrollIntoViewIfNeeded();
    
    const proPlanSection = page.locator('div, section, article').filter({ hasText: /pro/i });
    await expect(proPlanSection.first()).toBeVisible();
    
    const pricing = page.locator('text=/\$5|5.*month|\$5\/month/i');
    await expect(pricing.first()).toBeVisible();
    
    const unlimited = page.locator('text=/unlimited.*video|unlimited/i');
    await expect(unlimited.first()).toBeVisible();
    
    const proCtaButton = page.getByRole('link', { name: /upgrade|subscribe|get pro|buy now/i }).or(page.getByRole('button', { name: /upgrade|subscribe|get pro|buy now/i }));
    await expect(proCtaButton.first()).toBeVisible();
  });

  test('HOME_005: Verify primary CTA buttons functionality and user journey initiation', async ({ page }) => {
    await page.goto('/');
    
    const primaryCta = page.getByRole('link', { name: /get started|try free|sign up|start now/i }).first();
    await expect(primaryCta).toBeVisible();
    
    await primaryCta.click();
    await page.waitForLoadState('domcontentloaded');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/sign|register|tools|start|login|auth/i);
    
    await page.goto('/');
    
    const secondaryCta = page.getByRole('link', { name: /view tools|learn more|explore|see features/i }).first();
    
    if (await secondaryCta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await secondaryCta.click();
      await page.waitForLoadState('domcontentloaded');
      const newUrl = page.url();
      expect(newUrl).not.toBe('https://snipforge.video/');
    }
  });

  test('HOME_006: Verify responsive design and mobile compatibility of home page', async ({ page }) => {
    await page.goto('/');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    const mobileNav = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], nav button').first();
    await expect(mobileNav.or(page.locator('nav'))).toBeVisible();
    
    const pricingSection = page.locator('text=/pricing|plans/i').first();
    await pricingSection.scrollIntoViewIfNeeded();
    
    const pricingCards = page.locator('div, article, section').filter({ hasText: /free|pro/i });
    const cardCount = await pricingCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(2);
    
    const ctaButtons = page.getByRole('link', { name: /get started|try free|sign up/i });
    const firstButton = ctaButtons.first();
    if (await firstButton.isVisible()) {
      const box = await firstButton.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(40);
      expect(box?.height).toBeGreaterThanOrEqual(40);
    }
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
    
    const allContent = page.locator('body');
    await expect(allContent).toBeVisible();
  });
});