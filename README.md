# SnipForge Automation Framework 🤖

AI-powered end-to-end test automation for [snipforge.video](https://snipforge.video) — with automatic scenario generation, script writing, self-healing, and smart regression selection.

---

## Architecture

```
snipforge-automation/
├── config/
│   └── site-map.js          # Full site map: pages, tools, selectors
├── src/
│   ├── agents/
│   │   ├── scenario-generator.js  # 🤖 AI generates test scenarios
│   │   ├── script-writer.js       # ✍️  AI writes Playwright scripts
│   │   ├── test-runner.js         # ▶️  Runs scripts, captures failures
│   │   ├── self-healer.js         # 🔧 AI fixes broken selectors
│   │   └── regression-runner.js   # 🔁 AI selects & runs regression
│   ├── tests/
│   │   ├── generated/scripts/     # Auto-generated test scripts
│   │   ├── healed/                # Self-healed script versions
│   │   └── examples/              # Example scripts (home, smart-clip)
│   ├── utils/
│   │   └── helpers.js             # Shared utilities, selectorWithFallback
│   └── reports/
│       ├── html/                  # Playwright HTML report
│       ├── results/               # JSON run results
│       └── healing-log.json       # Self-healing history
├── scripts/
│   └── full-cycle.js              # Full pipeline orchestrator
└── playwright.config.js
```

---

## Quick Start

### 1. Install

```bash
npm install
npm run install:browsers   # Install Chromium
```

### 2. Set environment variables

```bash
export TEST_EMAIL=yourtest@email.com
export TEST_PASSWORD=yourpassword
export TEST_VIDEO_PATH=/path/to/sample.mp4   # Optional, for upload tests
```

### 3. Run the full AI pipeline

```bash
npm run full-cycle
```

This runs all 5 steps automatically:
1. 🤖 AI generates scenarios  
2. ✍️  AI writes Playwright scripts  
3. ▶️  Tests run  
4. 🔧 Self-healer fixes any failures  
5. 🔁 Regression suite runs

---

## Individual Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | AI generates scenarios for all pages + first 5 tools |
| `npm run generate -- --tool trim` | Generate scenarios for a specific tool |
| `npm run write` | AI converts scenarios → Playwright scripts |
| `npm run run` | Run all generated scripts |
| `npm run run -- --headed` | Run with browser visible |
| `npm run heal` | AI self-healer fixes broken selectors |
| `npm run run:regression` | AI selects and runs regression suite |
| `npm run run:regression daily` | Daily regression (all high+critical) |
| `npm run run:regression pr` | PR regression (smoke + recent failures) |

---

## AI Agents Explained

### 🤖 Scenario Generator (`scenario-generator.js`)
Calls Claude to generate structured test scenarios from the site map.  
Output: `src/tests/generated/scenarios.json`

Each scenario includes:
- Priority: `critical | high | medium | low`
- Category: `smoke | functional | regression | edge`
- Steps, expected result, preconditions, test data

### ✍️ Script Writer (`script-writer.js`)
Converts JSON scenarios into executable Playwright `.spec.js` files using Claude.

Features:
- Resilient selectors via `selectorWithFallback()`
- Auto-screenshot on failure
- Environment-based auth credentials
- Upload test skip if no video provided

### 🔧 Self-Healer (`self-healer.js`)
When tests fail, the healer:
1. Parses failure reports from `src/reports/results/`
2. Classifies: `selector_broken | timeout | assertion | network`
3. Sends broken code to Claude with site context
4. Applies the AI-suggested fix
5. Writes healed script to `src/tests/healed/`
6. Logs everything to `healing-log.json`

### 🔁 Regression Runner (`regression-runner.js`)
Asks Claude to intelligently select which tests to run based on:
- All critical/smoke tests (always included)
- Recently failed tests (last 5 runs)
- Core feature coverage: upload → process → download
- Time budget (target ≤20 minutes)

Falls back to priority-based selection if AI unavailable.

---

## Supported Pages & Tools

### Pages (4)
- `/` — Home
- `/pricing` — Pricing
- `/login` — Login
- `/register` — Register

### AI Tools (5)
AI Shorten, AI Transcribe, AI Smart Clip, AI Chapters, Auto Captions

### Video Tools (20)
Trim, Multi-Trim, Speed, Split, Rotate/Flip, Resize for Social, Watermark, Merge, Convert, Compress, Volume, Noise Removal, Extract Audio, Mute, Video to GIF, Background Music, Text Overlay, Blur Region, Brightness & Contrast, Thumbnail Extractor

---

## Selector Strategy (Self-Healing)

All tests use `selectorWithFallback()` which tries selectors in order:

```
data-testid  →  ARIA role  →  CSS class  →  href  →  text content
```

When a selector breaks (UI change), the self-healer:
1. Detects the failure type
2. Asks Claude for alternative selectors
3. Updates the script automatically
4. Re-runs to verify

---

## Adding New Tools

```bash
# 1. Add to config/site-map.js tools array
# 2. Generate scenarios
npm run generate -- --tool new-tool-id
# 3. Write scripts
npm run write
# 4. Run
npm run run
```

---

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Run SnipForge Automation
  run: |
    npm ci
    npm run install:browsers
    npm run full-cycle
  env:
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
    CI: true
```

---

## Reports

| Report | Location |
|--------|----------|
| HTML Report | `src/reports/html/index.html` |
| JSON Results | `src/reports/results/` |
| Healing Log | `src/reports/healing-log.json` |
| Regression History | `src/reports/regression-history.json` |
| Cycle Summary | `src/reports/cycle-summary.json` |

---

## Tech Stack

- **Test Framework**: [Playwright](https://playwright.dev) + @playwright/test
- **AI Engine**: Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Runtime**: Node.js ESM
- **Site**: [snipforge.video](https://snipforge.video)
