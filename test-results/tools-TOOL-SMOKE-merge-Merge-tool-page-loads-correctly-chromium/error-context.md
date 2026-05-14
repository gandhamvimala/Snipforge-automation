# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tools.spec.js >> TOOL-SMOKE-merge: Merge tool page loads correctly
- Location: src/tests/generated/scripts/tools.spec.js:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[class*="drop"],[class*="upload"],[class*="zone"]').first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[class*="drop"],[class*="upload"],[class*="zone"]').first()
    23 × locator resolved to <div id="sz-dropzone" class="upload-zone">…</div>
       - unexpected value "hidden"

```

```yaml
- banner:
  - link "snip forge":
    - /url: /
    - img
    - text: snip forge
  - link "Dashboard":
    - /url: /dashboard
  - link "Pricing":
    - /url: /pricing
  - link "Account":
    - /url: /account
  - link "Logout":
    - /url: /logout
  - text: Siddharth Pro
- navigation:
  - text: Record
  - img
  - text: Screen Record NEW Edit
  - img
  - text: AI Shorten AI
  - img
  - text: Trim
  - img
  - text: Multi-Trim
  - img
  - text: Speed Transform
  - img
  - text: Rotate / Flip
  - img
  - text: Resize for Social
  - img
  - text: Watermark Files
  - img
  - text: Merge
  - img
  - text: Convert
  - img
  - text: Compress Audio
  - img
  - text: Volume
  - img
  - text: Noise Removal NEW
  - img
  - text: Extract Audio
  - img
  - text: Mute Create
  - img
  - text: Video to GIF
  - img
  - text: Background Music
  - img
  - text: Text Overlay
  - img
  - text: Blur Region AI
  - img
  - text: Transcribe AI
  - img
  - text: Smart Clip AI
  - img
  - text: Chapters & Meta AI
  - img
  - text: Auto Captions AI Edit
  - img
  - text: Split Video
  - img
  - text: Brightness
  - img
  - text: Thumbnail Share
  - img
  - text: Shared Links
- main:
  - text: Choose a Tool
  - button "✕"
  - text: 🤖 AI ✂️ AI Shorten Remove silences & filler words automatically AI 📝 AI Transcribe Convert speech to text in any language AI 🎯 AI Smart Clip Find the best highlight automatically AI 📋 Chapters & Metadata Generate YouTube chapters & titles AI 🎬 Auto Captions Burn subtitles into your video with Whisper AI NEW ✏️ Edit 🔪 Trim Cut start and end of your video 🎯 Multi-Trim Keep multiple sections and stitch them ⚡ Speed Control Speed up or slow down your video ✂️ Split Video Split into segments on a timeline 🎨 Brightness & Contrast Adjust brightness, contrast, saturation 🔀 Transform 🔄 Rotate / Flip Fix orientation or mirror your video 📐 Resize for Social Fit to YouTube, TikTok, Instagram 🏷️ Watermark Add text watermark to your video 🎬 Create 🎞️ Video to GIF Convert your video into an animated GIF 🎵 Background Music Mix an audio track into your video ✏️ Text Overlay Add text at any position in your video 🫥 Blur Region Blur faces or sensitive areas 🖼 Thumbnail Extractor Extract best frames as high-quality JPGs 📁 Files 🔗 Merge Videos Combine multiple videos into one 🔄 Convert Convert to MP4, MOV, WebM, GIF, MP3 📦 Compress Reduce file size while keeping quality 🔊 Audio 🔊 Volume Control Boost or reduce audio volume 🔕 Noise Removal Remove background noise from audio 🎵 Extract Audio Pull the audio track as MP3 🔇 Mute Audio Remove the audio track completely ⏺ Record & Share ⏺️ Screen Recorder Record screen, webcam, or both NEW 🔗 Shared Links Manage your shared video links 🔗 Merge Videos Combine multiple videos into one seamless file
  - heading "Videos to Merge" [level=4]
  - button "Choose File"
  - text: + Add Video
  - button "Add at least 2 videos" [disabled]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.use({ baseURL: 'https://snipforge.video' });
  4   | 
  5   | // Login before all tests
  6   | test.beforeEach(async ({ page }) => {
  7   |   await page.goto('/login');
  8   |   await page.locator('#email').fill(process.env.TEST_EMAIL || '');
  9   |   await page.locator('#password').fill(process.env.TEST_PASSWORD || '');
  10  |   await page.locator('.submit-btn').click();
  11  |   await page.waitForURL('https://snipforge.video/', { timeout: 15000 });
  12  | });
  13  | 
  14  | const tools = [
  15  |   { id: 'trim',          name: 'Trim',              category: 'edit' },
  16  |   { id: 'multi-trim',    name: 'Multi-Trim',         category: 'edit' },
  17  |   { id: 'speed',         name: 'Speed',              category: 'edit' },
  18  |   { id: 'split',         name: 'Split',              category: 'edit' },
  19  |   { id: 'rotate-flip',   name: 'Rotate',             category: 'transform' },
  20  |   { id: 'resize',        name: 'Resize',             category: 'transform' },
  21  |   { id: 'watermark',     name: 'Watermark',          category: 'transform' },
  22  |   { id: 'merge',         name: 'Merge',              category: 'files' },
  23  |   { id: 'convert',       name: 'Convert',            category: 'files' },
  24  |   { id: 'compress',      name: 'Compress',           category: 'files' },
  25  |   { id: 'volume',        name: 'Volume',             category: 'audio' },
  26  |   { id: 'noise-removal', name: 'Noise Removal',      category: 'audio' },
  27  |   { id: 'extract-audio', name: 'Extract Audio',      category: 'audio' },
  28  |   { id: 'mute',          name: 'Mute',               category: 'audio' },
  29  |   { id: 'video-to-gif',  name: 'Video to GIF',       category: 'convert' },
  30  |   { id: 'bg-music',      name: 'Background Music',   category: 'audio' },
  31  |   { id: 'text-overlay',  name: 'Text Overlay',       category: 'edit' },
  32  |   { id: 'blur-region',   name: 'Blur Region',        category: 'edit' },
  33  |   { id: 'brightness',    name: 'Brightness',         category: 'edit' },
  34  |   { id: 'thumbnail',     name: 'Thumbnail',          category: 'files' },
  35  |   { id: 'ai-shorten',    name: 'AI Shorten',         category: 'ai' },
  36  |   { id: 'ai-transcribe', name: 'AI Transcribe',      category: 'ai' },
  37  |   { id: 'smart-clip',    name: 'Smart Clip',         category: 'ai' },
  38  |   { id: 'ai-chapters',   name: 'AI Chapters',        category: 'ai' },
  39  |   { id: 'auto-captions', name: 'Auto Captions',      category: 'ai' },
  40  | ];
  41  | 
  42  | // ── SMOKE: All tools load correctly ─────────────────────────────────────────
  43  | for (const tool of tools) {
  44  |   test(`TOOL-SMOKE-${tool.id}: ${tool.name} tool page loads correctly`, async ({ page }) => {
  45  |     await page.goto(`/?tool=${tool.id}`);
  46  |     await page.waitForLoadState('networkidle');
  47  |     await page.waitForTimeout(1000);
  48  | 
  49  |     // URL should contain tool param
  50  |     await expect(page).toHaveURL(new RegExp(`tool=${tool.id}`));
  51  | 
  52  |     // Upload zone should be visible
  53  |     const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
> 54  |     await expect(uploadZone).toBeVisible({ timeout: 10000 });
      |                              ^ Error: expect(locator).toBeVisible() failed
  55  |   });
  56  | }
  57  | 
  58  | // ── BUG-001: Missing H1 on all tool pages ───────────────────────────────────
  59  | test('BUG-001: Tool pages should have H1 heading for accessibility', async ({ page }) => {
  60  |   await page.goto('/?tool=trim');
  61  |   await page.waitForLoadState('networkidle');
  62  |   await page.waitForTimeout(1000);
  63  |   const h1 = page.locator('h1');
  64  |   // This test documents the bug — h1 is missing
  65  |   const count = await h1.count();
  66  |   console.log(`H1 count on tool page: ${count}`);
  67  |   expect(count).toBeGreaterThan(0); // EXPECTED TO FAIL — BUG CONFIRMED
  68  | });
  69  | 
  70  | // ── BUG-002: Download links are href="#" (broken) ───────────────────────────
  71  | test('BUG-002: Download links should not use href="#"', async ({ page }) => {
  72  |   await page.goto('/dashboard');
  73  |   await page.waitForLoadState('networkidle');
  74  |   await page.waitForTimeout(2000);
  75  | 
  76  |   const brokenLinks = await page.$$eval('a[href="#"]', els =>
  77  |     els.map(e => e.innerText.trim()).filter(t => t.includes('Download'))
  78  |   );
  79  |   console.log(`Found ${brokenLinks.length} broken download links with href="#"`);
  80  |   console.log('Broken links:', brokenLinks);
  81  |   // Document the bug
  82  |   expect(brokenLinks.length).toBe(0); // EXPECTED TO FAIL — BUG CONFIRMED
  83  | });
  84  | 
  85  | // ── BUG-003: Process button disabled state ──────────────────────────────────
  86  | test('BUG-003: Process button should show clear disabled state before upload', async ({ page }) => {
  87  |   await page.goto('/?tool=speed');
  88  |   await page.waitForLoadState('networkidle');
  89  |   await page.waitForTimeout(1000);
  90  | 
  91  |   const processBtn = page.getByText('Upload a video first');
  92  |   await expect(processBtn).toBeVisible();
  93  |   const isDisabled = await processBtn.isDisabled();
  94  |   console.log(`Process button disabled: ${isDisabled}`);
  95  |   // Button exists but check if properly disabled
  96  |   expect(isDisabled).toBeTruthy();
  97  | });
  98  | 
  99  | // ── BUG-004: Tool URLs return 404 without login ─────────────────────────────
  100 | test('BUG-004: /tools/trim returns 404 instead of redirecting to login', async ({ page }) => {
  101 |   // Use fresh context without login
  102 |   await page.context().clearCookies();
  103 |   const response = await page.goto('https://snipforge.video/tools/trim');
  104 |   const status = response?.status();
  105 |   console.log(`/tools/trim status without login: ${status}`);
  106 |   // This should redirect to login (302/200) not return 404
  107 |   expect(status).not.toBe(404); // EXPECTED TO FAIL — BUG CONFIRMED
  108 | });
  109 | 
  110 | // ── BUG-005: Tool URL pattern inconsistency ──────────────────────────────────
  111 | test('BUG-005: Tool URLs use ?tool= param not /tools/ path as advertised', async ({ page }) => {
  112 |   // The site advertises /tools/trim but actual SPA uses ?tool=trim
  113 |   await page.goto('/?tool=trim');
  114 |   await page.waitForLoadState('networkidle');
  115 |   const url = page.url();
  116 |   console.log(`Real tool URL pattern: ${url}`);
  117 |   // Verify the correct pattern works
  118 |   await expect(page).toHaveURL(/tool=trim/);
  119 | });
  120 | 
  121 | // ── FUNCTIONAL: Upload zone is interactive ──────────────────────────────────
  122 | test('FUNC-001: Upload zone is clickable on all tool pages', async ({ page }) => {
  123 |   const toolsToCheck = ['trim', 'speed', 'convert', 'ai-shorten', 'compress'];
  124 |   for (const tool of toolsToCheck) {
  125 |     await page.goto(`/?tool=${tool}`);
  126 |     await page.waitForTimeout(1000);
  127 |     const zone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  128 |     await expect(zone).toBeVisible({ timeout: 8000 });
  129 |     console.log(`✅ ${tool}: upload zone visible`);
  130 |   }
  131 | });
  132 | 
  133 | // ── FUNCTIONAL: Dashboard navigation ────────────────────────────────────────
  134 | test('FUNC-002: Dashboard loads with tool navigation sidebar', async ({ page }) => {
  135 |   await page.goto('/dashboard');
  136 |   await page.waitForLoadState('networkidle');
  137 |   await expect(page).toHaveURL(/dashboard/);
  138 |   await expect(page).toHaveTitle(/snipforge/i);
  139 | });
  140 | 
  141 | // ── FUNCTIONAL: AI tools require Pro badge ──────────────────────────────────
  142 | test('FUNC-003: AI tools are accessible on Pro plan', async ({ page }) => {
  143 |   await page.goto('/?tool=ai-shorten');
  144 |   await page.waitForLoadState('networkidle');
  145 |   await page.waitForTimeout(1000);
  146 |   // Should load the tool, not show upgrade prompt
  147 |   const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  148 |   await expect(uploadZone).toBeVisible({ timeout: 10000 });
  149 | });
  150 | 
  151 | 
```