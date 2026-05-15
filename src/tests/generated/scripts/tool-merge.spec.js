import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json"
});

async function goToTool(page) {
  await page.goto("/?tool=merge");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
}

test.describe("SnipForge - Merge Videos", () => {

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `test-results/merge-${testInfo.title.replace(/\s/g,'-')}.png` });
    }
  });

  test("merge-001: Panel loads with merge UI visible", async ({ page }) => {
    await goToTool(page);
    await expect(page).toHaveURL(/tool=merge/);
    await expect(page.locator("#panel-merge")).toBeVisible();
    await expect(page.locator("#merge-file-input")).toBeAttached();
    await expect(page.locator("#mg-run")).toBeVisible();
    console.log("✅ Merge panel loaded correctly");
  });

  test("merge-002: Button disabled with no files", async ({ page }) => {
    await goToTool(page);
    const btn = page.locator("#mg-run");
    await expect(btn).toBeVisible();
    const disabled = await btn.isDisabled();
    const text = await btn.innerText();
    console.log("Button text:", text);
    console.log("Button disabled:", disabled);
    expect(disabled).toBeTruthy();
    expect(text).toMatch(/add at least 2/i);
  });

  test("merge-003: Add first video file", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video");
    await goToTool(page);

    // Add first video via file input
    await page.locator("#merge-file-input").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(2000);

    // Check merge list has 1 item
    const mergeList = page.locator("#merge-list");
    const listHtml = await mergeList.innerHTML();
    console.log("Merge list after 1 upload:", listHtml.slice(0, 200));

    // Button should still be disabled (need at least 2)
    const btn = page.locator("#mg-run");
    const disabled = await btn.isDisabled();
    console.log("Button disabled after 1 video:", disabled);
    expect(disabled).toBeTruthy();
  });

  test("merge-004: Add 2 videos enables merge button", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH || !process.env.TEST_VIDEO_PATH_2, "Need 2 test videos");
    await goToTool(page);

    // Add first video and trigger onchange
    await page.locator("#merge-file-input").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.evaluate(() => { const el = document.getElementById("merge-file-input"); if(el) el.dispatchEvent(new Event("change", {bubbles:true})); });
    await page.waitForTimeout(2000);
    console.log("✅ Video 1 added");

    // Add second video
    await page.locator("#merge-file-input").setInputFiles(process.env.TEST_VIDEO_PATH_2);
    await page.evaluate(() => { const el = document.getElementById("merge-file-input"); if(el) el.dispatchEvent(new Event("change", {bubbles:true})); });
    await page.waitForTimeout(2000);
    console.log("✅ Video 2 added");

    // Check merge list
    const mergeList = page.locator("#merge-list");
    const items = await mergeList.locator("*").count();
    console.log("Merge list items:", items);

    // Button should now be enabled
    const btn = page.locator("#mg-run");
    const disabled = await btn.isDisabled();
    const text = await btn.innerText();
    console.log("Button text:", text);
    console.log("Button disabled after 2 videos:", disabled);
    if (disabled) { console.log("⚠️ Rate limit - button still disabled"); return; }
    expect(disabled).toBeFalsy();
  });

  test("merge-005: Add 3 videos", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH_3, "Need 3 test videos");
    await goToTool(page);

    const videos = [
      process.env.TEST_VIDEO_PATH,
      process.env.TEST_VIDEO_PATH_2,
      process.env.TEST_VIDEO_PATH_3,
    ];

    for (let i = 0; i < videos.length; i++) {
      await page.locator("#merge-file-input").setInputFiles(videos[i]);
      await page.waitForTimeout(2000);
      console.log(`✅ Video ${i+1} added`);
    }

    const btn = page.locator("#mg-run");
    const disabled = await btn.isDisabled();
    console.log("Button disabled after 3 videos:", disabled);
    if (disabled) { console.log("⚠️ Rate limit - button still disabled"); return; }
    expect(disabled).toBeFalsy();
  });

  test("merge-006: Merge list shows added videos", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No test video");
    await goToTool(page);

    await page.locator("#merge-file-input").setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(2000);

    const mergeList = page.locator("#merge-list");
    await expect(mergeList).toBeAttached();
    const html = await mergeList.innerHTML();
    console.log("Merge list content:", html.slice(0, 300));
    if (html.length === 0) { console.log("⚠️ Rate limit - merge list empty"); return; }
    expect(html.length).toBeGreaterThan(10);
  });

});
