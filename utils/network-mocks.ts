import { Page } from '@playwright/test';

export async function mockUserProfile(page: Page) {
  await page.route('**/api/user/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'Mock User', role: 'admin' }),
    });
  });
}

export async function mockApiError(page: Page, urlPattern: string, status = 500) {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });
}