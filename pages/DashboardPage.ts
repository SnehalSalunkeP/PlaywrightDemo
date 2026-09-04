import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

export class DashboardPage {
readonly page: Page;
readonly headingDashboard: Locator;
readonly dropdownUser: Locator;
readonly linkLogout: Locator;
readonly menuPIM: Locator;
readonly menuAdmin: Locator;


constructor(page: Page) {
    this.page = page;

    this.headingDashboard = page.getByRole('heading', {name: 'Dashboard', });

    this.dropdownUser = page.locator('.oxd-topbar-header-userarea');

    this.linkLogout = page.getByRole('menuitem', {name: 'Logout'});

    this.menuPIM = page.getByRole('link', {
        name: 'PIM',
        exact: true,
    });

    this.menuAdmin = page.getByRole('link', {
        name: 'Admin',
        exact: true,
    });
}

async verifyDashboardDisplayed() {
    await expect(this.headingDashboard).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });
}

async navigateToDashboard() {
    await this.page.goto('/web/index.php/dashboard/index', {
        waitUntil: 'domcontentloaded',
    });

    await expect(this.page).toHaveURL(/dashboard\/index/);
}

async navigateToPIM() {
await this.page.goto('/web/index.php/pim/viewEmployeeList',{ waitUntil: 'domcontentloaded' });
// Wait for search input to be visible
await this.page.getByPlaceholder('Type for hints...').first().waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
}


async logout() {
    await this.dropdownUser.click();

    await this.page.getByText('Logout', {
        exact: true,
    }).click();
}

async verifyLoggedOut() {
    await this.page.waitForURL(/auth\/login/, {
        timeout: TIMEOUTS.MEDIUM,
    });
}

}
