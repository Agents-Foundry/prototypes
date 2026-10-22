// Automated checks for the four prototype apps. These are simulated-environment checks:
// they do not establish WCAG conformance, real assistive-technology behavior, or approval.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');
const { pathToFileURL } = require('url');

const APPS = [['PLT', 'platform-owner'], ['ORG', 'organization-admin'], ['EMP', 'employee-desktop'], ['STD', 'agent-studio']];
const SCENARIOS = ['normal', 'loading', 'empty', 'error', 'denied', 'offline', 'unknown', 'stale'];
const urlFor = dir => pathToFileURL(path.resolve(__dirname, '..', '..', dir, 'app', 'index.html')).href;

for (const [prefix, dir] of APPS) {
  test.describe(`${prefix} (${dir})`, () => {
    test('every screen renders in every scenario without errors', async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(urlFor(dir));
      const ids = await page.evaluate(() => Object.keys(window.SCREENS));
      expect(ids.length).toBeGreaterThan(15);
      for (const id of ids) {
        for (const sc of SCENARIOS) {
          await page.evaluate(([i, s]) => {
            location.hash = '#/' + i;
            const sel = document.getElementById('scn'); sel.value = s; sel.dispatchEvent(new Event('change'));
          }, [id, sc]);
          const text = await page.locator('#main').innerText();
          expect(text.length, `${id}/${sc} should not be empty`).toBeGreaterThan(30);
          expect(text, `${id}/${sc}`).not.toContain('failed to render');
        }
      }
      expect(errors).toEqual([]);
    });

    test('automated axe rules (WCAG 2.x A/AA tags) in light and dark themes', async ({ page }) => {
      await page.goto(urlFor(dir));
      const ids = await page.evaluate(() => Object.keys(window.SCREENS));
      const found = [];
      for (const theme of ['light', 'dark']) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        for (const id of ids) {
          await page.evaluate(i => { location.hash = '#/' + i; }, id);
          await page.waitForTimeout(30);
          const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
          for (const v of r.violations) found.push(`${theme} ${id} ${v.id} (${v.impact}) x${v.nodes.length}`);
        }
      }
      expect(found, 'axe violations').toEqual([]);
    });


    test('build-status labels match each screen and spec drawer (simulated)', async ({ page }) => {
      await page.goto(urlFor(dir));
      const entries = await page.evaluate(() =>
        Object.entries(window.SCREENS).map(([id, screen]) => [id, screen.status || 'proposed', Boolean(screen.bare)])
      );
      for (const [id, expected, bare] of entries) {
        await page.evaluate(i => { location.hash = '#/' + i; }, id);
        const badge = page.locator('#main [data-status]');
        await expect(badge, id + ' has one build-status badge').toHaveCount(1);
        await expect(badge).toHaveAttribute('data-status', expected);
        if (bare) await expect(page.locator('#main .bare-build-status')).toBeVisible();
        await page.getByRole('button', { name: 'Screen spec' }).click();
        await expect(page.getByText('Build status: ' + expected)).toBeVisible();
        await expect(page.getByText(/not design approval/i)).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog', { name: 'Screen spec · ' + id })).toHaveCount(0);
      }
    });

    test('keyboard: skip link, command palette and spec drawer open and close with Escape', async ({ page }) => {
      await page.goto(urlFor(dir));
      await page.keyboard.press('Control+k');
      await expect(page.getByRole('dialog', { name: 'Jump to screen' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: 'Jump to screen' })).toHaveCount(0);
      await page.getByRole('button', { name: 'Screen spec' }).click();
      await expect(page.getByText('Build status: proposed')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByText('Build status: proposed')).toHaveCount(0);
    });
  });
}
