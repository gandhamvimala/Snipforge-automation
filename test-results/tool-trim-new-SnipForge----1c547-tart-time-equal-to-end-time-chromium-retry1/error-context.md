# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tool-trim-new.spec.js >> SnipForge - trim new >> trim-009: Trim with start time equal to end time
- Location: src/tests/generated/scripts/tool-trim-new.spec.js:5:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
        - heading "Trim" [level=1] [ref=e351]
        - generic [ref=e352]:
          - generic [ref=e353]: 🔪
          - text: Trim
        - generic [ref=e354]: Cut start and end of your video
      - generic [ref=e356]:
        - generic [ref=e359]:
          - generic [ref=e360]: test-video-1.mp4
          - generic [ref=e361]:
            - generic [ref=e362]: Duration 0:10
            - generic [ref=e363]: Size 0.8 MB
        - button "Change" [ref=e364] [cursor=pointer]
      - generic [ref=e365]:
        - heading "Trim Points" [level=4] [ref=e366]
        - generic [ref=e367]:
          - generic [ref=e368]:
            - generic [ref=e369]: Start time (seconds)
            - spinbutton [ref=e370]: "5"
          - generic [ref=e371]:
            - generic [ref=e372]: End time (seconds)
            - spinbutton [ref=e373]: "5"
      - button "Process Trim" [active] [ref=e374] [cursor=pointer]: Trim Video ↵ Enter
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
  3  | async function goToTool(page) { await page.goto("/?tool=trim"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
  4  | test.describe("SnipForge - trim new", () => {
  5  | test('trim-009: Trim with start time equal to end time', async ({ page }) => {
  6  |   
  7  |   
  8  |   await goToTool(page);
  9  |   
  10 |   // Upload video
  11 |   await page.locator('#tr-file').setInputFiles(process.env.TEST_VIDEO_PATH);
  12 |   await page.waitForSelector('#panel-trim', { state: 'visible', timeout: 10000 });
  13 |   
  14 |   // Set start and end time to the same value
  15 |   await page.locator('#tr-start').fill('5');
  16 |   await page.locator('#tr-end').fill('5');
  17 |   
  18 |   // Click run button
  19 |   await page.locator('#tr-run').click();
  20 |   
  21 |   // Check for rate limit
  22 |   const btnText = await page.locator('#tr-run').innerText();
  23 |   if (btnText.includes('failed')) {
  24 |     return;
  25 |   }
  26 |   
  27 |   // Wait for processing
  28 |   await page.waitForTimeout(2000);
  29 |   
  30 |   // Verify error state or disabled button (equal times should be invalid)
  31 |   const runButton = page.locator('#tr-run');
  32 |   const isDisabled = await runButton.isDisabled().catch(() => false);
  33 |   
> 34 |   expect(isDisabled).toBe(true);
     |                      ^ Error: expect(received).toBe(expected) // Object.is equality
  35 | });
  36 | });
  37 | 
```