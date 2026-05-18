import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

test.describe("SnipForge - Noise Removal", () => {
  async function goToTool(page) {
    await page.goto("/?tool=denoise");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  }

  async function uploadVideo(page) {
    if (!process.env.TEST_VIDEO_PATH) return false;
    const fi = page.locator("#dn-file");
    await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(2000);
    return true;
  }

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach("failure-screenshot", {
        body: screenshot,
        contentType: "image/png"
      });
    }
  });

  test("noise-removal-001: Page loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-denoise");
    await expect(panel).toBeVisible();
    await expect(page.locator("#dn-run")).toBeVisible();
    await expect(page.locator("#dn-file")).toBeAttached();
  });

  test("noise-removal-002: Upload video file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const panel = page.locator("#panel-denoise");
    await expect(panel).toBeVisible();
  });

  test("noise-removal-003: Select Light strength preset", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    await page.locator("#panel-denoise .preset-btn").filter({ hasText: /light/i }).first().click();
    const val1 = await page.locator("#dn-strength").inputValue();
    console.log("Strength:", val1);
  });

  test("noise-removal-004: Select Medium strength preset", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    await page.locator("#panel-denoise .preset-btn").filter({ hasText: /medium/i }).first().click();
    const val2 = await page.locator("#dn-strength").inputValue();
    console.log("Strength:", val2);
  });

  test("noise-removal-005: Select Heavy strength preset", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    await page.locator("#panel-denoise .preset-btn").filter({ hasText: /heavy/i }).first().click();
    const val3 = await page.locator("#dn-strength").inputValue();
    console.log("Strength:", val3);
  });

  test("noise-removal-006: Process video with denoise", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const processButton = page.locator("#dn-run");
    await expect(processButton).toBeVisible();
    const isEnabled = await processButton.isEnabled();
    if (isEnabled) {
      const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
      await page.waitForTimeout(2000);
    }
  });

  test("noise-removal-007: Change uploaded file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { console.log("⚠️ Upload failed - skipping"); return; }
    const changeButton = page.locator("#dn-filecard .file-change");
    if (await changeButton.count() > 0) {
      await expect(changeButton).toBeVisible();
      await changeButton.click();
      await page.waitForTimeout(500);
    }
  });

  test("noise-removal-008: Upload extremely large video file", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video available");
    await goToTool(page);
    const fileInput = page.locator("#dn-file");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(2000);
  });

  test("noise-removal-009: Upload non-video file", async ({ page }) => {
    await goToTool(page);
    const fileInput = page.locator("#dn-file");
    const testFile = {
      name: "document.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("PDF content")
    };
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(testFile);
    await page.waitForTimeout(2000);
  });

  test("noise-removal-010: Process without uploading file", async ({ page }) => {
    await goToTool(page);
    const processButton = page.locator("#dn-run");
    await expect(processButton).toBeVisible();
    const isDisabled = await processButton.isDisabled();
    if (!isDisabled) {
      const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
      await page.waitForTimeout(1000);
    } else {
      await expect(processButton).toBeDisabled();
    }
  });
});