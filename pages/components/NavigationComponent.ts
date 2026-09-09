import { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToMenuItem(menuItemName: string) {
    await this.page.getByRole('link', { name: menuItemName, exact: true }).click();
  }
 
  async goToAdmin() { 
    await this.page.locator("//span[text()='Admin']").click();
  }

  async expectMenuItemVisible(menuItemName: string) {
    await this.page.getByRole('link', { name: menuItemName, exact: true }).isVisible();
  }
}