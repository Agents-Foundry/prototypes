const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

async function toPermission(page) {
  await page.goto(url);
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
}

test('approval receipt receives focus and cancel returns to unapproved state', async ({ page }) => {
  await toPermission(page);
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  const receipt = page.getByRole('heading', { name: 'Review simulated one-time approval receipt' });
  await expect(receipt).toBeFocused();
  await expect(page.locator('#approval-receipt')).toContainText('Single use');
  await page.getByRole('button', { name: 'Cancel approval' }).click();
  await expect(page.getByRole('heading', { name: 'Review simulated one-time approval receipt' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  await expect(receipt).toBeFocused();
});

test('policy change denies stale approval and requires a fresh request', async ({ page }) => {
  await toPermission(page);
  await page.getByRole('button', { name: 'Simulate policy change' }).click();
  await expect(page.getByRole('status')).toContainText('Authorization policy changed');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Request fresh approval' }).click();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toBeVisible();
});

test('offline cache corruption fails closed until fresh online authorization', async ({ page }) => {
  await toPermission(page);
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  await page.getByRole('button', { name: 'Continue with approved action' }).click();
  await page.getByRole('button', { name: 'Go offline' }).click();
  await page.getByRole('button', { name: 'Simulate unreadable encrypted cache' }).click();
  await expect(page.getByRole('status')).toContainText('access denied');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reconnect for fresh authorization' }).click();
  await expect(page.getByRole('status')).toContainText('Authorization policy changed');
  await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
});

test('cross-device conflict blocks replay and remains read-only', async ({ page }) => {
  await toPermission(page);
  await page.getByRole('button', { name: 'Simulate cross-device conflict' }).click();
  await expect(page.getByRole('status')).toContainText('do not overwrite or replay automatically');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Keep local read-only; review conflict' }).click();
  await expect(page.getByRole('button', { name: 'Return to review' })).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
