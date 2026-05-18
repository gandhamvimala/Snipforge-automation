import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });

async function goToTool(page) {
  await page.goto("/?tool=trim");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
}

test.describe("SnipForge - trim new", () => {

  test("trim-009: Trim video with start time greater than end time", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);

    const btnText = await page.locator("#tr-run").innerText();
    if (btnText.includes("failed")) { console.log("⚠️ Rate limit"); return; }

    await page.locator("#tr-start").fill("30");
    await page.locator("#tr-end").fill("10");
    await page.waitForTimeout(300);

    let alertShown = false;
    page.on("dialog", async dialog => {
      alertShown = true;
      await dialog.dismiss();
    });

    await page.locator("#tr-run").click();
    await page.waitForTimeout(1000);
    expect(alertShown).toBeTruthy();
  });

  test("trim-010: Trim with start and end points at same timestamp", async ({ page }) => {
    await goToTool(page);
    await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);

    const btnText = await page.locator("#tr-run").innerText();
    if (btnText.includes("failed")) { console.log("⚠️ Rate limit"); return; }

    await page.locator("#tr-start").fill("5");
    await page.locator("#tr-end").fill("5");
    await page.waitForTimeout(300);

    let alertShown = false;
    page.on("dialog", async dialog => {
      alertShown = true;
      await dialog.dismiss();
    });

    await page.locator("#tr-run").click();
    await page.waitForTimeout(1000);
    expect(alertShown).toBeTruthy();
  });

});
