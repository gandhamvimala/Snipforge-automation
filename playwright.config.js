import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/generated/scripts',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'src/reports/html', open: 'never' }]],
  use: {
    baseURL: 'https://snipforge.video',
    headless: true,
    screenshot: 'only-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    launchOptions: {
      slowMo: 500,
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});
