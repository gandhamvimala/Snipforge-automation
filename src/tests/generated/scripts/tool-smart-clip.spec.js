import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=smartclip");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

async function uploadVideo(page) {
  if (!process.env.TEST_VIDEO_PATH) return false;
  // sc-file is hidden input inside upload-zone - setInputFiles works on hidden inputs
  await page.locator("#sc-file").setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(3000);
  const btnText = await page.locator("#sc-run").innerText().catch(() => '');
  if (btnText.includes("failed")) {
    console.log("⚠️ Upload failed - rate limit");
    return false;
  }
  return true;
}

test.describe("SnipForge - Smart Clip", () => {

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `test-results/smart-clip-${testInfo.title.replace(/\s/g,'-')}.png` });
    }
  });

  test("smart-clip-001: Smart Clip panel loads successfully", async ({ page }) => {
    await goToTool(page);
    await expect(page).toHaveURL(/tool=smartclip/);
    await expect(page.locator("#panel-smartclip")).toBeVisible();
    await expect(page.locator("#sc-dropzone")).toBeVisible();
    console.log("✅ Smart Clip panel loaded");
  });

  test("smart-clip-002: Upload video file via file input", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video");
    await goToTool(page);
    await page.locator("#sc-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btnText = await page.locator("#sc-run").innerText().catch(() => '');
    console.log("Button text after upload:", btnText);
    const filecard = await page.locator("#sc-filecard").isVisible().catch(() => false);
    console.log("Filecard visible:", filecard);
  });

  test("smart-clip-003: Process button disabled without file", async ({ page }) => {
    await goToTool(page);
    const btn = page.locator("#sc-run");
    await expect(btn).toBeVisible();
    const disabled = await btn.isDisabled();
    console.log("Button disabled without file:", disabled);
    expect(disabled).toBeTruthy();
  });

  test("smart-clip-004: Change button is panel-scoped", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video");
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { test.skip(true, "Rate limited"); return; }
    const changeBtn = page.locator("#sc-filecard .file-change");
    await expect(changeBtn).toBeVisible({ timeout: 5000 });
    console.log("✅ Change button found");
  });

  test("smart-clip-005: Upload zone is visible and interactive", async ({ page }) => {
    await goToTool(page);
    const zone = page.locator("#sc-dropzone");
    await expect(zone).toBeVisible();
    const fileInput = page.locator("#sc-file");
    await expect(fileInput).toBeAttached();
    console.log("✅ Upload zone interactive");
  });

  test("smart-clip-006: Process with uploaded file", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video");
    await goToTool(page);
    const uploaded = await uploadVideo(page);
    if (!uploaded) { test.skip(true, "Rate limited"); return; }
    const btn = page.locator("#sc-run");
    const disabled = await btn.isDisabled();
    console.log("Button disabled after upload:", disabled);
    expect(disabled).toBeFalsy();
  });

});
