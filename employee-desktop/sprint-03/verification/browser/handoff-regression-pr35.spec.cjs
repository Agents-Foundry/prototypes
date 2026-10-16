const {test, expect} = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

async function toApproval(page) {
  await page.goto(url);
  for (let i = 0; i < 2; i++) await page.getByRole('button', {name:'Continue simulated review'}).click();
}
test('handoff: fresh approval is required after policy drift', async ({page}) => {
  await toApproval(page);
  await page.getByRole('button',{name:'Simulate policy change'}).click();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
  await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
  await page.getByRole('button',{name:'Request fresh approval'}).click();
  await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
test('handoff: offline expired cache cannot progress to privileged browser result', async ({page}) => {
  await toApproval(page);
  await page.getByRole('button',{name:'Approve exact action'}).click();
  await page.getByRole('button',{name:'Go offline'}).click();
  await page.getByRole('button',{name:'Simulate offline authorization expiry'}).click();
  await expect(page.getByRole('status')).toContainText('cached access denied');
  await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
});
test('handoff: unknown outcome cannot be marked complete without simulated receipt', async ({page}) => {
  await toApproval(page);
  await page.getByRole('button',{name:'Approve exact action'}).click();
  await page.getByRole('button',{name:'Browser timeout'}).click();
  await expect(page.getByRole('button',{name:'Mark confirmed completion'})).toHaveCount(0);
  await page.getByRole('button',{name:'Outcome still unknown — do not retry'}).click();
  await expect(page.getByRole('button',{name:'Mark confirmed completion'})).toHaveCount(0);
});
test('handoff: reset clears denial and returns to initial state', async ({page}) => {
  await toApproval(page);
  await page.getByRole('button',{name:'Deny'}).click();
  await page.getByRole('button',{name:'Reset scenario'}).click();
  await expect(page.getByRole('heading',{name:'Read Jira story'})).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
  await expect(page.getByRole('status')).toContainText('no external side effects');
});
