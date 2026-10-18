const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const surfaces = {
  'Platform Owner': 'platform',
  'Organization Admin': 'admin',
  'Employee Desktop': 'employee',
  'Agent Studio': 'studio'
};
test('all 32 screens support interactive sample validation and seven scenarios', async ({page}) => {
  await page.goto('/');
  for (const [name,slug] of Object.entries(surfaces)) {
    await page.locator('[data-surface="'+slug+'"]').click();
    for (let step=0; step<8; step++) {
      await expect(page.locator('#flow-input')).toBeVisible();
      await page.locator('#flow-input').fill('');
      await page.locator('[data-action="flow-validate"]').click();
      await expect(page.getByText('Validation failed')).toBeVisible();
      await page.locator('#flow-input').fill('demo-value');
      await page.locator('[data-action="flow-validate"]').click();
      await expect(page.getByText('Sample validated')).toBeVisible();
      await page.locator('[data-action="flow-clear"]').click();
      await expect(page.getByText('Sample validated')).toHaveCount(0);
      for (const mode of ['loading','offline','denied','empty','error','unknown']) {
        await page.locator('#mode').selectOption(mode);
        await expect(page.locator('#flow-input')).toHaveCount(0);
      }
      await page.locator('#mode').selectOption('normal');
      if(step<7) await page.locator('[data-action="next"]').click();
    }
    await page.locator('[data-action="next"]').click();
    await expect(page.getByText('One gallery. Four product surfaces.')).toBeVisible();
  }
});
test('invalid invitation and tenant slug are rejected', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-surface="admin"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('[data-action="next"]').click();
  await page.locator('#flow-input').fill('not-an-email');
  await page.locator('[data-action="flow-validate"]').click();
  await expect(page.getByText('Enter an email address in a valid format.')).toBeVisible();
  await page.locator('[data-surface="platform"]').click();
  for(let i=0;i<3;i++) await page.locator('[data-action="next"]').click();
  await page.locator('#flow-input').fill('INVALID SLUG');
  await page.locator('[data-action="flow-validate"]').click();
  await expect(page.getByText(/lowercase slug/)).toBeVisible();
});
test('review preview resets when changing scenario', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-surface="employee"]').click();
  await page.locator('[data-action="demo-action"]').click();
  await expect(page.getByRole('region',{name:'Simulated action detail'})).toBeVisible();
  await page.locator('#mode').selectOption('denied');
  await expect(page.getByRole('region',{name:'Simulated action detail'})).toHaveCount(0);
});
test('@a11y gallery and every application screen have no serious/critical axe violations', async ({page}) => {
  await page.goto('/');
  const check = async () => {
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    const severe = results.violations.filter(v=>['critical','serious'].includes(v.impact));
    expect(severe, JSON.stringify(severe,null,2)).toEqual([]);
  };
  await check();
  for(const slug of Object.values(surfaces)) {
    await page.locator('[data-surface="'+slug+'"]').click();
    for(let i=0;i<8;i++) {
      await check();
      if(i<7) await page.locator('[data-action="next"]').click();
    }
  }
});
test('keyboard focus reaches interactive inputs and buttons', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-surface="studio"]').click();
  await page.locator('#flow-input').focus();
  await expect(page.locator('#flow-input')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-action="flow-validate"]')).toBeFocused();
});
