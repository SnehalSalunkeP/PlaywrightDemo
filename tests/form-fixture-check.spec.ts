import { test, expect } from '../fixtures';

test('form fixture fills job title form @smoke', async ({ authenticatedPage, form }) => {
  await authenticatedPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/addJobTitle');
  await form.fillField('Job Title', 'QA Automation Engineer ' + Date.now()); // unique name avoids duplicate errors
  await form.submit();
  await form.expectSuccessMessage();
});