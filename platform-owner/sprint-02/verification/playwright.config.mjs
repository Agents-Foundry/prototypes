import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'*.spec.mjs',fullyParallel:true,retries:1,reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],use:{browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},outputDir:'test-results'});
