const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
 testDir: '.', testMatch: '**/*.spec.cjs', timeout: 30000,
 use: { browserName: 'chromium', headless: true },
 reporter: [['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
 outputDir: 'test-results'
});