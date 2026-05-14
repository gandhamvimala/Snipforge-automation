# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tools.spec.js >> BUG-001: Tool pages should have H1 heading for accessibility
- Location: src/tests/generated/scripts/tools.spec.js:59:1

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - link "snip forge" [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e7]
      - text: snip
      - generic [ref=e9]: forge
    - link "Dashboard" [ref=e10] [cursor=pointer]:
      - /url: /dashboard
    - link "Pricing" [ref=e11] [cursor=pointer]:
      - /url: /pricing
    - link "Account" [ref=e12] [cursor=pointer]:
      - /url: /account
    - link "Logout" [ref=e13] [cursor=pointer]:
      - /url: /logout
    - generic [ref=e15]:
      - text: Siddharth
      - generic [ref=e16]: Pro
  - navigation [ref=e17]:
    - generic [ref=e18]: Record
    - generic [ref=e19] [cursor=pointer]:
      - img [ref=e21]
      - generic [ref=e24]: Screen Record
      - generic [ref=e25]: NEW
    - generic [ref=e26]: Edit
    - generic [ref=e27] [cursor=pointer]:
      - img [ref=e29]
      - generic [ref=e33]: AI Shorten
      - generic [ref=e34]: AI
    - generic [ref=e35] [cursor=pointer]:
      - img [ref=e37]
      - generic [ref=e40]: Trim
    - generic [ref=e41] [cursor=pointer]:
      - img [ref=e43]
      - generic [ref=e45]: Multi-Trim
    - generic [ref=e46] [cursor=pointer]:
      - img [ref=e48]
      - generic [ref=e50]: Speed
    - generic [ref=e51]: Transform
    - generic [ref=e52] [cursor=pointer]:
      - img [ref=e54]
      - generic [ref=e56]: Rotate / Flip
    - generic [ref=e57] [cursor=pointer]:
      - img [ref=e59]
      - generic [ref=e62]: Resize for Social
    - generic [ref=e63] [cursor=pointer]:
      - img [ref=e65]
      - generic [ref=e68]: Watermark
    - generic [ref=e69]: Files
    - generic [ref=e70] [cursor=pointer]:
      - img [ref=e72]
      - generic [ref=e75]: Merge
    - generic [ref=e76] [cursor=pointer]:
      - img [ref=e78]
      - generic [ref=e81]: Convert
    - generic [ref=e82] [cursor=pointer]:
      - img [ref=e84]
      - generic [ref=e86]: Compress
    - generic [ref=e87]: Audio
    - generic [ref=e88] [cursor=pointer]:
      - img [ref=e90]
      - generic [ref=e93]: Volume
    - generic [ref=e94] [cursor=pointer]:
      - img [ref=e96]
      - generic [ref=e99]: Noise Removal
      - generic [ref=e100]: NEW
    - generic [ref=e101] [cursor=pointer]:
      - img [ref=e103]
      - generic [ref=e107]: Extract Audio
    - generic [ref=e108] [cursor=pointer]:
      - img [ref=e110]
      - generic [ref=e113]: Mute
    - generic [ref=e114]: Create
    - generic [ref=e115] [cursor=pointer]:
      - img [ref=e117]
      - generic [ref=e120]: Video to GIF
    - generic [ref=e121] [cursor=pointer]:
      - img [ref=e123]
      - generic [ref=e127]: Background Music
    - generic [ref=e128] [cursor=pointer]:
      - img [ref=e130]
      - generic [ref=e133]: Text Overlay
    - generic [ref=e134] [cursor=pointer]:
      - img [ref=e136]
      - generic [ref=e138]: Blur Region
    - generic [ref=e139]: AI
    - generic [ref=e140] [cursor=pointer]:
      - img [ref=e142]
      - generic [ref=e145]: Transcribe
      - generic [ref=e146]: AI
    - generic [ref=e147] [cursor=pointer]:
      - img [ref=e149]
      - generic [ref=e151]: Smart Clip
      - generic [ref=e152]: AI
    - generic [ref=e153] [cursor=pointer]:
      - img [ref=e155]
      - generic [ref=e159]: Chapters & Meta
      - generic [ref=e160]: AI
    - generic [ref=e161] [cursor=pointer]:
      - img [ref=e163]
      - generic [ref=e166]: Auto Captions
      - generic [ref=e167]: AI
    - generic [ref=e168]: Edit
    - generic [ref=e169] [cursor=pointer]:
      - img [ref=e171]
      - generic [ref=e173]: Split Video
    - generic [ref=e174] [cursor=pointer]:
      - img [ref=e176]
      - generic [ref=e179]: Brightness
    - generic [ref=e180] [cursor=pointer]:
      - img [ref=e182]
      - generic [ref=e186]: Thumbnail
    - generic [ref=e187]: Share
    - generic [ref=e188] [cursor=pointer]:
      - img [ref=e190]
      - generic [ref=e195]: Shared Links
  - main [ref=e196]:
    - generic [ref=e197]:
      - generic [ref=e199]:
        - text: Choose a Tool
        - button "✕" [ref=e200] [cursor=pointer]
      - generic [ref=e201]: 🤖 AI
      - generic [ref=e202] [cursor=pointer]:
        - generic [ref=e203]: ✂️
        - generic [ref=e204]:
          - generic [ref=e205]: AI Shorten
          - generic [ref=e206]: Remove silences & filler words automatically
        - generic [ref=e207]: AI
      - generic [ref=e208] [cursor=pointer]:
        - generic [ref=e209]: 📝
        - generic [ref=e210]:
          - generic [ref=e211]: AI Transcribe
          - generic [ref=e212]: Convert speech to text in any language
        - generic [ref=e213]: AI
      - generic [ref=e214] [cursor=pointer]:
        - generic [ref=e215]: 🎯
        - generic [ref=e216]:
          - generic [ref=e217]: AI Smart Clip
          - generic [ref=e218]: Find the best highlight automatically
        - generic [ref=e219]: AI
      - generic [ref=e220] [cursor=pointer]:
        - generic [ref=e221]: 📋
        - generic [ref=e222]:
          - generic [ref=e223]: Chapters & Metadata
          - generic [ref=e224]: Generate YouTube chapters & titles
        - generic [ref=e225]: AI
      - generic [ref=e226] [cursor=pointer]:
        - generic [ref=e227]: 🎬
        - generic [ref=e228]:
          - generic [ref=e229]: Auto Captions
          - generic [ref=e230]: Burn subtitles into your video with Whisper AI
        - generic [ref=e231]: NEW
      - generic [ref=e232]: ✏️ Edit
      - generic [ref=e233] [cursor=pointer]:
        - generic [ref=e234]: 🔪
        - generic [ref=e235]:
          - generic [ref=e236]: Trim
          - generic [ref=e237]: Cut start and end of your video
      - generic [ref=e238] [cursor=pointer]:
        - generic [ref=e239]: 🎯
        - generic [ref=e240]:
          - generic [ref=e241]: Multi-Trim
          - generic [ref=e242]: Keep multiple sections and stitch them
      - generic [ref=e243] [cursor=pointer]:
        - generic [ref=e244]: ⚡
        - generic [ref=e245]:
          - generic [ref=e246]: Speed Control
          - generic [ref=e247]: Speed up or slow down your video
      - generic [ref=e248] [cursor=pointer]:
        - generic [ref=e249]: ✂️
        - generic [ref=e250]:
          - generic [ref=e251]: Split Video
          - generic [ref=e252]: Split into segments on a timeline
      - generic [ref=e253] [cursor=pointer]:
        - generic [ref=e254]: 🎨
        - generic [ref=e255]:
          - generic [ref=e256]: Brightness & Contrast
          - generic [ref=e257]: Adjust brightness, contrast, saturation
      - generic [ref=e258]: 🔀 Transform
      - generic [ref=e259] [cursor=pointer]:
        - generic [ref=e260]: 🔄
        - generic [ref=e261]:
          - generic [ref=e262]: Rotate / Flip
          - generic [ref=e263]: Fix orientation or mirror your video
      - generic [ref=e264] [cursor=pointer]:
        - generic [ref=e265]: 📐
        - generic [ref=e266]:
          - generic [ref=e267]: Resize for Social
          - generic [ref=e268]: Fit to YouTube, TikTok, Instagram
      - generic [ref=e269] [cursor=pointer]:
        - generic [ref=e270]: 🏷️
        - generic [ref=e271]:
          - generic [ref=e272]: Watermark
          - generic [ref=e273]: Add text watermark to your video
      - generic [ref=e274]: 🎬 Create
      - generic [ref=e275] [cursor=pointer]:
        - generic [ref=e276]: 🎞️
        - generic [ref=e277]:
          - generic [ref=e278]: Video to GIF
          - generic [ref=e279]: Convert your video into an animated GIF
      - generic [ref=e280] [cursor=pointer]:
        - generic [ref=e281]: 🎵
        - generic [ref=e282]:
          - generic [ref=e283]: Background Music
          - generic [ref=e284]: Mix an audio track into your video
      - generic [ref=e285] [cursor=pointer]:
        - generic [ref=e286]: ✏️
        - generic [ref=e287]:
          - generic [ref=e288]: Text Overlay
          - generic [ref=e289]: Add text at any position in your video
      - generic [ref=e290] [cursor=pointer]:
        - generic [ref=e291]: 🫥
        - generic [ref=e292]:
          - generic [ref=e293]: Blur Region
          - generic [ref=e294]: Blur faces or sensitive areas
      - generic [ref=e295] [cursor=pointer]:
        - generic [ref=e296]: 🖼
        - generic [ref=e297]:
          - generic [ref=e298]: Thumbnail Extractor
          - generic [ref=e299]: Extract best frames as high-quality JPGs
      - generic [ref=e300]: 📁 Files
      - generic [ref=e301] [cursor=pointer]:
        - generic [ref=e302]: 🔗
        - generic [ref=e303]:
          - generic [ref=e304]: Merge Videos
          - generic [ref=e305]: Combine multiple videos into one
      - generic [ref=e306] [cursor=pointer]:
        - generic [ref=e307]: 🔄
        - generic [ref=e308]:
          - generic [ref=e309]: Convert
          - generic [ref=e310]: Convert to MP4, MOV, WebM, GIF, MP3
      - generic [ref=e311] [cursor=pointer]:
        - generic [ref=e312]: 📦
        - generic [ref=e313]:
          - generic [ref=e314]: Compress
          - generic [ref=e315]: Reduce file size while keeping quality
      - generic [ref=e316]: 🔊 Audio
      - generic [ref=e317] [cursor=pointer]:
        - generic [ref=e318]: 🔊
        - generic [ref=e319]:
          - generic [ref=e320]: Volume Control
          - generic [ref=e321]: Boost or reduce audio volume
      - generic [ref=e322] [cursor=pointer]:
        - generic [ref=e323]: 🔕
        - generic [ref=e324]:
          - generic [ref=e325]: Noise Removal
          - generic [ref=e326]: Remove background noise from audio
      - generic [ref=e327] [cursor=pointer]:
        - generic [ref=e328]: 🎵
        - generic [ref=e329]:
          - generic [ref=e330]: Extract Audio
          - generic [ref=e331]: Pull the audio track as MP3
      - generic [ref=e332] [cursor=pointer]:
        - generic [ref=e333]: 🔇
        - generic [ref=e334]:
          - generic [ref=e335]: Mute Audio
          - generic [ref=e336]: Remove the audio track completely
      - generic [ref=e337]: ⏺ Record & Share
      - generic [ref=e338] [cursor=pointer]:
        - generic [ref=e339]: ⏺️
        - generic [ref=e340]:
          - generic [ref=e341]: Screen Recorder
          - generic [ref=e342]: Record screen, webcam, or both
        - generic [ref=e343]: NEW
      - generic [ref=e344] [cursor=pointer]:
        - generic [ref=e345]: 🔗
        - generic [ref=e346]:
          - generic [ref=e347]: Shared Links
          - generic [ref=e348]: Manage your shared video links
    - generic [ref=e349]:
      - generic [ref=e350]:
        - generic [ref=e351]:
          - generic [ref=e352]: 🔪
          - text: Trim
        - generic [ref=e353]: Cut start and end of your video
      - generic [ref=e354] [cursor=pointer]:
        - button "Choose File" [ref=e355]
        - generic [ref=e356]: 🔪
        - heading "Drop your video here" [level=3] [ref=e357]
        - paragraph [ref=e358]: MP4 · MOV · WebM · AVI
      - generic [ref=e359]:
        - heading "Trim Points" [level=4] [ref=e360]
        - generic [ref=e361]:
          - generic [ref=e362]:
            - generic [ref=e363]: Start time (seconds)
            - spinbutton [ref=e364]: "0"
          - generic [ref=e365]:
            - generic [ref=e366]: End time (seconds)
            - spinbutton [ref=e367]: "0"
      - button "Upload a video first" [disabled] [ref=e368]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.use({ baseURL: 'https://snipforge.video' });
  4   | 
  5   | // Login before all tests
  6   | test.beforeEach(async ({ page }) => {
  7   |   await page.goto('/login');
  8   |   await page.locator('#email').fill(process.env.TEST_EMAIL || '');
  9   |   await page.locator('#password').fill(process.env.TEST_PASSWORD || '');
  10  |   await page.locator('.submit-btn').click();
  11  |   await page.waitForURL('https://snipforge.video/', { timeout: 15000 });
  12  | });
  13  | 
  14  | const tools = [
  15  |   { id: 'trim',          name: 'Trim',              category: 'edit' },
  16  |   { id: 'multi-trim',    name: 'Multi-Trim',         category: 'edit' },
  17  |   { id: 'speed',         name: 'Speed',              category: 'edit' },
  18  |   { id: 'split',         name: 'Split',              category: 'edit' },
  19  |   { id: 'rotate-flip',   name: 'Rotate',             category: 'transform' },
  20  |   { id: 'resize',        name: 'Resize',             category: 'transform' },
  21  |   { id: 'watermark',     name: 'Watermark',          category: 'transform' },
  22  |   { id: 'merge',         name: 'Merge',              category: 'files' },
  23  |   { id: 'convert',       name: 'Convert',            category: 'files' },
  24  |   { id: 'compress',      name: 'Compress',           category: 'files' },
  25  |   { id: 'volume',        name: 'Volume',             category: 'audio' },
  26  |   { id: 'noise-removal', name: 'Noise Removal',      category: 'audio' },
  27  |   { id: 'extract-audio', name: 'Extract Audio',      category: 'audio' },
  28  |   { id: 'mute',          name: 'Mute',               category: 'audio' },
  29  |   { id: 'video-to-gif',  name: 'Video to GIF',       category: 'convert' },
  30  |   { id: 'bg-music',      name: 'Background Music',   category: 'audio' },
  31  |   { id: 'text-overlay',  name: 'Text Overlay',       category: 'edit' },
  32  |   { id: 'blur-region',   name: 'Blur Region',        category: 'edit' },
  33  |   { id: 'brightness',    name: 'Brightness',         category: 'edit' },
  34  |   { id: 'thumbnail',     name: 'Thumbnail',          category: 'files' },
  35  |   { id: 'ai-shorten',    name: 'AI Shorten',         category: 'ai' },
  36  |   { id: 'ai-transcribe', name: 'AI Transcribe',      category: 'ai' },
  37  |   { id: 'smart-clip',    name: 'Smart Clip',         category: 'ai' },
  38  |   { id: 'ai-chapters',   name: 'AI Chapters',        category: 'ai' },
  39  |   { id: 'auto-captions', name: 'Auto Captions',      category: 'ai' },
  40  | ];
  41  | 
  42  | // ── SMOKE: All tools load correctly ─────────────────────────────────────────
  43  | for (const tool of tools) {
  44  |   test(`TOOL-SMOKE-${tool.id}: ${tool.name} tool page loads correctly`, async ({ page }) => {
  45  |     await page.goto(`/?tool=${tool.id}`);
  46  |     await page.waitForLoadState('networkidle');
  47  |     await page.waitForTimeout(1000);
  48  | 
  49  |     // URL should contain tool param
  50  |     await expect(page).toHaveURL(new RegExp(`tool=${tool.id}`));
  51  | 
  52  |     // Upload zone should be visible
  53  |     const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  54  |     await expect(uploadZone).toBeVisible({ timeout: 10000 });
  55  |   });
  56  | }
  57  | 
  58  | // ── BUG-001: Missing H1 on all tool pages ───────────────────────────────────
  59  | test('BUG-001: Tool pages should have H1 heading for accessibility', async ({ page }) => {
  60  |   await page.goto('/?tool=trim');
  61  |   await page.waitForLoadState('networkidle');
  62  |   await page.waitForTimeout(1000);
  63  |   const h1 = page.locator('h1');
  64  |   // This test documents the bug — h1 is missing
  65  |   const count = await h1.count();
  66  |   console.log(`H1 count on tool page: ${count}`);
> 67  |   expect(count).toBeGreaterThan(0); // EXPECTED TO FAIL — BUG CONFIRMED
      |                 ^ Error: expect(received).toBeGreaterThan(expected)
  68  | });
  69  | 
  70  | // ── BUG-002: Download links are href="#" (broken) ───────────────────────────
  71  | test('BUG-002: Download links should not use href="#"', async ({ page }) => {
  72  |   await page.goto('/dashboard');
  73  |   await page.waitForLoadState('networkidle');
  74  |   await page.waitForTimeout(2000);
  75  | 
  76  |   const brokenLinks = await page.$$eval('a[href="#"]', els =>
  77  |     els.map(e => e.innerText.trim()).filter(t => t.includes('Download'))
  78  |   );
  79  |   console.log(`Found ${brokenLinks.length} broken download links with href="#"`);
  80  |   console.log('Broken links:', brokenLinks);
  81  |   // Document the bug
  82  |   expect(brokenLinks.length).toBe(0); // EXPECTED TO FAIL — BUG CONFIRMED
  83  | });
  84  | 
  85  | // ── BUG-003: Process button disabled state ──────────────────────────────────
  86  | test('BUG-003: Process button should show clear disabled state before upload', async ({ page }) => {
  87  |   await page.goto('/?tool=speed');
  88  |   await page.waitForLoadState('networkidle');
  89  |   await page.waitForTimeout(1000);
  90  | 
  91  |   const processBtn = page.getByText('Upload a video first');
  92  |   await expect(processBtn).toBeVisible();
  93  |   const isDisabled = await processBtn.isDisabled();
  94  |   console.log(`Process button disabled: ${isDisabled}`);
  95  |   // Button exists but check if properly disabled
  96  |   expect(isDisabled).toBeTruthy();
  97  | });
  98  | 
  99  | // ── BUG-004: Tool URLs return 404 without login ─────────────────────────────
  100 | test('BUG-004: /tools/trim returns 404 instead of redirecting to login', async ({ page }) => {
  101 |   // Use fresh context without login
  102 |   await page.context().clearCookies();
  103 |   const response = await page.goto('https://snipforge.video/tools/trim');
  104 |   const status = response?.status();
  105 |   console.log(`/tools/trim status without login: ${status}`);
  106 |   // This should redirect to login (302/200) not return 404
  107 |   expect(status).not.toBe(404); // EXPECTED TO FAIL — BUG CONFIRMED
  108 | });
  109 | 
  110 | // ── BUG-005: Tool URL pattern inconsistency ──────────────────────────────────
  111 | test('BUG-005: Tool URLs use ?tool= param not /tools/ path as advertised', async ({ page }) => {
  112 |   // The site advertises /tools/trim but actual SPA uses ?tool=trim
  113 |   await page.goto('/?tool=trim');
  114 |   await page.waitForLoadState('networkidle');
  115 |   const url = page.url();
  116 |   console.log(`Real tool URL pattern: ${url}`);
  117 |   // Verify the correct pattern works
  118 |   await expect(page).toHaveURL(/tool=trim/);
  119 | });
  120 | 
  121 | // ── FUNCTIONAL: Upload zone is interactive ──────────────────────────────────
  122 | test('FUNC-001: Upload zone is clickable on all tool pages', async ({ page }) => {
  123 |   const toolsToCheck = ['trim', 'speed', 'convert', 'ai-shorten', 'compress'];
  124 |   for (const tool of toolsToCheck) {
  125 |     await page.goto(`/?tool=${tool}`);
  126 |     await page.waitForTimeout(1000);
  127 |     const zone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  128 |     await expect(zone).toBeVisible({ timeout: 8000 });
  129 |     console.log(`✅ ${tool}: upload zone visible`);
  130 |   }
  131 | });
  132 | 
  133 | // ── FUNCTIONAL: Dashboard navigation ────────────────────────────────────────
  134 | test('FUNC-002: Dashboard loads with tool navigation sidebar', async ({ page }) => {
  135 |   await page.goto('/dashboard');
  136 |   await page.waitForLoadState('networkidle');
  137 |   await expect(page).toHaveURL(/dashboard/);
  138 |   await expect(page).toHaveTitle(/snipforge/i);
  139 | });
  140 | 
  141 | // ── FUNCTIONAL: AI tools require Pro badge ──────────────────────────────────
  142 | test('FUNC-003: AI tools are accessible on Pro plan', async ({ page }) => {
  143 |   await page.goto('/?tool=ai-shorten');
  144 |   await page.waitForLoadState('networkidle');
  145 |   await page.waitForTimeout(1000);
  146 |   // Should load the tool, not show upgrade prompt
  147 |   const uploadZone = page.locator('[class*="drop"],[class*="upload"],[class*="zone"]').first();
  148 |   await expect(uploadZone).toBeVisible({ timeout: 10000 });
  149 | });
  150 | 
  151 | 
```