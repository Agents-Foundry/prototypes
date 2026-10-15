import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {fileURLToPath} from 'node:url';
const target='file://'+fileURLToPath(new URL('../prototype/index.html',import.meta.url));
for(const index of [0,2,4,6,8,11,12]){
 test('@a11y axe critical screen '+index,async({page})=>{
  await page.goto(target+'?screen='+index);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}))).toEqual([]);
 });
}
test('@a11y dialog keyboard and escape',async({page})=>{
 await page.goto(target+'?screen=11');await page.getByRole('button',{name:/Request activation/}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('@a11y at 200 percent zoom approximation',async({page})=>{
 await page.setViewportSize({width:640,height:900});await page.goto(target+'?screen=8');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
});
