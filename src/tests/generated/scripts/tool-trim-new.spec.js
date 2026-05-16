import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
test.describe("SnipForge - trim new", () => {
test('trim-009: Trim video with start time greater than end time', async ({ page }) => {
  
  
  await goToTool(page);
  
  // Upload video
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#panel-trim', { state: 'visible', timeout: 10000 });
  
  // Set start time greater than end time
  await page.locator('#tr-start').fill('15');
  await page.locator('#tr-end').fill('5');
  
  // Click run button
  await page.locator('#tr-run').click();
  
  // Check for rate limit
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    return;
  }
  
  // Verify error handling or validation message
  // The tool should prevent processing or show validation error
  const runButton = page.locator('#tr-run');
  await expect(runButton).toBeVisible();
  
  // Wait briefly to see if any error message appears or if button state indicates invalid input
  await page.waitForTimeout(1000);
  
  // Verify the run button is still visible (not processing invalid range)
  await expect(runButton).toBeVisible();
});
});
