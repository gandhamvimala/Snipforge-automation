import { expect } from '@playwright/test';

export async function selectorWithFallback(page, selectors, timeout = 8000) {
  for (const selector of selectors) {
    try {
      const loc = page.locator(selector);
      await loc.waitFor({ state: 'visible', timeout: timeout / selectors.length });
      return loc;
    } catch {}
  }
  throw new Error(`No selector matched: ${selectors.join(', ')}`);
}

export async function navigate(page, path) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
}

export async function assertTitle(page, pattern) {
  const title = await page.title();
  expect(new RegExp(pattern, 'i').test(title)).toBeTruthy();
}
