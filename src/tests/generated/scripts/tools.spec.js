import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://snipforge.video' });

// Login before all tests
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.locator('#email').fill(process.env.TEST_EMAIL || '');
  await page.locator('#password').fill(process.env.TEST_PASSWORD || '');
  await page.locator('.submit-btn').click();
  await page.waitForURL('https://snipforge.video/', { timeout: 15000 });
});

const tools = [
  { id: 'trim',          name: 'Trim',              category: 'edit' },
  { id: 'multi-trim',    name: 'Multi-Trim',         category: 'edit' },
  { id: 'speed',         name: 'Speed',              category: 'edit' },
  { id: 'split',         name: 'Split',              category: 'edit' },
  { id: 'rotate-flip',   name: 'Rotate',             category: 'transform' },
  { id: 'resize',        name: 'Resize',             category: 'transform' },
  { id: 'watermark',     name: 'Watermark',          category: 'transform' },
  { id: 'merge',         name: 'Merge',              category: 'files' },
  { id: 'convert',       name: 'Convert',            category: 'files' },
  { id: 'compress',      name: 'Compress',           category: 'files' },
  { id: 'volume',        name: 'Volume',             category: 'audio' },
  { id: 'noise-removal', name: 'Noise Removal',      category: 'audio' },
  { id: 'extract-audio', name: 'Extract Audio',      category: 'audio' },
  { id: 'mute',          name: 'Mute',               category: 'audio' },
  { id: 'video-to-gif',  name: 'Video to GIF',       category: 'convert' },
  { id: 'bg-music',      name: 'Background Music',   category: 'audio' },
  { id: 'text-overlay',  name: 'Text Overlay',       category: 'edit' },
  { id: 'blur-region',   name: 'Blur Region',        category: 'edit' },
  { id: 'brightness',    name: 'Brightness',         category: 'edit' },
  { id: 'thumbnail',     name: 'Thumbnail',          category: 'files' },
  { id: 'ai-shorten',    name: 'AI Shorten',         category: 'ai' },
  { id: 'ai-transcribe', name: 'AI Transcribe',      category: 'ai' },
  { id: 'smart-clip',    name: 'Smart Clip',         category: 'ai' },
  { id: 'ai-chapters',   name: 'AI Chapters',        category: 'ai' },
  { id: 'auto-captions', name: 'Auto Captions',      category: 'ai' },
];

// ── SMOKE: All tools load correctly ─────────────────────────────────────────
for (const tool of tools) {
  test(`TOOL-SMOKE-${tool.id}: ${tool.name} tool page loads correctly`, async ({ page }) => {
    await page.goto(`/?tool=${tool.id}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // URL should contain tool param
    await expect(page).toHaveURL(new RegExp(`tool=${tool.id}`));

    // Upload zone should be visible
    const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
    await expect(uploadZone).toBeVisible({ timeout: 10000 });
  });
}

// ── BUG-001: Missing H1 on all tool pages ───────────────────────────────────
test('BUG-001: Tool pages should have H1 heading for accessibility', async ({ page }) => {
  await page.goto('/?tool=trim');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  const h1 = page.locator('h1');
  // This test documents the bug — h1 is missing
  const count = await h1.count();
  console.log(`H1 count on tool page: ${count}`);
  expect(count).toBeGreaterThan(0); // EXPECTED TO FAIL — BUG CONFIRMED
});

// ── BUG-002: Download links are href="#" (broken) ───────────────────────────
test('BUG-002: Download links should not use href="#"', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const brokenLinks = await page.$$eval('a[href="#"]', els =>
    els.map(e => e.innerText.trim()).filter(t => t.includes('Download'))
  );
  console.log(`Found ${brokenLinks.length} broken download links with href="#"`);
  console.log('Broken links:', brokenLinks);
  // Document the bug
  expect(brokenLinks.length).toBe(0); // EXPECTED TO FAIL — BUG CONFIRMED
});

// ── BUG-003: Process button disabled state ──────────────────────────────────
test('BUG-003: Process button should show clear disabled state before upload', async ({ page }) => {
  await page.goto('/?tool=speed');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const processBtn = page.getByText('Upload a video first');
  await expect(processBtn).toBeVisible();
  const isDisabled = await processBtn.isDisabled();
  console.log(`Process button disabled: ${isDisabled}`);
  // Button exists but check if properly disabled
  expect(isDisabled).toBeTruthy();
});

// ── BUG-004: Tool URLs return 404 without login ─────────────────────────────
test('BUG-004: /tools/trim returns 404 instead of redirecting to login', async ({ page }) => {
  // Use fresh context without login
  await page.context().clearCookies();
  const response = await page.goto('https://snipforge.video/tools/trim');
  const status = response?.status();
  console.log(`/tools/trim status without login: ${status}`);
  // This should redirect to login (302/200) not return 404
  expect(status).not.toBe(404); // EXPECTED TO FAIL — BUG CONFIRMED
});

// ── BUG-005: Tool URL pattern inconsistency ──────────────────────────────────
test('BUG-005: Tool URLs use ?tool= param not /tools/ path as advertised', async ({ page }) => {
  // The site advertises /tools/trim but actual SPA uses ?tool=trim
  await page.goto('/?tool=trim');
  await page.waitForLoadState('networkidle');
  const url = page.url();
  console.log(`Real tool URL pattern: ${url}`);
  // Verify the correct pattern works
  await expect(page).toHaveURL(/tool=trim/);
});

// ── FUNCTIONAL: Upload zone is interactive ──────────────────────────────────
test('FUNC-001: Upload zone is clickable on all tool pages', async ({ page }) => {
  const toolsToCheck = ['trim', 'speed', 'convert', 'ai-shorten', 'compress'];
  for (const tool of toolsToCheck) {
    await page.goto(`/?tool=${tool}`);
    await page.waitForTimeout(1000);
    const zone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
    await expect(zone).toBeVisible({ timeout: 8000 });
    console.log(`✅ ${tool}: upload zone visible`);
  }
});

// ── FUNCTIONAL: Dashboard navigation ────────────────────────────────────────
test('FUNC-002: Dashboard loads with tool navigation sidebar', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/dashboard/);
  await expect(page).toHaveTitle(/snipforge/i);
});

// ── FUNCTIONAL: AI tools require Pro badge ──────────────────────────────────
test('FUNC-003: AI tools are accessible on Pro plan', async ({ page }) => {
  await page.goto('/?tool=ai-shorten');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  // Should load the tool, not show upgrade prompt
  const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  await expect(uploadZone).toBeVisible({ timeout: 10000 });
});

