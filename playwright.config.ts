import dotenv from 'dotenv';
dotenv.config();
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  // IMPORTANT: this suite authenticates as a single shared 'Admin' account
  // on OrangeHRM's public demo. That demo enforces one active session per
  // account, so running spec files concurrently (Playwright's default with
  // workers > 1) causes different workers to repeatedly log each other out
  // mid-run — which shows up as "Dashboard heading not found" / login-page
  // failures scattered across every authenticated test. Force serial
  // execution to keep one session alive for the whole run.
  workers: 1,

  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/results.xml' }],
    ['list'],
  ],

  timeout: 60 * 1000,
  globalSetup: require.resolve('./utils/global-setup'),
  globalTeardown: require.resolve('./utils/global-teardown'),

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    // 'retain-on-failure' instead of 'on-first-retry': with retries: 0
    // locally, 'on-first-retry' would never actually capture a trace
    // (there's no retry to trigger it on). This way `npx playwright
    // show-trace` always has something to open after any failure.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testDir: './tests',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Uncomment for mobile viewport coverage:
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});
