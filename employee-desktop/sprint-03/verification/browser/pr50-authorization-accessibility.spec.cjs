const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');
async function permission(page) {
  await page.goto(url);
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
}
async function browser(page) {
  await permission(page);
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  await page.getByRole('button', { name: 'Continue with approved action' }).click();
}
for (const [name, button, expected] of [
  ['target mutation', 'Simulate changed Jira target', 'Action target changed'],
  ['credential revocation', 'Revoke credential', 'revoked'],
  ['approval expiry', 'Expire approval', 'expired']
]) {
  test(name + ' blocks privileged continuation', async ({ page }) => {
    await permission(page);
    await page.getByRole('button', { name: button }).click();
    if (name === 'target mutation') await expect(page.getByRole('status')).toContainText(expected);
    await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
    await expect(page.locator('#auth')).toContainText('Scoped read-only');
  });
}
test('environment switch invalidates previous authorization', async ({ page }) => {
  await browser(page);
  await page.getByRole('button', { name: 'Simulate environment switch' }).click();
  await expect(page.getByRole('status')).toContainText('previous authorization is invalid');
  await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
});
test('recovery status is accessible and action focus returns to heading', async ({ page }) => {
  await browser(page);
  await page.getByRole('button', { name: 'Browser timeout' }).click();
  await expect(page.getByRole('status')).toContainText('Remote outcome unknown');
  await expect(page.locator('#heading')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Outcome still unknown — do not retry' })).toBeVisible();
});
test('narrow viewport recovery screen avoids horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await browser(page);
  await page.getByRole('button', { name: 'Go offline' }).click();
  const dims = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth
  }));
  expect(dims.content).toBeLessThanOrEqual(dims.viewport);
  await expect(page.getByRole('status')).toBeVisible();
});
