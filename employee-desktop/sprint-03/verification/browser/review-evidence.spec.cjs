const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs/promises');
const path = require('node:path');
const url = 'file://' + path.resolve(__dirname, '../../prototypes/qa-critical-flow.html');
const output = path.resolve(__dirname, 'test-results', 'review-evidence');
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const scenarios = ['initial', 'permission', 'denied', 'expired', 'revoked', 'offline', 'reconnected', 'unknown'];
async function setup(page, scenario) {
  await page.goto(url);
  if (scenario === 'initial') return;
  for (let i = 0; i < 2; i++) await page.getByRole('button', {name: 'Continue simulated review'}).click();
  if (scenario === 'permission') return;
  if (scenario === 'denied') return page.getByRole('button', {name: 'Deny'}).click();
  if (scenario === 'expired') return page.getByRole('button', {name: 'Expire approval'}).click();
  if (scenario === 'revoked') {
    await page.getByRole('button', {name: 'Expire approval'}).click();
    await page.getByRole('button', {name: 'Request fresh approval'}).click();
    return page.getByRole('button', {name: 'Revoke credential'}).click();
  }
  await page.getByRole('button', {name: 'Approve exact action'}).click();
  if (scenario === 'unknown') return page.getByRole('button', {name: 'Browser timeout'}).click();
  await page.getByRole('button', {name: 'Go offline'}).click();
  if (scenario === 'reconnected') await page.getByRole('button', {name: 'Reconnect and validate'}).click();
}
for (const theme of ['light', 'dark']) {
  for (const width of [480, 960, 1440]) {
    for (const scenario of scenarios) {
      test('review evidence ' + theme + ' ' + width + ' ' + scenario, async ({page}, testInfo) => {
        await page.setViewportSize({width, height: 900});
        await setup(page, scenario);
        if (theme === 'dark') await page.getByRole('button', {name: 'Toggle light / dark'}).click();
        const id = [theme, width, scenario].join('-');
        await fs.mkdir(output, {recursive: true});
        const image = path.join(output, id + '.png');
        const report = path.join(output, id + '.json');
        await page.screenshot({path: image, fullPage: true});
        const audit = await new AxeBuilder({page}).withTags(tags).analyze();
        const dimensions = await page.evaluate(() => ({
          viewportWidth: document.documentElement.clientWidth,
          documentWidth: document.documentElement.scrollWidth
        }));
        const evidence = {
          id, scenario, theme, requestedViewportCssPx: width,
          dimensions, simulated: true, actualBrowserZoomValidated: false,
          screenReaderValidated: false, independentVisualQaApproved: false,
          wcagTags: tags, axeViolations: audit.violations.map(v => ({
            id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({target: n.target, failureSummary: n.failureSummary}))
          })),
          gitSha: process.env.GITHUB_SHA || 'local-unpinned',
          reviewerDisposition: 'NOT TESTED',
          note: 'Automated Chromium evidence only; no manual screen-reader, real zoom or independent approval.'
        };
        await fs.writeFile(report, JSON.stringify(evidence, null, 2) + '\n');
        await testInfo.attach('review-' + id + '-json', {path: report, contentType: 'application/json'});
        await testInfo.attach('review-' + id + '-screenshot', {path: image, contentType: 'image/png'});
        expect(dimensions.documentWidth, 'horizontal overflow in ' + id).toBeLessThanOrEqual(dimensions.viewportWidth);
        expect(evidence.axeViolations, JSON.stringify(evidence.axeViolations, null, 2)).toEqual([]);
      });
    }
  }
}
