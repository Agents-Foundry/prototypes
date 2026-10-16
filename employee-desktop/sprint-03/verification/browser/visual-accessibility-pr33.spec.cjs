const {test, expect} = require('@playwright/test');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

test.beforeEach(async ({page}) => {await page.goto(url);});

test('theme toggle exposes pressed state and retains focus', async ({page}) => {
  const toggle = page.getByRole('button', {name:'Toggle light / dark'});
  await expect(toggle).toHaveAttribute('aria-pressed','false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await expect(toggle).toBeFocused();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed','false');
});

test('keyboard focus indicator exists for dynamically focused heading', async ({page}) => {
  await page.getByRole('button', {name:'Continue simulated review'}).focus();
  await page.keyboard.press('Enter');
  const heading = page.getByRole('heading', {name:'Review generated test cases'});
  await expect(heading).toBeFocused();
  const outline = await heading.evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
});

for (const width of [320, 400, 480]) {
  for (const theme of ['light','dark']) {
    test('critical denial state reflows without horizontal overflow ' + width + ' ' + theme, async ({page}) => {
      await page.setViewportSize({width,height:760});
      if(theme==='dark') await page.getByRole('button',{name:'Toggle light / dark'}).click();
      for(let i=0;i<2;i++) await page.getByRole('button',{name:'Continue simulated review'}).click();
      await page.getByRole('button',{name:'Deny'}).click();
      await expect(page.getByRole('status')).toContainText('denied');
      const dimensions = await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
      await expect(page.getByRole('button',{name:'Request fresh approval'})).toBeVisible();
    });
  }
}

test('forced-colors mode preserves selected step and keyboard focus', async ({page}) => {
  await page.emulateMedia({forcedColors:'active'});
  await page.getByRole('button',{name:'Continue simulated review'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#steps [aria-current="step"]')).toContainText('Review generated test cases');
  await expect(page.getByRole('heading',{name:'Review generated test cases'})).toBeFocused();
});

test('environment label explicitly distinguishes mock from live authorization', async ({page}) => {
  await expect(page.locator('#env')).toContainText('simulated');
  await expect(page.locator('#auth')).toContainText('Scoped read-only');
});
