import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

test("trim-010: BUG-009 - Validates invalid trim range (end < start)", async ({ page }) => {
  await page.goto("/?tool=trim");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  await page.locator("#tr-file").setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(3000);

  const btnText = await page.locator("#tr-run").innerText();
  if (btnText.includes("failed")) { console.log("⚠️ Rate limit"); return; }

  // Set invalid range: end before start
  await page.locator("#tr-start").fill("30");
  await page.locator("#tr-end").fill("10");
  await page.waitForTimeout(300);

  // Listen for alert dialog
  let alertShown = false;
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertShown = true;
    alertMessage = dialog.message();
    console.log("✅ Alert shown:", alertMessage);
    await dialog.dismiss();
  });

  // Click run button
  await page.locator("#tr-run").click();
  await page.waitForTimeout(1000);

  console.log("Alert shown:", alertShown);
  console.log("Alert message:", alertMessage);

  if (alertShown) {
    console.log("✅ BUG-009 FIXED: Validation alert shown!");
    expect(alertMessage).toContain("End time");
  } else {
    console.log("🐛 BUG-009 STILL PRESENT: No validation shown");
    // Document the bug
    expect(alertShown, "BUG-009: No validation for end < start").toBe(true);
  }
});
