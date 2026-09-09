// utils/hooks.ts
//
// Shared beforeEach/afterEach lifecycle hooks. Import this module (for its
// side effect) in a spec file to attach these hooks to that file's tests.
import { test } from '../fixtures';

test.beforeEach(async ({}, testInfo) => {
  console.log(`Starting: ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // testInfo.outputPath() writes into Playwright's own managed
    // test-results directory and creates it automatically — a hardcoded
    // relative path like 'failures/...' throws ENOENT if that folder
    // was never created.
    await page.screenshot({ path: testInfo.outputPath('failure.png') });
  }
  // Data isolation cleanup for anything the individual test created
  // beyond what globalTeardown handles belongs here.
});
