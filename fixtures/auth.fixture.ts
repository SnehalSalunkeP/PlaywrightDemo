import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

type AuthFixtures = {
  authenticatedPage: Page;
  authenticatedContext: BrowserContext;
};

export const test = base.extend<AuthFixtures>({
  // Reuses a logged-in storage state instead of logging in every test
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      // Written once by tests/auth.setup.ts (the 'setup' project). Every
      // other project declares `dependencies: ['setup']`, so this file is
      // guaranteed to exist by the time any test using this fixture runs.
      storageState: 'playwright/.auth/user.json',
    });
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});

export const expect = test.expect;