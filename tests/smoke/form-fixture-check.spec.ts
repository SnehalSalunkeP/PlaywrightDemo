import { test, expect } from '../../fixtures';

test('form fixture fills job title form @smoke', async ({ authenticatedPage, form, page }) => {
  await authenticatedPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
  await page.locator('button:has-text("Job")').click();
  await page.locator('button:has-text("Job Titles")').first().click();
  await page.locator('button:has-text("Add")').click();
  await form.fillField('Job Title', 'QA Automation Engineer ' + Date.now()); // unique name avoids duplicate errors
  await form.submit();
  await form.expectSuccessMessage();
});