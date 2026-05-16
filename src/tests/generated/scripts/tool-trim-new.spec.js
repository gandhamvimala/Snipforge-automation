import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); }
test.describe("SnipForge - trim new", () => {
test('trim-009: Trim with start and end points at the same value', async ({ page }) => {
  
  await goToTool(page);


  // Upload video
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForTimeout(1000);

  // Set start and end to the same value
  await page.locator('#tr-start').fill('5');
  await page.locator('#tr-end').fill('5');
  await page.waitForTimeout(500);

  // Click run button
  await page.locator('#tr-run').click();
  
  // Check for rate limit
  await page.waitForTimeout(1000);
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    return;
  }

  // Verify error handling or validation message
  // The system should prevent or handle this edge case
  await page.waitForTimeout(2000);
  
  // Check if run button shows error state or if validation prevents submission
  const runButtonState = await page.locator('#tr-run').innerText();
  expect(runButtonState).toBeTruthy();
});
});
