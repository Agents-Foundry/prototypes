import {test,expect} from '@playwright/test';
import {fileURLToPath} from 'node:url';
const target=fileURLToPath(new URL('../prototype/index.html',import.meta.url));
for(const width of [375,768,1024,1280,1440,1920]){
 test('responsive viewport '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('file://'+target);
  await expect(page.getByRole('heading',{name:'Dashboard'})).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(overflow,'horizontal document overflow at '+width).toBe(false);
  await page.screenshot({path:'test-results/dashboard-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:'AI Employees',exact:true}).click();
  await page.screenshot({path:'test-results/workforce-'+width+'.png',fullPage:true});
 });
}
test('activation request remains pending',async({page})=>{
 await page.goto('file://'+target+'?screen=11');
 await page.getByRole('button',{name:/Request activation/}).click();
 const dlg=page.getByRole('dialog');await expect(dlg).toBeVisible();await dlg.getByRole('button',{name:'Confirm'}).click();
 await expect(page.getByRole('heading',{name:/Approval pending/i})).toBeVisible();
 await expect(page.getByText(/cannot execute tasks/i)).toBeVisible();
});
test('cancel does not submit activation',async({page})=>{
 await page.goto('file://'+target+'?screen=11');await page.getByRole('button',{name:/Request activation/}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Cancel'}).click();
 await expect(page.getByRole('heading',{name:'Review activation'})).toBeVisible();
});
test('wizard save, resume and cancel',async({page})=>{
 await page.goto('file://'+target+'?screen=8');
 await page.getByRole('button',{name:'Save draft'}).click();
 await expect(page.getByRole('heading',{name:'Saved hiring draft'})).toBeVisible();
 await page.getByRole('button',{name:/Resume draft/}).click();
 await expect(page.getByRole('heading',{name:'Configure employee'})).toBeVisible();
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Confirm'}).click();
 await expect(page.getByRole('heading',{name:'AI employees'})).toBeVisible();
});
