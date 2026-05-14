import { test, expect } from "@playwright/test";

test.use({
  baseURL: "https://snipforge.video",
  storageState: "/tmp/auth-state.json"
});

// Real panel names used by the SPA
const ALL_TOOLS = [
  { id: "trim",         panel: "trim" },
  { id: "multi-trim",   panel: "multitrim" },
  { id: "speed",        panel: "speed" },
  { id: "split",        panel: "split" },
  { id: "rotate-flip",  panel: "rotate" },
  { id: "resize",       panel: "crop" },
  { id: "watermark",    panel: "watermark" },
  { id: "merge",        panel: "merge",        skipZone: true },
  { id: "convert",      panel: "convert" },
  { id: "compress",     panel: "compress" },
  { id: "volume",       panel: "volume" },
  { id: "noise-removal",panel: "denoise" },
  { id: "extract-audio",panel: "audio" },
  { id: "mute",         panel: "mute" },
  { id: "video-to-gif", panel: "gif" },
  { id: "bg-music",     panel: "bgmusic" },
  { id: "text-overlay", panel: "textoverlay" },
  { id: "blur-region",  panel: "blur" },
  { id: "brightness",   panel: "colorgrade" },
  { id: "thumbnail",    panel: "thumbnail" },
  { id: "ai-shorten",   panel: "shorten" },
  { id: "ai-transcribe",panel: "transcribe" },
  { id: "smart-clip",   panel: "smartclip" },
  { id: "ai-chapters",  panel: "aianalyze" },
  { id: "auto-captions",panel: "autocaptions" },
];

async function goToTool(page, panel) {
  await page.goto(`/?tool=${panel}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

// Get upload zone for the ACTIVE panel only
async function getActiveUploadZone(page, panel) {
  return page.locator(`#panel-${panel} .upload-zone`);
}

// Get process button for a specific panel
async function getProcessButton(page, panel) {
  return page.locator(`#panel-${panel} .run-btn`);
}

test.describe("SnipForge - Smoke: All 25 Tools", () => {

  test("SMOKE-001: All 25 tool URLs load without error", async ({ page }) => {
    const failed = [];
    for (const tool of ALL_TOOLS) {
      await page.goto(`/?tool=${tool.panel}`);
      await page.waitForLoadState("networkidle");
      const title = await page.title();
      const is404 = title.includes("404") || title.includes("Not Found");
      console.log(is404 ? "❌ FAIL" : "✅ PASS", tool.id);
      if (is404) failed.push(tool.id);
    }
    expect(failed.length, "Tools with 404: " + failed.join(", ")).toBe(0);
  });

  test("SMOKE-002: All 25 tools show active upload zone", async ({ page }) => {
    const missing = [];
    for (const tool of ALL_TOOLS) {
      await goToTool(page, tool.panel);
      if (tool.skipZone) {
        console.log("⏭️  SKIP", tool.id, "uses multi-file input not dropzone");
        continue;
      }
      const zone = await getActiveUploadZone(page, tool.panel);
      const visible = await zone.isVisible().catch(() => false);
      console.log(visible ? "✅ PASS" : "❌ FAIL", tool.id, "upload zone");
      if (!visible) missing.push(tool.id);
    }
    expect(missing.length, "Missing upload zone: " + missing.join(", ")).toBe(0);
  });

  test("SMOKE-003: All 25 tools show process button", async ({ page }) => {
    const missing = [];
    for (const tool of ALL_TOOLS) {
      await goToTool(page, tool.panel);
      const btn = await getProcessButton(page, tool.panel);
      const visible = await btn.isVisible().catch(() => false);
      console.log(visible ? "✅ PASS" : "❌ FAIL", tool.id, "button");
      if (!visible) missing.push(tool.id);
    }
    expect(missing.length, "Missing buttons: " + missing.join(", ")).toBe(0);
  });

  test("SMOKE-004: All 25 tools have page title", async ({ page }) => {
    const missing = [];
    for (const tool of ALL_TOOLS) {
      await goToTool(page, tool.panel);
      const title = await page.title();
      const ok = title && !title.includes("404");
      console.log(ok ? "✅ PASS" : "❌ FAIL", tool.id, "->", title);
      if (!ok) missing.push(tool.id);
    }
    expect(missing.length, "Bad titles: " + missing.join(", ")).toBe(0);
  });

});

test.describe("SnipForge - Bug Verification", () => {

  test("BUG-001: Tool pages have H1 heading for accessibility", async ({ page }) => {
    await goToTool(page, "trim");
    const count = await page.locator("h1").count();
    console.log("H1 count on tool page:", count);
    expect(count).toBeGreaterThan(0);
  });

  test("BUG-002: Dashboard has no broken href=# download links", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const broken = await page.$$eval('a[href="#"]', els =>
      els.map(e => e.innerText.trim()).filter(t => t.toLowerCase().includes("download"))
    );
    console.log("Broken download links:", broken.length);
    expect(broken.length).toBe(0);
  });

  test("BUG-003: Process button disabled before upload on Speed tool", async ({ page }) => {
    await goToTool(page, "speed");
    const btn = page.locator("#sp-run");
    await expect(btn).toBeVisible();
    const disabled = await btn.isDisabled();
    console.log("Speed process button disabled:", disabled);
    expect(disabled).toBeTruthy();
  });

  test("BUG-004: /tools/* redirects instead of returning 404", async ({ page }) => {
    await page.context().clearCookies();
    const res = await page.goto("https://snipforge.video/tools/trim");
    console.log("/tools/trim status:", res?.status());
    expect(res?.status()).not.toBe(404);
  });

  test("BUG-005: Process buttons have unique aria-labels", async ({ page }) => {
    await goToTool(page, "speed");
    const btns = await page.$$eval(".run-btn", els =>
      els.map(e => e.getAttribute("aria-label")).filter(Boolean)
    );
    console.log("Buttons with aria-label:", btns.length);
    const unique = new Set(btns).size;
    console.log("Unique aria-labels:", unique);
    expect(btns.length).toBeGreaterThan(0);
    expect(unique).toBe(btns.length);
  });

});

test.describe("SnipForge - Upload Tests", () => {

  test("UPLOAD-001: Upload zone clickable on 5 key tools", async ({ page }) => {
    const tools = [
      { id: "trim", panel: "trim" },
      { id: "speed", panel: "speed" },
      { id: "convert", panel: "convert" },
      { id: "compress", panel: "compress" },
      { id: "ai-shorten", panel: "shorten" },
    ];
    for (const tool of tools) {
      await goToTool(page, tool.panel);
      const zone = page.locator(`#panel-${tool.panel} .upload-zone`);
      await expect(zone).toBeVisible({ timeout: 8000 });
      console.log("✅ PASS:", tool.id, "upload zone ready");
    }
  });

  test("UPLOAD-002: File input exists on all tool panels", async ({ page }) => {
    const missing = [];
    for (const tool of ALL_TOOLS) {
      await goToTool(page, tool.panel);
      const count = await page.locator(`#panel-${tool.panel} input[type=file]`).count();
      console.log(count > 0 ? "✅ PASS" : "❌ FAIL", tool.id, "file input:", count);
      if (count === 0) missing.push(tool.id);
    }
    expect(missing.length, "Tools missing file input: " + missing.join(", ")).toBe(0);
  });

  test("UPLOAD-003: Real video upload on Speed tool", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No TEST_VIDEO_PATH set");
    await goToTool(page, "speed");
    const fileInput = page.locator("#panel-speed input[type=file]");
    await fileInput.setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#sp-run");
    const stillDisabled = await btn.isDisabled();
    console.log("After upload, button still disabled:", stillDisabled);
    expect(stillDisabled).toBeFalsy();
  });

  test("UPLOAD-004: Real video upload on Trim tool", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No TEST_VIDEO_PATH set");
    await goToTool(page, "trim");
    const fileInput = page.locator("#panel-trim input[type=file]");
    await fileInput.setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#tr-run");
    const stillDisabled = await btn.isDisabled();
    console.log("After upload, button still disabled:", stillDisabled);
    expect(stillDisabled).toBeFalsy();
  });

  test("UPLOAD-005: Real video upload on Convert tool", async ({ page }) => {
    test.skip(!process.env.TEST_VIDEO_PATH, "No TEST_VIDEO_PATH set");
    await goToTool(page, "convert");
    const fileInput = page.locator("#panel-convert input[type=file]");
    await fileInput.setInputFiles(process.env.TEST_VIDEO_PATH);
    await page.waitForTimeout(3000);
    const btn = page.locator("#cv-run");
    const stillDisabled = await btn.isDisabled();
    console.log("After upload, button still disabled:", stillDisabled);
    expect(stillDisabled).toBeFalsy();
  });

});
