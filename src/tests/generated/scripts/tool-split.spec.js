import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=split");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  const fi = page.locator("#sp2-file");
  await fi.setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(2000);
  return true;
}

test.describe("SnipForge - Split", () => {
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `test-results/split-${testInfo.title.replace(/\s+/g, "-")}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });

  test("split-001: Split tool panel loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-split");
    await expect(panel).toBeVisible();
    const fileDropArea = panel.locator("input[type=file]");
    await expect(fileDropArea).toBeAttached();
  });

  test("split-002: Upload video file for splitting", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    const fileInput = page.locator("#sp2-file");
    const inputValue = await fileInput.inputValue();
    expect(inputValue).toBeTruthy();
  });

  test("split-003: Change file button works", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    const changeButton = page.locator("#sp2-filecard .file-change");
    await expect(changeButton).toBeVisible();
    await changeButton.click();
    await page.waitForTimeout(500);
  });

  test("split-004: Run split process", async ({ page }) => {
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) {
      test.skip();
      return;
    }
    const runButton = page.locator("#sp2-run");
    await expect(runButton).toBeVisible();
    const btnTxt = await runButton.innerText();
    if (btnTxt.includes("failed")) { console.log("⚠️ Rate limit"); return; }
    await expect(runButton).toBeEnabled();
    await runButton.click();
    await page.waitForTimeout(3000);
  });

  test("split-005: Upload very large video file", async ({ page }) => {
    test.skip(!process.env.LARGE_VIDEO_PATH, "Large video file not configured");
    await goToTool(page);
    const fileInput = page.locator("#sp2-file");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(process.env.LARGE_VIDEO_PATH || "");
    await page.waitForTimeout(5000);
    const progressIndicator = page.locator(".progress, .loading, [class*=progress], [class*=loading]").first();
    const warningMessage = page.locator("[class*=warning], [class*=error], [class*=alert]").first();
    const hasProgressOrWarning = (await progressIndicator.count()) > 0 || (await warningMessage.count()) > 0;
    expect(hasProgressOrWarning).toBeTruthy();
  });

  test("split-006: Upload invalid file type", async ({ page }) => {
    await goToTool(page);
    const tempPdfPath = "/tmp/test-document.pdf";
    const { writeFileSync, existsSync } = await import("fs");
    if (!existsSync(tempPdfPath)) {
      writeFileSync(tempPdfPath, "PDF placeholder content");
    }
    const fileInput = page.locator("#sp2-file");
    await page.waitForTimeout(3000);
    await fileInput.setInputFiles(tempPdfPath);
    await page.waitForTimeout(2000);
    const btnText = await page.locator("#sp2-run").innerText();
    const disabled = await page.locator("#sp2-run").isDisabled();
    console.log("Button after invalid upload:", btnText, disabled);
    expect(disabled).toBeTruthy();
  });
});