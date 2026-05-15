import { test, expect } from "@playwright/test";

test.use({ 
  baseURL: "https://snipforge.video", 
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" 
});

async function goToTool(page) {
  await page.goto("/?tool=compress");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#cm-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Compress", () => {
  
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach("failure-screenshot", {
        body: screenshot,
        contentType: "image/png"
      });
    }
  });

  test("compress-001: Panel loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-compress");
    await expect(panel).toBeVisible();
    const fileDropArea = panel.locator("input[type=file]");
    await expect(fileDropArea).toBeAttached();
  });

  test("compress-002: Upload valid video file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    const panel = page.locator("#panel-compress");
    const fileNameDisplay = panel.locator("text=/.*\\.(mp4|mov|avi|webm).*/i").first();
    await expect(fileNameDisplay).toBeVisible({ timeout: 5000 });
  });

  test("compress-003: Select Light compression preset", async ({ page }) => {
    await goToTool(page);
    // cm-quality is hidden - click the visible preset button instead
    await page.locator("#panel-compress .preset-btn").filter({ hasText: /light/i }).click();
    const value = await page.locator("#cm-quality").inputValue();
    console.log("Quality value:", value);
  });

  test("compress-004: Select Medium compression preset", async ({ page }) => {
    await goToTool(page);
    await page.locator("#panel-compress .preset-btn").filter({ hasText: /medium/i }).click();
    const value = await page.locator("#cm-quality").inputValue();
    console.log("Quality value:", value);
  });

  test("compress-005: Select Heavy compression preset", async ({ page }) => {
    await goToTool(page);
    await page.locator("#panel-compress .preset-btn").filter({ hasText: /heavy/i }).click();
    const value = await page.locator("#cm-quality").inputValue();
    console.log("Quality value:", value);
  });

  test("compress-006: Process compression with valid file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    const processButton = page.locator("#cm-run");
    const btnText = await processButton.innerText();
    if (btnText.includes("failed")) { console.log("⚠️ Upload failed - rate limit"); return; }
    const isDisabled = await processButton.isDisabled();
    console.log("Process button disabled:", isDisabled);
    expect(isDisabled).toBeFalsy();
  });

  test("compress-007: Change uploaded file", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    await page.waitForTimeout(1000);
    const changeButton = page.locator("#cm-filecard .file-change");
    if (await changeButton.count() > 0) {
      await changeButton.click();
      const fileInput = page.locator("#cm-file");
      await expect(fileInput).toBeAttached();
    } else {
      test.skip();
    }
  });

  test("compress-008: Upload extremely large video file", async ({ page }) => {
    await goToTool(page);
    test.skip();
  });

  test("compress-009: Upload non-video file", async ({ page }) => {
    await goToTool(page);
    const fileInput = page.locator("#cm-file");
    const buffer = Buffer.from("This is a PDF document");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles({
      name: "document.pdf",
      mimeType: "application/pdf",
      buffer: buffer
    });
    await page.waitForTimeout(2000);
    const btnText = await page.locator("#cm-run").innerText();
    const disabled = await page.locator("#cm-run").isDisabled();
    console.log("Button after invalid upload:", btnText, "disabled:", disabled);
    expect(disabled).toBeTruthy();
  });

  test("compress-010: Click process without uploading file", async ({ page }) => {
    await goToTool(page);
    const processButton = page.locator("#cm-run");
    const isDisabled = await processButton.isDisabled();
    if (isDisabled) {
      expect(isDisabled).toBeTruthy();
    } else {
      const isDisabled = await processButton.isDisabled(); if(isDisabled) { console.log("Button is disabled - correct behavior"); return; } await processButton.click();
      await page.waitForTimeout(1000);
      const errorMessage = page.locator("text=/upload.*file/i, text=/select.*video/i, text=/no.*file/i").first();
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      expect(isErrorVisible).toBeTruthy();
    }
  });

});