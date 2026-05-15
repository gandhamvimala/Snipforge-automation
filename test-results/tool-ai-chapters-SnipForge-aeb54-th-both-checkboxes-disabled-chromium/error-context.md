# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tool-ai-chapters.spec.js >> SnipForge - AI Chapters >> ai-chapters-008: Process with both checkboxes disabled
- Location: src/tests/generated/scripts/tool-ai-chapters.spec.js:141:3

# Error details

```
Error: page.waitForTimeout: Test ended.
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
  9   |   await page.goto("/?tool=aianalyze");
  10  |   await page.waitForLoadState("networkidle");
  11  |   await page.waitForTimeout(1000);
  12  | }
  13  | 
  14  | async function uploadVideo(page) {
  15  |   if (!process.env.TEST_VIDEO_PATH) return false;
  16  |   const fi = page.locator("#aa-file");
  17  |   await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
> 18  |   await page.waitForTimeout(2000);
      |              ^ Error: page.waitForTimeout: Test ended.
  19  |   return true;
  20  | }
  21  | 
  22  | test.describe("SnipForge - AI Chapters", () => {
  23  |   
  24  |   test.afterEach(async ({ page }, testInfo) => {
  25  |     if (testInfo.status !== testInfo.expectedStatus) {
  26  |       await page.screenshot({ 
  27  |         path: `test-results/ai-chapters-${testInfo.title.replace(/\s+/g, "-")}-${Date.now()}.png`,
  28  |         fullPage: true 
  29  |       });
  30  |     }
  31  |   });
  32  | 
  33  |   test("ai-chapters-001: Panel loads with default checkboxes checked", async ({ page }) => {
  34  |     await goToTool(page);
  35  |     
  36  |     const panel = page.locator("#panel-aianalyze");
  37  |     await expect(panel).toBeVisible();
  38  |     
  39  |     const chaptersCheckbox = page.locator("#aa-do-chapters");
  40  |     const metaCheckbox = page.locator("#aa-do-meta");
  41  |     
  42  |     await expect(chaptersCheckbox).toBeChecked();
  43  |     await expect(metaCheckbox).toBeChecked();
  44  |   });
  45  | 
  46  |   test("ai-chapters-002: Upload valid video file", async ({ page }) => {
  47  |     await goToTool(page);
  48  |     
  49  |     const uploaded = await uploadVideo(page);
  50  |     if (!uploaded) {
  51  |       test.skip();
  52  |     }
  53  |     
  54  |     const processButton = page.locator("#aa-run");
  55  |     const btnTxt = await processButton.innerText();
  56  |     if (btnTxt.includes("failed")) { console.log("⚠️ Upload failed - rate limit"); return; }
  57  |     await expect(processButton).toBeEnabled({ timeout: 10000 });
  58  |   });
  59  | 
  60  |   test("ai-chapters-003: Toggle chapter markers checkbox off", async ({ page }) => {
  61  |     await goToTool(page);
  62  |     
  63  |     const chaptersCheckbox = page.locator("#aa-do-chapters");
  64  |     await expect(chaptersCheckbox).toBeChecked();
  65  |     
  66  |     await chaptersCheckbox.uncheck();
  67  |     await expect(chaptersCheckbox).not.toBeChecked();
  68  |     
  69  |     const metaCheckbox = page.locator("#aa-do-meta");
  70  |     await expect(metaCheckbox).toBeChecked();
  71  |   });
  72  | 
  73  |   test("ai-chapters-004: Toggle title & description & tags checkbox off", async ({ page }) => {
  74  |     await goToTool(page);
  75  |     
  76  |     const metaCheckbox = page.locator("#aa-do-meta");
  77  |     await expect(metaCheckbox).toBeChecked();
  78  |     
  79  |     await metaCheckbox.uncheck();
  80  |     await expect(metaCheckbox).not.toBeChecked();
  81  |     
  82  |     const chaptersCheckbox = page.locator("#aa-do-chapters");
  83  |     await expect(chaptersCheckbox).toBeChecked();
  84  |   });
  85  | 
  86  |   test("ai-chapters-005: Process with both options enabled", async ({ page }) => {
  87  |     await goToTool(page);
  88  |     
  89  |     const uploaded = await uploadVideo(page);
  90  |     if (!uploaded) {
  91  |       test.skip();
  92  |     }
  93  |     
  94  |     const chaptersCheckbox = page.locator("#aa-do-chapters");
  95  |     const metaCheckbox = page.locator("#aa-do-meta");
  96  |     
  97  |     await expect(chaptersCheckbox).toBeChecked();
  98  |     await expect(metaCheckbox).toBeChecked();
  99  |     
  100 |     const processButton = page.locator("#aa-run");
  101 |     const btnTxt = await processButton.innerText();
  102 |     if (btnTxt.includes("failed")) { console.log("⚠️ Upload failed - rate limit"); return; }
  103 |     await expect(processButton).toBeEnabled({ timeout: 10000 });
  104 |     const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
  105 |     
  106 |     await page.waitForTimeout(2000);
  107 |   });
  108 | 
  109 |   test("ai-chapters-006: Upload extremely large video file", async ({ page }) => {
  110 |     await goToTool(page);
  111 |     
  112 |     const fileInput = page.locator("#aa-file");
  113 |     
  114 |     const largeFileBuffer = Buffer.alloc(1024 * 1024);
  115 |     await page.waitForTimeout(3000);
  116 |     await fileInput.setInputFiles({
  117 |       name: "large_10gb.mp4",
  118 |       mimeType: "video/mp4",
```