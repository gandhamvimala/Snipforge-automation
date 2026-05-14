// config/site-map.js
// Complete knowledge map of snipforge.video
export const SITE = {
  baseUrl: 'https://snipforge.video',

  pages: {
    home:     '/',
    pricing:  '/pricing',
    login:    '/login',
    register: '/register',
    dashboard: '/dashboard',
  },

  tools: [
    // AI Tools
    { id: 'ai-shorten',   path: '/tools/ai-shorten',   name: 'AI Shorten',      category: 'ai',    description: 'Remove silences and filler words automatically' },
    { id: 'ai-transcribe',path: '/tools/ai-transcribe', name: 'AI Transcribe',   category: 'ai',    description: 'Speech to text in 20 languages' },
    { id: 'smart-clip',   path: '/tools/smart-clip',    name: 'AI Smart Clip',   category: 'ai',    description: 'Auto-finds the most engaging 30-60s highlight' },
    { id: 'ai-chapters',  path: '/tools/ai-chapters',   name: 'AI Chapters',     category: 'ai',    description: 'Generate YouTube chapters, titles, descriptions' },
    { id: 'auto-captions',path: '/tools/auto-captions', name: 'Auto Captions',   category: 'ai',    description: 'Transcribe with Whisper AI and burn subtitles' },
    // Video Tools
    { id: 'trim',         path: '/tools/trim',          name: 'Trim',            category: 'video', description: 'Cut video to exact start and end points' },
    { id: 'multi-trim',   path: '/tools/multi-trim',    name: 'Multi-Trim',      category: 'video', description: 'Keep multiple sections and stitch together' },
    { id: 'speed',        path: '/tools/speed',         name: 'Speed',           category: 'video', description: 'Speed up or slow down your video' },
    { id: 'split',        path: '/tools/split',         name: 'Split',           category: 'video', description: 'Cut one video into multiple segments' },
    { id: 'rotate-flip',  path: '/tools/rotate-flip',   name: 'Rotate/Flip',     category: 'video', description: 'Fix video orientation in one click' },
    { id: 'resize',       path: '/tools/resize',        name: 'Resize for Social', category: 'video', description: 'Crop to 16:9, 9:16, 1:1 for any platform' },
    { id: 'watermark',    path: '/tools/watermark',     name: 'Watermark',       category: 'video', description: 'Brand your videos with custom text' },
    { id: 'merge',        path: '/tools/merge',         name: 'Merge',           category: 'video', description: 'Stitch multiple clips into one video' },
    { id: 'convert',      path: '/tools/convert',       name: 'Convert',         category: 'video', description: 'MP4, MOV, WebM, AVI and more' },
    { id: 'compress',     path: '/tools/compress',      name: 'Compress',        category: 'video', description: 'Reduce file size without losing quality' },
    { id: 'volume',       path: '/tools/volume',        name: 'Volume',          category: 'video', description: 'Adjust audio levels precisely' },
    { id: 'noise-removal',path: '/tools/noise-removal', name: 'Noise Removal',   category: 'video', description: 'Clean up background hiss and hum' },
    { id: 'extract-audio',path: '/tools/extract-audio', name: 'Extract Audio',   category: 'video', description: 'Pull the audio track out as MP3' },
    { id: 'mute',         path: '/tools/mute',          name: 'Mute',            category: 'video', description: 'Remove the audio track entirely' },
    { id: 'video-to-gif', path: '/tools/video-to-gif',  name: 'Video to GIF',   category: 'video', description: 'Convert video clips to animated GIFs' },
    { id: 'bg-music',     path: '/tools/bg-music',      name: 'Background Music',category: 'video', description: 'Mix music into your video at custom volume' },
    { id: 'text-overlay', path: '/tools/text-overlay',  name: 'Text Overlay',    category: 'video', description: 'Add text anywhere on your video' },
    { id: 'blur-region',  path: '/tools/blur-region',   name: 'Blur Region',     category: 'video', description: 'Blur faces or sensitive areas' },
    { id: 'brightness',   path: '/tools/brightness',    name: 'Brightness & Contrast', category: 'video', description: 'Adjust brightness, contrast and saturation' },
    { id: 'thumbnail',    path: '/tools/thumbnail',     name: 'Thumbnail Extractor', category: 'video', description: 'Extract best frames as high-quality JPGs' },
  ],

  plans: {
    free: { price: 0, videosPerMonth: 3, maxDuration: 300, allTools: true },
    pro:  { price: 5, videosPerMonth: -1, maxDuration: -1, allTools: true, ai: true, priority: true },
    team: { price: 15, seats: 5, everything: 'pro', sharedWorkspace: true },
  },

  // Selector strategies — primary and fallbacks
  selectors: {
    nav: {
      logo:     ['a[href="/"]', 'a:has-text("snip forge")', 'header a:first-child'],
      pricing:  ['a[href="/pricing"]', 'a:has-text("Pricing")'],
      login:    ['a[href="/login"]', 'a:has-text("Log in")', 'a:has-text("Login")'],
      register: ['a[href="/register"]', 'a:has-text("Start free")', 'a:has-text("Sign up")'],
    },
    auth: {
      emailInput:    ['input[type="email"]', 'input[name="email"]', '#email'],
      passwordInput: ['input[type="password"]', 'input[name="password"]', '#password'],
      submitBtn:     ['button[type="submit"]', 'button:has-text("Log in")', 'button:has-text("Sign in")'],
      registerBtn:   ['button[type="submit"]', 'button:has-text("Create account")', 'button:has-text("Sign up")'],
    },
    dashboard: {
      toolCards: ['.tool-card', '[data-tool]', 'a[href^="/tools/"]'],
      recentProjects: ['.recent-projects', '[data-recent]', 'section:has-text("Recent")'],
    },
    pricing: {
      freePlan:  ['.plan-free', '[data-plan="free"]', 'div:has-text("Free"):has(button)'],
      proPlan:   ['.plan-pro', '[data-plan="pro"]', 'div:has-text("Pro"):has(button)'],
      teamPlan:  ['.plan-team', '[data-plan="team"]', 'div:has-text("Team"):has(button)'],
      getStarted: ['a:has-text("Get started")', 'button:has-text("Get started")'],
    },
    tools: {
      uploadZone:    ['[data-upload]', '.upload-zone', 'input[type="file"]', '[class*="upload"]', '[class*="dropzone"]'],
      processBtn:    ['button:has-text("Process")', 'button:has-text("Apply")', 'button:has-text("Convert")', 'button[type="submit"]:visible'],
      downloadBtn:   ['a:has-text("Download")', 'button:has-text("Download")', '[data-download]'],
      progressBar:   ['.progress', '[role="progressbar"]', '[class*="progress"]'],
    },
  },
};

export const AI_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  apiUrl: 'https://api.anthropic.com/v1/messages',
  maxTokens: 4000,
};
