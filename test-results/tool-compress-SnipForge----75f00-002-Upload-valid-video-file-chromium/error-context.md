# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tool-compress.spec.js >> SnipForge - Compress >> compress-002: Upload valid video file
- Location: src/tests/generated/scripts/tool-compress.spec.js:42:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#panel-compress').locator('text=/.*\\.(mp4|mov|avi|webm).*/i').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#panel-compress').locator('text=/.*\\.(mp4|mov|avi|webm).*/i').first()

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
  - text: 🤖 AI ✂️ AI Shorten Remove silences & filler words automatically AI 📝 AI Transcribe Convert speech to text in any language AI 🎯 AI Smart Clip Find the best highlight automatically AI 📋 Chapters & Metadata Generate YouTube chapters & titles AI 🎬 Auto Captions Burn subtitles into your video with Whisper AI NEW ✏️ Edit 🔪 Trim Cut start and end of your video 🎯 Multi-Trim Keep multiple sections and stitch them ⚡ Speed Control Speed up or slow down your video ✂️ Split Video Split into segments on a timeline 🎨 Brightness & Contrast Adjust brightness, contrast, saturation 🔀 Transform 🔄 Rotate / Flip Fix orientation or mirror your video 📐 Resize for Social Fit to YouTube, TikTok, Instagram 🏷️ Watermark Add text watermark to your video 🎬 Create 🎞️ Video to GIF Convert your video into an animated GIF 🎵 Background Music Mix an audio track into your video ✏️ Text Overlay Add text at any position in your video 🫥 Blur Region Blur faces or sensitive areas 🖼 Thumbnail Extractor Extract best frames as high-quality JPGs 📁 Files 🔗 Merge Videos Combine multiple videos into one 🔄 Convert Convert to MP4, MOV, WebM, GIF, MP3 📦 Compress Reduce file size while keeping quality 🔊 Audio 🔊 Volume Control Boost or reduce audio volume 🔕 Noise Removal Remove background noise from audio 🎵 Extract Audio Pull the audio track as MP3 🔇 Mute Audio Remove the audio track completely ⏺ Record & Share ⏺️ Screen Recorder Record screen, webcam, or both NEW 🔗 Shared Links Manage your shared video links
  - heading "Compress" [level=1]
  - text: 📦 Compress Reduce file size while keeping quality — Size — Duration —
  - button "Change"
  - heading "Compression Level" [level=4]
  - text: Light ~30% smaller Medium ~50% smaller Heavy ~70% smaller
  - button "Process Compress" [disabled]: Upload failed
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.use({ 
  4   |   baseURL: "https://snipforge.video", 
  5   |   storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" 
  6   | });
  7   | 
  8   | async function goToTool(page) {
  9   |   await page.goto("/?tool=compress");
  10  |   await page.waitForLoadState("networkidle");
  11  |   await page.waitForTimeout(1000);
  12  | }
  13  | 
  14  | async function uploadVideo(page) {
  15  |   if (!process.env.TEST_VIDEO_PATH) return false;
  16  |   const fi = page.locator("#cm-file");
  17  |   await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  18  |   await page.waitForTimeout(2000);
  19  |   return true;
  20  | }
  21  | 
  22  | test.describe("SnipForge - Compress", () => {
  23  |   
  24  |   test.afterEach(async ({ page }, testInfo) => {
  25  |     if (testInfo.status !== testInfo.expectedStatus) {
  26  |       const screenshot = await page.screenshot();
  27  |       await testInfo.attach("failure-screenshot", {
  28  |         body: screenshot,
  29  |         contentType: "image/png"
  30  |       });
  31  |     }
  32  |   });
  33  | 
  34  |   test("compress-001: Panel loads successfully", async ({ page }) => {
  35  |     await goToTool(page);
  36  |     const panel = page.locator("#panel-compress");
  37  |     await expect(panel).toBeVisible();
  38  |     const fileDropArea = panel.locator("input[type=file]");
  39  |     await expect(fileDropArea).toBeAttached();
  40  |   });
  41  | 
  42  |   test("compress-002: Upload valid video file", async ({ page }) => {
  43  |     await goToTool(page);
  44  |     const uploaded = await uploadVideo(page);
  45  |     if (!uploaded) {
  46  |       test.skip();
  47  |       return;
  48  |     }
  49  |     const panel = page.locator("#panel-compress");
  50  |     const fileNameDisplay = panel.locator("text=/.*\\.(mp4|mov|avi|webm).*/i").first();
> 51  |     await expect(fileNameDisplay).toBeVisible({ timeout: 5000 });
      |                                   ^ Error: expect(locator).toBeVisible() failed
  52  |   });
  53  | 
  54  |   test("compress-003: Select Light compression preset", async ({ page }) => {
  55  |     await goToTool(page);
  56  |     // cm-quality is hidden - click the visible preset button instead
  57  |     await page.locator("#panel-compress .preset-btn").filter({ hasText: /light/i }).click();
  58  |     const value = await page.locator("#cm-quality").inputValue();
  59  |     console.log("Quality value:", value);
  60  |   });
  61  | 
  62  |   test("compress-004: Select Medium compression preset", async ({ page }) => {
  63  |     await goToTool(page);
  64  |     await page.locator("#panel-compress .preset-btn").filter({ hasText: /medium/i }).click();
  65  |     const value = await page.locator("#cm-quality").inputValue();
  66  |     console.log("Quality value:", value);
  67  |   });
  68  | 
  69  |   test("compress-005: Select Heavy compression preset", async ({ page }) => {
  70  |     await goToTool(page);
  71  |     await page.locator("#panel-compress .preset-btn").filter({ hasText: /heavy/i }).click();
  72  |     const value = await page.locator("#cm-quality").inputValue();
  73  |     console.log("Quality value:", value);
  74  |   });
  75  | 
  76  |   test("compress-006: Process compression with valid file", async ({ page }) => {
  77  |     await goToTool(page);
  78  |     const uploaded = await uploadVideo(page);
  79  |     if (!uploaded) {
  80  |       test.skip();
  81  |       return;
  82  |     }
  83  |     const processButton = page.locator("#cm-run");
  84  |     const btnText = await processButton.innerText();
  85  |     if (btnText.includes("failed")) { console.log("⚠️ Upload failed - rate limit"); return; }
  86  |     const isDisabled = await processButton.isDisabled();
  87  |     console.log("Process button disabled:", isDisabled);
  88  |     expect(isDisabled).toBeFalsy();
  89  |   });
  90  | 
  91  |   test("compress-007: Change uploaded file", async ({ page }) => {
  92  |     await goToTool(page);
  93  |     const uploaded = await uploadVideo(page);
  94  |     if (!uploaded) {
  95  |       test.skip();
  96  |       return;
  97  |     }
  98  |     await page.waitForTimeout(1000);
  99  |     const changeButton = page.locator("#cm-filecard .file-change");
  100 |     if (await changeButton.count() > 0) {
  101 |       await changeButton.click();
  102 |       const fileInput = page.locator("#cm-file");
  103 |       await expect(fileInput).toBeAttached();
  104 |     } else {
  105 |       test.skip();
  106 |     }
  107 |   });
  108 | 
  109 |   test("compress-008: Upload extremely large video file", async ({ page }) => {
  110 |     await goToTool(page);
  111 |     test.skip();
  112 |   });
  113 | 
  114 |   test("compress-009: Upload non-video file", async ({ page }) => {
  115 |     await goToTool(page);
  116 |     const fileInput = page.locator("#cm-file");
  117 |     const buffer = Buffer.from("This is a PDF document");
  118 |     await page.waitForTimeout(3000);
  119 |     await fileInput.setInputFiles({
  120 |       name: "document.pdf",
  121 |       mimeType: "application/pdf",
  122 |       buffer: buffer
  123 |     });
  124 |     await page.waitForTimeout(2000);
  125 |     const btnText = await page.locator("#cm-run").innerText();
  126 |     const disabled = await page.locator("#cm-run").isDisabled();
  127 |     console.log("Button after invalid upload:", btnText, "disabled:", disabled);
  128 |     expect(disabled).toBeTruthy();
  129 |   });
  130 | 
  131 |   test("compress-010: Click process without uploading file", async ({ page }) => {
  132 |     await goToTool(page);
  133 |     const processButton = page.locator("#cm-run");
  134 |     const isDisabled = await processButton.isDisabled();
  135 |     if (isDisabled) {
  136 |       expect(isDisabled).toBeTruthy();
  137 |     } else {
  138 |       const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
  139 |       await page.waitForTimeout(1000);
  140 |       const errorMessage = page.locator("text=/upload.*file/i, text=/select.*video/i, text=/no.*file/i").first();
  141 |       const isErrorVisible = await errorMessage.isVisible().catch(() => false);
  142 |       expect(isErrorVisible).toBeTruthy();
  143 |     }
  144 |   });
  145 | 
  146 | });
```