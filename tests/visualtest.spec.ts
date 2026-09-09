import { test, expect } from '../fixtures';

test.describe('Visual Testing @regression', () => {
  test('dashboard page visual regression', { tag: '@visual' }, async ({ authenticatedPage: page }) => {
    await page.goto('/web/index.php/dashboard/index', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true });
  });

  test('sidebar has expected accessibility structure', async ({ authenticatedPage: page }) => {
    await page.goto('/web/index.php/dashboard/index', { waitUntil: 'domcontentloaded' });
    // No inline expected tree here on purpose: run with --update-snapshots
    // once to generate the baseline .yml against the live sidebar, review
    // it, then commit it. Regenerate whenever the sidebar's menu changes.
    await expect(page.locator('.oxd-sidepanel')).toMatchAriaSnapshot();
  });

  test('employee list table renders correctly (element screenshot)', async ({
    authenticatedPage: page,
  }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
    const table = page.locator('.oxd-table');
    await expect(table).toBeVisible();
    await expect(table).toHaveScreenshot('employee-table.png');
  });
});

test.describe('Cross-browser visual testing @regression', () => {
  // Uses the plain `page` fixture (not authenticatedPage) since the login
  // screen itself is what we're comparing, before any session exists.
  test('login page renders consistently across browsers', { tag: '@visual' }, async ({ page }, testInfo) => {
    await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Screenshot name includes the project (chromium/firefox/webkit) so
    // each browser gets its own baseline instead of overwriting the others.
    await expect(page).toHaveScreenshot(`login-${testInfo.project.name}.png`);
  });
});
