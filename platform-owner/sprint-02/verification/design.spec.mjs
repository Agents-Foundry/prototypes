import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {fileURLToPath} from 'node:url';
const target='file://'+fileURLToPath(new URL('../prototype/index.html',import.meta.url));
const tabs=['Overview','Organizations','Provision Tenant','Agent Catalog','Billing & Usage','Security & Audit','Operations'];
for(const width of [375,768,1024,1440,1920]){
 test('responsive dashboard and tenant directory '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(target);
  await expect(page.getByRole('heading',{name:'Operating overview'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.screenshot({path:'test-results/dashboard-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:'Organizations',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Organizations'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await page.screenshot({path:'test-results/organizations-'+width+'.png',fullPage:true});
 });
}
for(const tab of tabs){test('navigation '+tab,async({page})=>{await page.goto(target);await page.getByRole('button',{name:tab,exact:true}).click();await expect(page.locator('#view h1')).toBeVisible();});}
test('tenant provisioning remains simulation pending approval',async({page})=>{
 await page.goto(target);await page.getByRole('button',{name:'Provision Tenant'}).click();
 await page.locator('#name').fill('Example Company');await page.locator('#slug').fill('example-company');await page.locator('#next').click();
 await page.locator('#next').click();await page.locator('#admin').fill('admin@example.com');await page.locator('#next').click();
 await expect(page.getByRole('heading',{name:'Review provisioning request'})).toBeVisible();
 await page.locator('#next').click();await expect(page.getByRole('status')).toContainText('Pending approval');
 await expect(page.getByRole('status')).toContainText('No tenant provisioned');
});
for(const tab of ['Overview','Organizations','Provision Tenant','Security & Audit']){
 test('@a11y critical axe '+tab,async({page})=>{await page.goto(target);await page.getByRole('button',{name:tab,exact:true}).click();const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(r.violations.map(v=>({rule:v.id,impact:v.impact,nodes:v.nodes.length}))).toEqual([]);});
}
