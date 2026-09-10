# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: networkmock.spec.ts >> Network Timeout Handling >> should simulate delayed response
- Location: tests\networkmock.spec.ts:53:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1   | import { test, expect } from '../fixtures';
  2   | 
  3   | test.describe('API Mocking tests @regression @integration', () => {
  4   |   test("mocks a fruit and doesn't call api", async ({ page }) => {
  5   |   await page.route('*/**/api/v1/fruits', async route => {
  6   |     const json = [{ name: 'Strawberry', id: 21 }];
  7   |     await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
  8   |   });
  9   |   await page.goto('https://demo.playwright.dev/api-mocking');
  10  | 
  11  |   await expect(page.getByText('Strawberry')).toBeVisible();
  12  |   const response = await page.request.get('https://dummy-site.com/api/v1/fruits');
  13  |   const fruits = await response.json();
  14  | 
  15  |   expect(fruits).toHaveLength(2);
  16  | 
  17  |   expect(fruits[0].name).toBe('Strawberry');
  18  | 
  19  | });
  20  | });
  21  | 
  22  | 
  23  | test.describe('Request Interception', () => {
  24  | 
  25  | test('should capture request details', async ({ page }) => {
  26  | 
  27  | let requestUrl = '';
  28  | let requestMethod = '';
  29  | page.on('request', request => {
  30  | if (request.url().includes('/api/v1/fruits')) {
  31  | requestUrl = request.url();
  32  | requestMethod = request.method();
  33  | }
  34  | });
  35  | 
  36  | await page.route('**/api/v1/fruits', async route => {
  37  | await route.fulfill({
  38  | json: []
  39  | });
  40  | });
  41  | await page.goto('data:text/html,<html></html>');
  42  | await page.evaluate(async () => {
  43  | await fetch('/api/v1/fruits');
  44  | });
  45  | expect(requestMethod).toBe('GET');
  46  | expect(requestUrl).toContain('/api/v1/fruits');
  47  | });
  48  | 
  49  | });
  50  | 
  51  | 
  52  | test.describe('Network Timeout Handling', () => {
  53  | test('should simulate delayed response', async ({ page }) => {
  54  | await page.route('**/api/v1/fruits', async route => {
  55  | await new Promise(resolve =>
  56  | setTimeout(resolve, 10000)
  57  | );
  58  | 
  59  | await route.fulfill({
  60  | 
  61  | status: 200,
  62  | 
  63  | json: [
  64  | 
  65  | {
  66  | 
  67  | id: 1,
  68  | 
  69  | name: 'Banana'
  70  | 
  71  | }
  72  | 
  73  | ]
  74  | 
  75  | });
  76  | 
  77  | });
  78  | 
  79  | const start = Date.now();
  80  | 
  81  | const response = await page.request.get('https://dummy-site.com/api/v1/fruits');
  82  | 
  83  | const end = Date.now();
  84  | 
> 85  | expect(response.ok()).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  86  | expect(end - start).toBeGreaterThan(9000);
  87  | 
  88  | });
  89  | });
  90  | 
  91  | 
  92  | test.describe('Offline Mode', () => {
  93  | test('should fail api request in offline mode',
  94  | async ({ page, context }) => {
  95  | await context.setOffline(true);
  96  | await page.goto('data:text/html,<html></html>');
  97  | const result = await page.evaluate(async () => {
  98  | try {
  99  | await fetch('https://dummy-site.com/api/v1/fruits');
  100 | return 'success';
  101 | } catch {
  102 | return 'offline-error';
  103 | }
  104 | });
  105 | expect(result).toBe('offline-error');
  106 | await context.setOffline(false);
  107 | });
  108 | });
```