const {test,expect}=require('@playwright/test');
const path=require('node:path');
const url='file://'+path.resolve(__dirname,'../../prototypes/qa-critical-flow.html');
async function openReceipt(page){
 await page.goto(url);
 for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue simulated review'}).click();
 await page.getByRole('button',{name:'Approve exact action'}).click();
}
test('PO41 receipt: explicit named heading receives focus before Continue',async({page})=>{
 await openReceipt(page);
 const heading=page.getByRole('heading',{level:3,name:'Review simulated one-time approval receipt'});
 await expect(heading).toBeVisible();
 await expect(heading).toBeFocused();
 await expect(page.locator('#approval-receipt')).toHaveAttribute('aria-labelledby','receipt-heading');
 await expect(page.locator('#approval-receipt')).toContainText('Attach draft test cases to Jira');
 await expect(page.locator('#approval-receipt')).toContainText('QA-184');
 await expect(page.locator('#approval-receipt')).toContainText('Single use');
 await expect(page.locator('#approval-receipt')).toContainText('10 minutes');
 const outline=await heading.evaluate(el=>getComputedStyle(el).outlineStyle);
 expect(outline).not.toBe('none');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('button',{name:'Continue with approved action'})).toBeFocused();
});
test('PO41 receipt: cancel restores permission heading and clears receipt',async({page})=>{
 await openReceipt(page);
 await page.getByRole('button',{name:'Cancel approval'}).click();
 await expect(page.getByRole('heading',{name:'Request write permission'})).toBeFocused();
 await expect(page.locator('#receipt-heading')).toHaveCount(0);
 await expect(page.locator('#approval-receipt')).toHaveCount(0);
});
test('PO41 receipt: defect authorization also focuses named receipt',async({page})=>{
 await openReceipt(page);
 await page.getByRole('button',{name:'Continue with approved action'}).click();
 await page.getByRole('button',{name:'Test completed with evidence'}).click();
 await page.getByRole('button',{name:'Continue simulated review'}).click();
 await page.getByRole('button',{name:'Approve exact action'}).click();
 await expect(page.getByRole('heading',{name:'Review simulated one-time approval receipt'})).toBeFocused();
 await expect(page.locator('#approval-receipt')).toContainText('Create Jira defect draft');
});

for(const theme of ['dark','forced-colors']){
 test('PO41 receipt: focused heading remains visible in '+theme+' mode',async({page})=>{
  await page.goto(url);
  if(theme==='dark') await page.getByRole('button',{name:'Toggle light / dark'}).click();
  else await page.emulateMedia({forcedColors:'active'});
  for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue simulated review'}).click();
  await page.getByRole('button',{name:'Approve exact action'}).click();
  const heading=page.getByRole('heading',{level:3,name:'Review simulated one-time approval receipt'});
  await expect(heading).toBeFocused();
  await expect(heading).toBeVisible();
  const outline=await heading.evaluate(el=>getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
  await expect(page.getByRole('button',{name:'Cancel approval'})).toBeVisible();
 });
}
