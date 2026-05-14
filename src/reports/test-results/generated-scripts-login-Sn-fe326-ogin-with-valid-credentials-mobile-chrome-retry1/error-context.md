# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generated/scripts/login.spec.js >> SnipForge - login >> LOGIN_001: Successful login with valid credentials
- Location: src/tests/generated/scripts/login.spec.js:7:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /dashboard|app|tools|home/
Received string:  "https://snipforge.video/"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    3 × unexpected value "https://snipforge.video/login"
    30 × unexpected value "https://snipforge.video/"

```

```yaml
- banner:
  - link "snip forge":
    - /url: /
    - img
    - text: snip forge
  - button:
    - img
  - button "Tools":
    - img
    - text: Tools
- main:
  - button "Tools":
    - img
    - text: Tools
  - text: AI Shorten Remove silences automatically Choose a Tool
  - button "✕"
  - text: 🤖 AI ✂️ AI Shorten Remove silences & filler words automatically AI 📝 AI Transcribe Convert speech to text in any language AI 🎯 AI Smart Clip Find the best highlight automatically AI 📋 Chapters & Metadata Generate YouTube chapters & titles AI 🎬 Auto Captions Burn subtitles into your video with Whisper AI NEW ✏️ Edit 🔪 Trim Cut start and end of your video 🎯 Multi-Trim Keep multiple sections and stitch them ⚡ Speed Control Speed up or slow down your video ✂️ Split Video Split into segments on a timeline 🎨 Brightness & Contrast Adjust brightness, contrast, saturation 🔀 Transform 🔄 Rotate / Flip Fix orientation or mirror your video 📐 Resize for Social Fit to YouTube, TikTok, Instagram 🏷️ Watermark Add text watermark to your video 🎬 Create 🎞️ Video to GIF Convert your video into an animated GIF 🎵 Background Music Mix an audio track into your video ✏️ Text Overlay Add text at any position in your video 🫥 Blur Region Blur faces or sensitive areas 🖼 Thumbnail Extractor Extract best frames as high-quality JPGs 📁 Files 🔗 Merge Videos Combine multiple videos into one 🔄 Convert Convert to MP4, MOV, WebM, GIF, MP3 📦 Compress Reduce file size while keeping quality 🔊 Audio 🔊 Volume Control Boost or reduce audio volume 🔕 Noise Removal Remove background noise from audio 🎵 Extract Audio Pull the audio track as MP3 🔇 Mute Audio Remove the audio track completely ⏺ Record & Share ⏺️ Screen Recorder Record screen, webcam, or both NEW 🔗 Shared Links Manage your shared video links
  - button "Choose File"
  - text: 🎬
  - heading "Drop your video here" [level=3]
  - paragraph: MP4 · MOV · WebM · AVI
  - text: Max 2GB · Drag & drop or click
  - heading "Speed" [level=4]
  - text: 1× Normal 1.25× Slight 1.5× Brisk 1.75× Fast 2× Double Custom Speed
  - slider: "1.25"
  - text: 1.25× Silence Threshold (dB)
  - slider: "-40"
  - text: "-40 dB Min Silence (ms)"
  - slider: "300"
  - text: 300 ms Padding (ms)
  - slider: "80"
  - text: 80 ms Remove silences & filler sounds Cuts uh / um / ah and dead air Speed up video Apply speed multiplier above
  - button "Upload a video first" [disabled]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.use({ baseURL: 'https://snipforge.video' });
  4  | 
  5  | test.describe('SnipForge - login', () => {
  6  | 
  7  |   test('LOGIN_001: Successful login with valid credentials', async ({ page }) => {
  8  |     await page.goto('/login');
  9  |     await expect(page.locator('#email')).toBeVisible();
  10 |     await page.locator('#email').fill(process.env.TEST_EMAIL || '');
  11 |     await page.locator('#password').fill(process.env.TEST_PASSWORD || '');
  12 |     await page.locator('.submit-btn').click();
> 13 |     await expect(page).toHaveURL(/dashboard|app|tools|home/, { timeout: 15000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  14 |   });
  15 | 
  16 |   test('LOGIN_002: Login failure with invalid credentials', async ({ page }) => {
  17 |     await page.goto('/login');
  18 |     await page.locator('#email').fill('wrong@email.com');
  19 |     await page.locator('#password').fill('wrongpassword123');
  20 |     await page.locator('.submit-btn').click();
  21 |     await expect(page).toHaveURL(/login/, { timeout: 10000 });
  22 |   });
  23 | 
  24 |   test('LOGIN_003: Login with empty fields shows validation', async ({ page }) => {
  25 |     await page.goto('/login');
  26 |     await page.locator('.submit-btn').click();
  27 |     await expect(page).toHaveURL(/login/);
  28 |   });
  29 | 
  30 |   test('LOGIN_004: Login page has all required elements', async ({ page }) => {
  31 |     await page.goto('/login');
  32 |     await expect(page.locator('#email')).toBeVisible();
  33 |     await expect(page.locator('#password')).toBeVisible();
  34 |     await expect(page.locator('.submit-btn')).toBeVisible();
  35 |     await expect(page.locator('.submit-btn')).toHaveText(/sign in/i);
  36 |   });
  37 | 
  38 |   test('LOGIN_005: Login page loads with correct URL', async ({ page }) => {
  39 |     await page.goto('/login');
  40 |     await expect(page).toHaveURL(/login/);
  41 |     await expect(page.locator('#email')).toBeVisible();
  42 |   });
  43 | 
  44 |   test('LOGIN_006: Redirect to login from protected page', async ({ page }) => {
  45 |     await page.goto('/dashboard');
  46 |     await expect(page).toHaveURL(/login|register/);
  47 |   });
  48 | 
  49 | });
  50 | 
```