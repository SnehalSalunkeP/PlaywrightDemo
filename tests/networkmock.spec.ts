import { test, expect } from '../fixtures';

test.describe('API Mocking tests @regression @integration', () => {
  test("mocks a fruit and doesn't call api", async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
  });
  await page.goto('https://demo.playwright.dev/api-mocking');

  await expect(page.getByText('Strawberry')).toBeVisible();
  const response = await page.request.get('https://dummy-site.com/api/v1/fruits');
  const fruits = await response.json();

  expect(fruits).toHaveLength(2);

  expect(fruits[0].name).toBe('Strawberry');

});
});


test.describe('Request Interception', () => {

test('should capture request details', async ({ page }) => {

let requestUrl = '';
let requestMethod = '';
page.on('request', request => {
if (request.url().includes('/api/v1/fruits')) {
requestUrl = request.url();
requestMethod = request.method();
}
});

await page.route('**/api/v1/fruits', async route => {
await route.fulfill({
json: []
});
});
await page.goto('data:text/html,<html></html>');
await page.evaluate(async () => {
await fetch('/api/v1/fruits');
});
expect(requestMethod).toBe('GET');
expect(requestUrl).toContain('/api/v1/fruits');
});

});


test.describe('Network Timeout Handling', () => {
test('should simulate delayed response', async ({ page }) => {
await page.route('**/api/v1/fruits', async route => {
await new Promise(resolve =>
setTimeout(resolve, 10000)
);
await route.fulfill({status: 200,
json: [
{id: 1,name: 'Banana'}
]
});

});

const start = Date.now();
const response = await page.request.get('https://dummy-site.com/api/v1/fruits');
const end = Date.now();
expect(response.ok()).toBeTruthy();
expect(end - start).toBeGreaterThan(9000);

});
});


test.describe('Offline Mode', () => {
test('should fail api request in offline mode',
async ({ page, context }) => {
await context.setOffline(true);
await page.goto('data:text/html,<html></html>');
const result = await page.evaluate(async () => {
try {
await fetch('https://dummy-site.com/api/v1/fruits');
return 'success';
} catch {
return 'offline-error';
}
});
expect(result).toBe('offline-error');
await context.setOffline(false);
});
});