import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const isPlaywrightOnCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // need to design dataFactory with admin users for parallel run
  forbidOnly: isPlaywrightOnCI,
  retries: isPlaywrightOnCI ? 2 : 0,
  workers: isPlaywrightOnCI ? 1 : undefined,
  reporter: [
    ['line'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'test-html-report/',
      },
    ],
  ],
  expect: {
    timeout: 30 * 1000,
  },
  timeout: 2 * 60 * 1000,
  globalTimeout: 10 * 60 * 1000,
  use: {
    headless: isPlaywrightOnCI,
    baseURL: 'https://admin.moralis.io/',
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
    launchOptions: {
      slowMo: 50,
    },
  },
  projects: [
    {
      name: 'auth',
      testMatch: /.*.setup.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
