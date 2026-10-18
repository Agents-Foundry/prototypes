const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

async function permission(page) {
  await page.goto(url);
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
  await page.getByRole('button', { name: 'Continue simulated review' }).click();
}

async function browserStage(page) {
  await permission(page);
  await page.getByRole('button', { name: 'Approve exact action' }).click();
  await page.getByRole('button', { name: 'Continue with approved action' }).click();
}

test('changed Jira target invalidates exact-operation authorization', async ({ page }) => {
  await permission(page);
  await page.getByRole('button', { name: 'Simulate changed Jira target' }).click();
  await expect(page.getByRole('status')).toContainText('exact-operation approval invalidated');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Request fresh approval' }).click();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toBeVisible();
});

test('revoked credential prevents continuing with prior authorization', async ({ page }) => {
  await permission(page);
  await page.getByRole('button', { name: 'Revoke credential' }).click();
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});

test('environment switch invalidates previous approval', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Simulate environment switch' }).click();
  await expect(page.getByRole('status')).toContainText('previous authorization is invalid');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
});

test('offline authorization expiry denies cache access until reauthentication', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Go offline' }).click();
  await page.getByRole('button', { name: 'Simulate offline authorization expiry' }).click();
  await expect(page.getByRole('status')).toContainText('cached access denied');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reconnect for fresh authorization' }).click();
  await expect(page.getByRole('button', { name: 'Request fresh approval' })).toBeVisible();
});

test('unapproved connector capability is denied in evidence review', async ({ page }) => {
  await browserStage(page);
  await page.getByRole('button', { name: 'Test completed with evidence' }).click();
  await page.getByRole('button', { name: 'Simulate unapproved connector' }).click();
  await expect(page.getByRole('status')).toContainText('no tool action executed');
  await expect(page.getByRole('button', { name: 'Continue with approved action' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Return to review' })).toBeVisible();
});
