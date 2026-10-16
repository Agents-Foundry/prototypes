const { test, expect } = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');
test.beforeEach(async ({page}) => { await page.goto(url); });

test('Jira permission denial blocks simulated progression', async ({page}) => {
  await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Continue simulated review'}).click();
  await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
  await page.getByRole('button',{name:'Deny'}).click();
  await expect(page.getByRole('status')).toContainText('denied');
  await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
});
test('expired and revoked permission show safe recovery route',async ({page})=>{
  await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Expire approval'}).click();
  await expect(page.getByRole('status')).toContainText('expired');
  await page.getByRole('button',{name:'Request fresh approval'}).click();
  await page.getByRole('button',{name:'Revoke credential'}).click();
  await expect(page.getByRole('status')).toContainText('revoked');
});
test('offline then reconnect requires outcome verification',async ({page})=>{
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Approve exact action'}).click();
  await expect(page.getByRole('heading',{name:'Run browser testing'})).toBeVisible();
  await page.getByRole('button',{name:'Go offline'}).click();
  await expect(page.getByRole('status')).toContainText('offline');
  await page.getByRole('button',{name:'Reconnect and reauthorize'}).click();
  await expect(page.getByRole('status')).toContainText('previous authorization invalidated');
  await expect(page.getByRole('button',{name:'Simulate confirmed remote receipt'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Outcome still unknown — do not retry'})).toBeVisible();
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
test('unknown browser outcome cannot automatically pass',async ({page})=>{
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Approve exact action'}).click();
  await page.getByRole('button',{name:'Browser timeout'}).click();
  await expect(page.getByRole('status')).toContainText('unknown');
  await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
});
for(const width of [960,1440])for(const theme of ['light','dark']){
 test('responsive screenshot '+width+' '+theme,async ({page})=>{
  await page.setViewportSize({width,height:900});
  if(theme==='dark') await page.getByRole('button',{name:'Toggle light / dark'}).click();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth',width);
  await page.screenshot({path:'test-results/qa-'+width+'-'+theme+'.png',fullPage:true});
 });
}
