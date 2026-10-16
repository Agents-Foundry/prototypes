const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');
async function permission(page) {
  await page.goto(url);
  for (let i = 0; i < 2; i++) await page.getByRole('button', {name:'Continue simulated review'}).click();
}
async function browser(page) {
  await permission(page);
  await page.getByRole('button', {name:'Approve exact action'}).click();
}
test('changed target and policy fail closed', async ({page}) => {
  await permission(page);
  await page.getByRole('button', {name:'Simulate changed Jira target'}).click();
  await expect(page.getByRole('status')).toContainText('approval invalidated');
  await expect(page.getByRole('button', {name:'Approve exact action'})).toHaveCount(0);
  await page.getByRole('button', {name:'Request fresh approval'}).click();
  await page.getByRole('button', {name:'Simulate policy change'}).click();
  await expect(page.getByRole('status')).toContainText('old approval cannot be reused');
});
test('cross-device conflict does not silently replay', async ({page}) => {
  await permission(page);
  await page.getByRole('button', {name:'Simulate cross-device conflict'}).click();
  await expect(page.getByRole('status')).toContainText('do not overwrite or replay');
  await expect(page.getByRole('button', {name:'Approve exact action'})).toHaveCount(0);
});
test('offline expired and corrupt cache deny access', async ({page}) => {
  await browser(page);
  await page.getByRole('button', {name:'Go offline'}).click();
  await page.getByRole('button', {name:'Simulate offline authorization expiry'}).click();
  await expect(page.getByRole('status')).toContainText('cached access denied');
  await expect(page.getByRole('button', {name:'Test completed with evidence'})).toHaveCount(0);
  await page.getByRole('button', {name:'Reconnect for fresh authorization'}).click();
  await expect(page.getByRole('status')).toContainText('old approval cannot be reused');
  await page.getByRole('button', {name:'Request fresh approval'}).click();
  await page.getByRole('button', {name:'Approve exact action'}).click();
  await page.getByRole('button', {name:'Go offline'}).click();
  await page.getByRole('button', {name:'Simulate unreadable encrypted cache'}).click();
  await expect(page.getByRole('status')).toContainText('access denied');
});
test('cancellation distinguishes request, uncertainty and confirmation', async ({page}) => {
  await browser(page);
  await page.getByRole('button', {name:'Request cancellation'}).click();
  await expect(page.getByRole('status')).toContainText('outcome remains unknown');
  await page.getByRole('button', {name:'Outcome unknown — reconcile'}).click();
  await expect(page.getByRole('status')).toContainText('never retry automatically');
  await expect(page.getByRole('button', {name:'Test completed with evidence'})).toHaveCount(0);
});
test('environment switch invalidates authorization', async ({page}) => {
  await browser(page);
  await page.getByRole('button', {name:'Simulate environment switch'}).click();
  await expect(page.getByRole('status')).toContainText('previous authorization is invalid');
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
test('evidence and connector denial remain mock-only', async ({page}) => {
  await browser(page);
  await page.getByRole('button', {name:'Test completed with evidence'}).click();
  await page.getByRole('button', {name:'Inspect redacted evidence'}).click();
  await expect(page.getByRole('status')).toContainText('Evidence preview redacted');
  await page.getByRole('button', {name:'Return to review'}).click();
  await page.getByRole('button', {name:'Simulate unapproved connector'}).click();
  await expect(page.getByRole('status')).toContainText('no tool action executed');
});
