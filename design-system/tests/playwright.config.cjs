// Playwright config for the prototype app smoke and automated accessibility checks.
// Set AF_CHROMIUM to a local Chromium/Chrome executable to avoid downloading a browser.
const { defineConfig } = require('@playwright/test');
const executablePath = process.env.AF_CHROMIUM || undefined;
module.exports = defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.cjs/,
  timeout: 240000,
  reporter: [['list']],
  workers: 1,
  use: {
    viewport: { width: 1280, height: 900 },
    launchOptions: executablePath ? { executablePath } : {}
  }
});
