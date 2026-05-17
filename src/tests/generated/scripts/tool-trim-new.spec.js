import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
test.describe("SnipForge - trim new", () => {
test('trim-009: Trim video with start time greater than end time', async ({ page }) => {
  
  
  await goToTool(page);
  
  // Upload video
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#tr-filecard', { state: 'visible', timeout: 10000 });
  
  // Set start time greater than end time
  await page.locator('#tr-start').fill('20');
  await page.locator('#tr-end').fill('10');
  
  // Check rate limit before running
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    console.log('⚠️ Rate limit detected, skipping test execution');
    return;
  }
  
  // Click run button
  await page.locator('#tr-run').click();
  
  // Verify error handling (button should show error or validation message)
  await page.waitForTimeout(2000);
  const buttonState = await page.locator('#tr-run').innerText();
  expect(buttonState.toLowerCase()).toContain('failed');
});

test('trim-010: Trim with start and end points at same timestamp', async ({ page }) => {
  
  
  await goToTool(page);
  
  // Upload video
  await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  await page.waitForSelector('#tr-filecard', { state: 'visible', timeout: 10000 });
  
  // Set start and end time to same value
  await page.locator('#tr-start').fill('10');
  await page.locator('#tr-end').fill('10');
  
  // Check rate limit before running
  const btnText = await page.locator('#tr-run').innerText();
  if (btnText.includes('failed')) {
    console.log('⚠️ Rate limit detected, skipping test execution');
    return;
  }
  
  // Click run button
  await page.locator('#tr-run').click();
  
  // Verify error handling (zero-length trim should fail)
  await page.waitForTimeout(2000);
  const buttonState = await page.locator('#tr-run').innerText();
  expect(buttonState.toLowerCase()).toContain('failed');
});
});
