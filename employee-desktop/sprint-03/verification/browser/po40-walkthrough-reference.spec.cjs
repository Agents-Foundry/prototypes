const {test,expect}=require('@playwright/test');
const path=require('node:path');
const url='file://'+path.resolve(__dirname,'../../prototypes/qa-critical-flow.html');
async function start(page){await page.goto(url);await expect(page.getByRole('heading',{name:'Read Jira story'})).toBeVisible()}
async function toPermission(page){await start(page);for(let i=0;i<2;i++)await page.getByRole('button',{name:'Continue simulated review'}).click()}
async function toBrowser(page){await toPermission(page);await page.getByRole('button',{name:'Approve exact action'}).click();await expect(page.locator('#approval-receipt')).toContainText('Single use');await page.getByRole('button',{name:'Continue with approved action'}).click()}
test('PO40 automated reference: story, drafts, explicit receipt, cancel and continue',async({page})=>{
 await start(page);
 await expect(page.locator('.banner')).toContainText('NO NETWORK OR LIVE ACTIONS');
 await page.getByRole('button',{name:'Continue simulated review'}).click();
 await expect(page.getByRole('heading',{name:'Review generated test cases'})).toBeVisible();
 await page.getByRole('button',{name:'Continue simulated review'}).click();
 await page.getByRole('button',{name:'Approve exact action'}).click();
 const receipt=page.locator('#approval-receipt');
 await expect(receipt).toContainText('Attach draft test cases to Jira');
 await expect(receipt).toContainText('QA-184');
 await expect(receipt).toContainText('Single use');
 await expect(receipt).toContainText('not a live timer');
 await page.getByRole('button',{name:'Cancel approval'}).click();
 await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
 await expect(receipt).toHaveCount(0);
 await page.getByRole('button',{name:'Approve exact action'}).click();
 await page.getByRole('button',{name:'Continue with approved action'}).click();
 await expect(page.getByRole('heading',{name:'Run browser testing'})).toBeVisible();
 await expect(receipt).toHaveCount(0);
});
test('PO40 automated reference: deny and target drift invalidate receipt progression',async({page})=>{
 await toPermission(page);
 await page.getByRole('button',{name:'Deny',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('denied');
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
 await page.getByRole('button',{name:'Request fresh approval'}).click();
 await page.getByRole('button',{name:'Simulate changed Jira target'}).click();
 await expect(page.getByRole('status')).toContainText('Action target changed; exact-operation approval invalidated.');
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
 await page.getByRole('button',{name:'Request fresh approval'}).click();
 await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
});
test('PO40 automated reference: offline, expiry and reconnect require review',async({page})=>{
 await toBrowser(page);
 await page.getByRole('button',{name:'Go offline'}).click();
 await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
 await page.getByRole('button',{name:'Simulate offline authorization expiry'}).click();
 await expect(page.getByRole('status')).toContainText('cached access denied');
 await page.getByRole('button',{name:'Reconnect for fresh authorization'}).click();
 await expect(page.getByRole('button',{name:'Request fresh approval'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
});
test('PO40 automated reference: timeout remains unknown, not automatically complete',async({page})=>{
 await toBrowser(page);
 await page.getByRole('button',{name:'Browser timeout'}).click();
 await expect(page.getByRole('status')).toContainText('unknown');
 await expect(page.getByRole('button',{name:'Mark confirmed completion'})).toHaveCount(0);
 await page.getByRole('button',{name:'Outcome still unknown — do not retry'}).click();
 await expect(page.getByRole('button',{name:'Return to review'})).toBeVisible();
});
test('PO40 automated reference: evidence denial and separate defect receipt',async({page})=>{
 await toBrowser(page);
 await page.getByRole('button',{name:'Test completed with evidence'}).click();
 await page.getByRole('button',{name:'Inspect redacted evidence'}).click();
 await expect(page.getByRole('status')).toContainText('redacted');
 await page.getByRole('button',{name:'Return to review'}).click();
 await page.getByRole('button',{name:'Simulate unapproved connector'}).click();
 await expect(page.getByRole('status')).toContainText('denied');
 await page.getByRole('button',{name:'Return to review'}).click();
 await page.getByRole('button',{name:'Continue simulated review'}).click();
 await page.getByRole('button',{name:'Approve exact action'}).click();
 await expect(page.locator('#approval-receipt')).toContainText('Create Jira defect draft');
 await expect(page.locator('#approval-receipt')).toContainText('Single use');
 await expect(page.getByRole('heading',{name:'Review defect draft'})).toBeVisible();
});
