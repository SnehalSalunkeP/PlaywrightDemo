import { test, expect } from '../../fixtures';

test('nav fixture can navigate to PIM module @smoke', async ({ authenticatedPage, nav }) => {
  await authenticatedPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  await nav.goToMenuItem('PIM');
  await expect(authenticatedPage.getByRole('heading', { name: 'PIM' })).toBeVisible();
});