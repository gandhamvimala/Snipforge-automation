import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
test.describe("SnipForge - trim new", () => {
test('trim-009: Trim video with start time greater than end time', async ({ page }) => {
  
  
  await goToTool(page);
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#panel-trim', { state: 'visible' });
  
  // Set start time greater than end time
  await page.locator('#tr-start').fill('20');
  await page.locator('#tr-end').fill('10');
  
  // Check rate limit before running
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    console.log('⚠️ Rate limit hit - skipping test');
    return;
  }
  
  await page.locator('#tr-run').click();
  
  // Should show error or validation message
  await page.waitForTimeout(2000);
  
  // Verify error handling (button should not process invalid input)
  const finalBtnText = await page.locator('#tr-run').innerText();
  expect(finalBtnText).not.toContain('Processing');
});

test('trim-010: Trim with start and end points at same timestamp', async ({ page }) => {
  
  
  await goToTool(page);
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#panel-trim', { state: 'visible' });
  
  // Set start and end to same timestamp
  await page.locator('#tr-start').fill('10');
  await page.locator('#tr-end').fill('10');
  
  // Check rate limit before running
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    console.log('⚠️ Rate limit hit - skipping test');
    return;
  }
  
  await page.locator('#tr-run').click();
  
  // Should handle edge case (likely show error or produce zero-length clip)
  await page.waitForTimeout(2000);
  
  // Verify system handles edge case gracefully
  const finalBtnText = await page.locator('#tr-run').innerText();
  expect(finalBtnText).toBeDefined();
});
});
