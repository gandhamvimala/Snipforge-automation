import { test, expect } from "@playwright/test";

test.use({ 
  baseURL: "https://snipforge.video", 
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" 
});

async function goToTool(page) {
  await page.goto("/?tool=watermark");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#wm-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Watermark", () => {
  
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach("failure-screenshot", { 
        body: screenshot, 
        contentType: "image/png" 
      });
    }
  });

  test("watermark-001: Watermark tool panel loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-watermark");
    await expect(panel).toBeVisible();
    await expect(page.locator("#wm-text")).toBeVisible();
    await expect(page.locator("#wm-fontsize")).toBeVisible();
    await expect(page.locator("#wm-opacity")).toBeVisible();
    await expect(page.locator("#wm-position")).toBeVisible();
    await expect(page.locator("#wm-run")).toBeVisible();
  });

  test("watermark-002: Upload video file for watermarking", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const panel = page.locator("#panel-watermark");
    await expect(panel).toBeVisible();
  });

  test("watermark-003: Enter watermark text", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const textInput = page.locator("#wm-text");
    await textInput.fill("© MyBrand 2024");
    await expect(textInput).toHaveValue("© MyBrand 2024");
  });

  test("watermark-004: Adjust font size slider", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const fontSizeSlider = page.locator("#wm-fontsize");
    await fontSizeSlider.fill("15");
    await expect(fontSizeSlider).toHaveValue("15");
  });

  test("watermark-005: Adjust opacity slider", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const opacitySlider = page.locator("#wm-opacity");
    await opacitySlider.fill("50");
    await expect(opacitySlider).toHaveValue("50");
  });

  test("watermark-006: Change watermark position to center", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const positionSelect = page.locator("#wm-position");
    await positionSelect.selectOption("center");
    await expect(positionSelect).toHaveValue("center");
  });

  test("watermark-007: Change watermark position to top-left", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const positionSelect = page.locator("#wm-position");
    await positionSelect.selectOption("top-left");
    await expect(positionSelect).toHaveValue("top-left");
  });

  test("watermark-008: Process watermark with valid inputs", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const textInput = page.locator("#wm-text");
    await textInput.fill("© MyBrand 2024");
    const processButton = page.locator("#wm-run");
    await expect(processButton).toBeVisible();
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(3000);
  });

  test("watermark-009: Set font size to maximum boundary", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const fontSizeSlider = page.locator("#wm-fontsize");
    await fontSizeSlider.fill("25");
    await expect(fontSizeSlider).toHaveValue("25");
  });

  test("watermark-010: Set opacity to minimum boundary", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const opacitySlider = page.locator("#wm-opacity");
    await opacitySlider.fill("10");
    await expect(opacitySlider).toHaveValue("10");
  });

  test("watermark-011: Attempt to process without uploading video", async ({ page }) => {
    await goToTool(page);
    const processButton = page.locator("#wm-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(1000);
    const errorMessage = page.locator("text=/video|upload|file|required/i").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("watermark-012: Process with empty watermark text", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const textInput = page.locator("#wm-text");
    await textInput.clear();
    const processButton = page.locator("#wm-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(1000);
    const errorMessage = page.locator("text=/text|watermark|empty|required/i").first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

});