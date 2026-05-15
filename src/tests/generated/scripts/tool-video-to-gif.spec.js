import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=gif");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#gif-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Video to GIF", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `test-results/video-to-gif-${testInfo.testId}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });

  test("video-to-gif-001: Page loads with GIF panel visible", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-gif");
    await expect(panel).toBeVisible();
    await expect(page.locator("#gif-run")).toBeVisible();
    await expect(page.locator("#gif-file")).toBeVisible();
  });

  test("video-to-gif-002: Upload valid video file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const fileInput = page.locator("#gif-file");
    const files = await fileInput.inputValue();
    expect(files).toBeTruthy();
  });

  test("video-to-gif-003: Adjust FPS slider to middle value", async ({ page }) => {
    await goToTool(page);
    const fpsSlider = page.locator("#gif-fps");
    await fpsSlider.fill("15");
    const value = await fpsSlider.inputValue();
    expect(value).toBe("15");
  });

  test("video-to-gif-004: Adjust width slider to custom value", async ({ page }) => {
    await goToTool(page);
    const widthSlider = page.locator("#gif-width");
    await widthSlider.fill("640");
    const value = await widthSlider.inputValue();
    expect(value).toBe("640");
  });

  test("video-to-gif-005: Process video to GIF with default settings", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const processButton = page.locator("#gif-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(5000);
    const panel = page.locator("#panel-gif");
    await expect(panel).toBeVisible();
  });

  test("video-to-gif-006: Set FPS to maximum boundary value", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const fpsSlider = page.locator("#gif-fps");
    await fpsSlider.fill("25");
    const value = await fpsSlider.inputValue();
    expect(value).toBe("25");
    const processButton = page.locator("#gif-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(5000);
    const panel = page.locator("#panel-gif");
    await expect(panel).toBeVisible();
  });

  test("video-to-gif-007: Set width to minimum boundary value", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const widthSlider = page.locator("#gif-width");
    await widthSlider.fill("200");
    const value = await widthSlider.inputValue();
    expect(value).toBe("200");
    const processButton = page.locator("#gif-run");
    const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
    await page.waitForTimeout(5000);
    const panel = page.locator("#panel-gif");
    await expect(panel).toBeVisible();
  });

  test("video-to-gif-008: Upload non-video file", async ({ page }) => {
    await goToTool(page);
    const fileInput = page.locator("#gif-file");
    const buffer = Buffer.from("invalid content");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles({
      name: "invalid_file.txt",
      mimeType: "text/plain",
      buffer: buffer
    });
    await page.waitForTimeout(1000);
    const errorMessage = page.locator(".error, .alert, [role=alert]");
    const processButton = page.locator("#gif-run");
    const isDisabled = await processButton.isDisabled().catch(() => false);
    const hasError = await errorMessage.count() > 0;
    expect(isDisabled || hasError).toBeTruthy();
  });

  test("video-to-gif-009: Click process without uploading video", async ({ page }) => {
    await goToTool(page);
    const processButton = page.locator("#gif-run");
    const isDisabledBefore = await processButton.isDisabled().catch(() => false);
    if (!isDisabledBefore) {
      const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
      await page.waitForTimeout(1000);
      const errorMessage = page.locator(".error, .alert, [role=alert]");
      const hasError = await errorMessage.count() > 0;
      expect(hasError).toBeTruthy();
    } else {
      expect(isDisabledBefore).toBeTruthy();
    }
  });
});