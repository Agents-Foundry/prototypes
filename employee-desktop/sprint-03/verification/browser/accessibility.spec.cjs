const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');

test.beforeEach(async ({ page }) => { await page.goto(url); });

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

for (const theme of ['light', 'dark']) {
  for (const scenario of ['initial', 'denied', 'offline', 'unknown']) {
    test('WCAG 2.1 AA automated scan — ' + theme + ' / ' + scenario, async ({ page }) => {
      if (theme === 'dark') await page.getByRole('button', { name: 'Toggle light / dark' }).click();
      if (scenario !== 'initial') {
        for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Continue simulated review' }).click();
        if (scenario === 'denied') await page.getByRole('button', { name: 'Deny' }).click();
        else {
          await page.getByRole('button', { name: 'Approve exact action' }).click();
          await page.getByRole('button', { name: 'Continue with approved action' }).click();
          await page.getByRole('button', { name: scenario === 'offline' ? 'Go offline' : 'Browser timeout' }).click();
        }
      }
      const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
      const failures = results.violations.map(v => ({
        rule: v.id, impact: v.impact,
        nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
      }));
      expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
    });
  }
}

test('keyboard progression, heading focus and denial announcement', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue simulated review' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Review generated test cases' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Request write permission' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Deny' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Request write permission' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('denied');
  await expect(page.getByRole('button', { name: 'Approve exact action' })).toHaveCount(0);
});

for (const width of [320, 400, 480]) {
  for (const theme of ['light', 'dark']) {
    test('narrow and 200% zoom-equivalent review ' + width + ' / ' + theme, async ({ page }) => {
      // At a 960 CSS-pixel desktop window, 200% browser zoom yields ~480 CSS pixels.
      // This is a viewport-equivalence proxy, not proof of actual OS/browser zoom behavior.
      await page.setViewportSize({ width, height: 760 });
      if (theme === 'dark') await page.getByRole('button', { name: 'Toggle light / dark' }).click();
      for (const scenario of ['initial', 'permission', 'offline']) {
        if (scenario === 'permission') {
          for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Continue simulated review' }).click();
        } else if (scenario === 'offline') {
          await page.getByRole('button', { name: 'Approve exact action' }).click();
          await page.getByRole('button', { name: 'Continue with approved action' }).click();
          await page.getByRole('button', { name: 'Go offline' }).click();
        }
        const size = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth
        }));
        expect(size.scroll, 'horizontal overflow in ' + scenario).toBeLessThanOrEqual(size.viewport);
        await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
        await page.screenshot({
          path: 'test-results/a11y-' + width + '-' + theme + '-' + scenario + '.png',
          fullPage: true
        });
      }
    });
  }
}
