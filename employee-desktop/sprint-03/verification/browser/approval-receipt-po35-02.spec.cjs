const {test,expect}=require('@playwright/test');
const path=require('node:path');
const url='file://'+path.resolve(__dirname,'../../prototypes/qa-critical-flow.html');
async function toApproval(page){await page.goto(url);for(let i=0;i<2;i++)await page.getByRole('button',{name:'Continue simulated review'}).click()}
test('PO35-02: approval shows explicit receipt without auto-advancing',async({page})=>{
 await toApproval(page);await page.getByRole('button',{name:'Approve exact action'}).click();
 await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
 const receipt=page.locator('#approval-receipt');
 await expect(receipt).toContainText('Attach draft test cases to Jira');
 await expect(receipt).toContainText('QA-184');
 await expect(receipt).toContainText('Single use');
 await expect(receipt).toContainText('10 minutes');
 await expect(page.getByRole('status')).toContainText('SIMULATED');
 await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
});
test('PO35-02: continue consumes receipt and advances once',async({page})=>{
 await toApproval(page);await page.getByRole('button',{name:'Approve exact action'}).click();
 await page.getByRole('button',{name:'Continue with approved action'}).click();
 await expect(page.getByRole('heading',{name:'Run browser testing'})).toBeVisible();
 await expect(page.locator('#approval-receipt')).toHaveCount(0);
 await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
test('PO35-02: cancel keeps user at permission step and clears receipt',async({page})=>{
 await toApproval(page);await page.getByRole('button',{name:'Approve exact action'}).click();
 await page.getByRole('button',{name:'Cancel approval'}).click();
 await expect(page.getByRole('heading',{name:'Request write permission'})).toBeVisible();
 await expect(page.locator('#approval-receipt')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Approve exact action'})).toBeVisible();
});
test('PO35-02: defect approval also displays receipt',async({page})=>{
 await toApproval(page);await page.getByRole('button',{name:'Approve exact action'}).click();
 await page.getByRole('button',{name:'Continue with approved action'}).click();
 await page.getByRole('button',{name:'Test completed with evidence'}).click();
 await page.getByRole('button',{name:'Continue simulated review'}).click();
 await page.getByRole('button',{name:'Approve exact action'}).click();
 await expect(page.locator('#approval-receipt')).toContainText('Create Jira defect draft');
 await expect(page.getByRole('heading',{name:'Review defect draft'})).toBeVisible();
});
