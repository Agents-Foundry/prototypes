const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

async function browserStage(page) {
  await page.goto(url);
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  await expect(page.getByRole('heading', { name: 'Review simulated one-time approval receipt' })).toBeFocused();
  await page.getByRole('button', { name: 'Continue with approved action' }).click();
  await expect(page.getByRole('button', { name: 'Browser timeout' })).toBeVisible();
}

async function assertNoAutomaticReplay(page) {
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
}

test('unknown browser outcome is reconciled or blocked, never auto-retried', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Browser timeout' }).click();
  await expect(page.getByRole('status')).toContainText('never retry automatically');
  await assertNoAutomaticReplay(page);
  await page.getByRole('button', { name: 'Outcome still unknown — do not retry' }).click();
  await assertNoAutomaticReplay(page);
  await expect(page.getByRole('button', { name: 'Return to review' })).toBeVisible();
});

test('reconnection invalidates approval and requires remote outcome reconciliation', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Go offline' }).click();
  await page.getByRole('button', { name: 'Reconnect and reauthorize' }).click();
  await expect(page.getByRole('status')).toContainText('reconcile outcome before any new action');
  await assertNoAutomaticReplay(page);
  await page.getByRole('button', { name: 'Simulate confirmed remote receipt' }).click();
  await expect(page.getByRole('status')).toContainText('SIMULATED remote receipt confirmed');
  await assertNoAutomaticReplay(page);
  await page.getByRole('button', { name: 'Mark confirmed completion' }).click();
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
});

test('cancellation stays pending until confirmed or unknown outcome reconciled', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Request cancellation' }).click();
  await expect(page.getByRole('status')).toContainText('external outcome remains unknown');
  await assertNoAutomaticReplay(page);
  await page.getByRole('button', { name: 'Outcome unknown — reconcile' }).click();
  await expect(page.getByRole('status')).toContainText('never retry automatically');
  await assertNoAutomaticReplay(page);
});

test('confirmed pre-dispatch cancellation cannot mark completion', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Request cancellation' }).click();
  await page.getByRole('button', { name: 'Simulate confirmed pre-dispatch cancellation' }).click();
  await expect(page.getByRole('status')).toContainText('confirmed before dispatch');
  await expect(page.getByRole('button', { name: 'Mark confirmed completion' })).toHaveCount(0);
  await assertNoAutomaticReplay(page);
});
