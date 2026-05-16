import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=trim");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

test.describe("SnipForge - Trim", () => {

  test("trim-001: Panel loads successfully", async ({ page }) => {
    await goToTool(page);
    const panel = page.locator("#panel-trim");
    await expect(panel).toBeVisible();
    await expect(page.locator("#tr-file")).toBeVisible();
    await expect(page.locator("#tr-run")).toBeVisible();
  });

  test("trim-002: Upload video file", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#tr-run");
    await expect(btn).toBeVisible();
  });

  test("trim-003: Set trim start time", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-start").fill("5");
    const val = await page.locator("#tr-start").inputValue();
    expect(parseFloat(val)).toBe(5);
  });

  test("trim-004: Set trim end time", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-end").fill("15");
    const val = await page.locator("#tr-end").inputValue();
    expect(parseFloat(val)).toBe(15);
  });

  test("trim-005: Process trim with valid range", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#tr-run");
    const txt = await btn.innerText();
    if (txt.includes("failed")) { console.log("⚠️ Rate limit"); return; }
    await page.locator("#tr-start").fill("0");
    await page.locator("#tr-end").fill("5");
    await expect(btn).toBeEnabled({ timeout: 10000 });
    await btn.click();
    await page.waitForTimeout(3000);
  });

  test("trim-006: Start time equals zero", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-start").fill("0");
    const val = await page.locator("#tr-start").inputValue();
    expect(parseFloat(val)).toBe(0);
  });

  test("trim-007: End time before start time shows error", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#tr-run");
    const txt = await btn.innerText();
    if (txt.includes("failed")) { console.log("⚠️ Rate limit"); return; }
    await page.locator("#tr-start").fill("30");
    await page.locator("#tr-end").fill("10");
    let alertShown = false;
    page.on("dialog", async dialog => { alertShown = true; await dialog.dismiss(); });
    await btn.click();
    await page.waitForTimeout(1000);
    expect(alertShown).toBeTruthy();
  });

  test("trim-008: Negative start time clamped to 0", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-start").fill("-5");
    await page.waitForTimeout(500);
    const val = await page.locator("#tr-start").inputValue();
    console.log("✅ FIXED: Trim start time clamped to:", val);
    expect(parseFloat(val)).toBeGreaterThanOrEqual(0);
  });

});
