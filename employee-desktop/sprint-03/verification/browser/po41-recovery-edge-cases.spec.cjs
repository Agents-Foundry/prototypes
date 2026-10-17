const {test,expect}=require('@playwright/test');
const path=require('node:path');
const url='file://'+path.resolve(__dirname,'../../prototypes/qa-critical-flow.html');
async function toPermission(page){await page.goto(url);for(let i=0;i<2;i++)await page.getByRole('button',{name:'Continue simulated review'}).click()}
async function toBrowser(page){await toPermission(page);await page.getByRole('button',{name:'Approve exact action'}).click();await page.getByRole('button',{name:'Continue with approved action'}).click()}
test('PO41 regression: policy drift and credential revocation block stale approval',async({page})=>{
 await toPermission(page);
 await page.getByRole('button',{name:'Simulate policy change'}).click();
 await expect(page.getByRole('status')).toContainText('old approval cannot be reused');
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
 await page.getByRole('button',{name:'Request fresh approval'}).click();
 await page.getByRole('button',{name:'Revoke credential'}).click();
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Request fresh approval'})).toBeVisible();
});
test('PO41 regression: unreadable offline cache denies access until fresh authorization',async({page})=>{
 await toBrowser(page);
 await page.getByRole('button',{name:'Go offline'}).click();
 await page.getByRole('button',{name:'Simulate unreadable encrypted cache'}).click();
 await expect(page.getByRole('status')).toContainText('cannot be verified');
 await expect(page.getByRole('button',{name:'Test completed with evidence'})).toHaveCount(0);
 await page.getByRole('button',{name:'Reconnect for fresh authorization'}).click();
 await expect(page.getByRole('button',{name:'Request fresh approval'})).toBeVisible();
});
test('PO41 regression: cancellation request remains distinct from confirmation',async({page})=>{
 await toBrowser(page);
 await page.getByRole('button',{name:'Request cancellation'}).click();
 await expect(page.getByRole('status')).toContainText('remains unknown');
 await expect(page.getByRole('button',{name:'Mark confirmed completion'})).toHaveCount(0);
 await page.getByRole('button',{name:'Simulate confirmed pre-dispatch cancellation'}).click();
 await expect(page.getByRole('status')).toContainText('SIMULATED cancellation confirmed');
 await expect(page.getByRole('button',{name:'Mark confirmed completion'})).toHaveCount(0);
});
test('PO41 regression: cross-device conflict never silently replays',async({page})=>{
 await toPermission(page);
 await page.getByRole('button',{name:'Simulate cross-device conflict'}).click();
 await expect(page.getByRole('status')).toContainText('do not overwrite or replay automatically');
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
 await page.getByRole('button',{name:'Keep local read-only; review conflict'}).click();
 await expect(page.getByRole('button',{name:'Approve exact action'})).toHaveCount(0);
});
