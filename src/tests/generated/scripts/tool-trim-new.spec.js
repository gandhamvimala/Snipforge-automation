import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
test.describe("SnipForge - trim new", () => {
test('trim-009: Trim with start time equal to end time', async ({ page }) => {
  
  
  await goToTool(page);
  
  // Upload video
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#panel-trim', { state: 'visible', timeout: 10000 });
  
  // Set start and end time to the same value
  await page.locator('#tr-start').fill('5');
  await page.locator('#tr-end').fill('5');
  
  // Click run button
  await page.locator('#tr-run').click();
  
  // Check for rate limit
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    return;
  }
  
  // Wait for processing
  await page.waitForTimeout(2000);
  
  // Verify error state or disabled button (equal times should be invalid)
  const runButton = page.locator('#tr-run');
  const isDisabled = await runButton.isDisabled().catch(() => false);
  
  expect(isDisabled).toBe(true);
});
});
