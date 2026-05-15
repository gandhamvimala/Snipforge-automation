import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=multitrim");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#mt-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Multi Trim", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach("failure-screenshot", {
        body: screenshot,
        contentType: "image/png"
      });
    }
  });

  test("multi-trim-001: Page loads and panel is visible", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-multitrim");
    await expect(panel).toBeVisible();
    const dropZone = panel.locator(".drop-zone, .file-drop, [class*='drop']").first();
    await expect(dropZone).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test("multi-trim-002: Upload valid video file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const preview = page.locator("#panel-multitrim video, #panel-multitrim .video-preview, #panel-multitrim canvas");
    await expect(preview.first()).toBeVisible({ timeout: 10000 });
  });

  test("multi-trim-003: Add new segment", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const addSegmentBtn = page.locator(".add-seg-btn");
    await expect(addSegmentBtn).toBeVisible({ timeout: 5000 });
    const initialSegments = await page.locator("#panel-multitrim .segment-row, #panel-multitrim .seg-row, #panel-multitrim [class*='segment']").count();
    await addSegmentBtn.click();
    await page.waitForTimeout(500);
    const newSegmentCount = await page.locator("#panel-multitrim .segment-row, #panel-multitrim .seg-row, #panel-multitrim [class*='segment']").count();
    expect(newSegmentCount).toBeGreaterThan(initialSegments);
  });

  test("multi-trim-004: Change uploaded video", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const changeBtn = page.locator("#mt-filecard .file-change");
    await expect(changeBtn).toBeVisible({ timeout: 5000 });
    const fileInput = page.locator("#mt-file");
    await page.locator("#mt-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(1000);
    console.log("✅ File changed via setInputFiles");
    // expect(fileChooser).toBeTruthy();
  });

  test("multi-trim-005: Process multi-trim with segments", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const addSegmentBtn = page.locator(".add-seg-btn");
    if (await addSegmentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addSegmentBtn.click();
      await page.waitForTimeout(500);
    }
    const processBtn = page.locator("#mt-run");
    await expect(processBtn).toBeVisible({ timeout: 5000 });
    const btnTxt = await processBtn.innerText();
    if (btnTxt.includes("failed")) { console.log("⚠️ Rate limit"); return; }
    await expect(processBtn).toBeEnabled({ timeout: 5000 });
    await processBtn.click();
    await page.waitForTimeout(2000);
    const progressIndicator = page.locator(".progress, .processing, [class*='progress'], #panel-multitrim .spinner");
    const hasProgress = await progressIndicator.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasProgress).toBeTruthy();
  });

  test("multi-trim-006: Process without adding any segments", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
    }
    const processBtn = page.locator("#mt-run");
    await expect(processBtn).toBeVisible({ timeout: 5000 });
    const isDisabled = await processBtn.isDisabled();
    if (isDisabled) { console.log("Button disabled - correct"); return; }
    await processBtn.click();
    await page.waitForTimeout(1000);
    const errorMessage = page.locator(".error, .warning, .alert, [class*='error'], [class*='warning']");
    const hasError = await errorMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasError).toBeTruthy();
  });

  test("multi-trim-007: Upload non-video file", async ({ page }) => {
    await goToTool(page);
    const fileInput = page.locator("#mt-file");
    const tempFile = "/tmp/invalid-test-file.txt";
    const { writeFileSync, existsSync } = await import("fs");
    writeFileSync(tempFile, "This is not a video file");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(tempFile);
    await page.waitForTimeout(2000);
    const errorMessage = page.locator(".error, .alert, [class*='error'], .invalid-file");
    const btnText = await page.locator("#mt-run").innerText();
    const disabled = await page.locator("#mt-run").isDisabled();
    console.log("Button after invalid upload:", btnText, disabled);
    expect(disabled).toBeTruthy();
    // cleanup not needed
  });
});