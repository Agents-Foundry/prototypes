const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');
async function toBrowser(page) {
  await page.goto(url);
  for (let i = 0; i < 2; i++) await page.getByRole('button', {name:'Continue simulated review'}).click();
  await page.getByRole('button', {name:'Approve exact action'}).click();
  await page.getByRole('button', {name:'Continue with approved action'}).click();
}
for (const width of [320, 400, 480]) {
  for (const mode of ['offline', 'unknown', 'cancel-pending']) {
    test('reflow ' + width + ' ' + mode + ' retains safe actions', async ({page}) => {
      await page.setViewportSize({width, height:720});
      await toBrowser(page);
      if (mode === 'offline') await page.getByRole('button', {name:'Go offline'}).click();
      else if (mode === 'unknown') await page.getByRole('button', {name:'Browser timeout'}).click();
      else await page.getByRole('button', {name:'Request cancellation'}).click();
      await expect(page.getByRole('status')).toBeVisible();
      await expect(page.getByRole('button', {name:'Continue with approved action'})).toHaveCount(0);
      const sizes = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth
      }));
      expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
    });
  }
}
// Viewport emulation checks layout only, not actual browser zoom or assistive technology.
