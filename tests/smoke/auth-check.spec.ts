import { test, expect } from '../../fixtures';

test('lands on dashboard without logging in manually @smoke', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});