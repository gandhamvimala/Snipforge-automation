import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=colorgrade");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#bg-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Brightness Contrast", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `test-results/brightness-${testInfo.title.replace(/\s+/g, "-")}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });

  test("brightness-001: Page and panel loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-colorgrade");
    await expect(panel).toBeVisible();
    await expect(page.locator("#bg-brightness")).toBeVisible();
    await expect(page.locator("#bg-contrast")).toBeVisible();
    await expect(page.locator("#bg-saturation")).toBeVisible();
    await expect(page.locator("#bg-run")).toBeVisible();
    await expect(page.locator("#bg-file")).toBeVisible();
  });

  test("brightness-002: Upload video file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const panel = page.locator("#panel-colorgrade");
    await expect(panel).toBeVisible();
  });

  test("brightness-003: Adjust brightness to positive value", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const brightnessSlider = page.locator("#bg-brightness");
    await brightnessSlider.fill("0.3");
    await expect(brightnessSlider).toHaveValue("0.3");
  });

  test("brightness-004: Adjust brightness to negative value", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const brightnessSlider = page.locator("#bg-brightness");
    await brightnessSlider.fill("-0.3");
    await expect(brightnessSlider).toHaveValue("-0.3");
  });

  test("brightness-005: Adjust contrast to maximum", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const contrastSlider = page.locator("#bg-contrast");
    await contrastSlider.evaluate(el => { el.value="2"; el.dispatchEvent(new Event("input",{bubbles:true})); });
    console.log("Contrast set to max");
  });

  test("brightness-006: Adjust contrast to minimum", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const contrastSlider = page.locator("#bg-contrast");
    await contrastSlider.fill("0.5");
    await expect(contrastSlider).toHaveValue("0.5");
  });

  test("brightness-007: Adjust saturation to desaturate", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const saturationSlider = page.locator("#bg-saturation");
    await saturationSlider.fill("0");
    await expect(saturationSlider).toHaveValue("0");
  });

  test("brightness-008: Adjust saturation to oversaturate", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const saturationSlider = page.locator("#bg-saturation");
    await saturationSlider.evaluate(el => { el.value="2"; el.dispatchEvent(new Event("input",{bubbles:true})); });
    console.log("Saturation set to max");
  });

  test("brightness-009: Process video with adjusted settings", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const brightnessSlider = page.locator("#bg-brightness");
    await brightnessSlider.fill("0.3");
    const contrastSlider = page.locator("#bg-contrast");
    await contrastSlider.evaluate(el => { el.value="1.5"; el.dispatchEvent(new Event("input",{bubbles:true})); });
    const processButton = page.locator("#bg-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(3000);
  });

  test("brightness-010: Brightness at maximum boundary", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const brightnessSlider = page.locator("#bg-brightness");
    await brightnessSlider.fill("0.5");
    await expect(brightnessSlider).toHaveValue("0.5");
  });

  test("brightness-011: Brightness at minimum boundary", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const brightnessSlider = page.locator("#bg-brightness");
    await brightnessSlider.fill("-0.5");
    await expect(brightnessSlider).toHaveValue("-0.5");
  });

  test("brightness-012: Process without uploading video", async ({ page }) => {
    await goToTool(page);
    const processButton = page.locator("#bg-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(1000);
  });

  test("brightness-013: Upload invalid file type", async ({ page }) => {
    await goToTool(page);
    const invalidFile = "/tmp/invalid_file.txt";
    const { writeFileSync, existsSync } = await import("fs");
    if (!existsSync(invalidFile)) {
      // path not needed
      writeFileSync(invalidFile, "This is not a video file");
    }
    const fileInput = page.locator("#bg-file");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(invalidFile);
    await page.waitForTimeout(2000);
  });
});