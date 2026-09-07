import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/loginPage';
import { ENV } from '../config/environment';

test.describe('OrangeHRM Dashboard Tests', () => {
    test.use({
        storageState: 'playwright/.auth/user.json'
    });

    test('should be able to logout in app', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const loginPage = new LoginPage(page);

        await page.goto('/web/index.php/dashboard/index', { waitUntil: 'domcontentloaded' });

        if (page.url().includes('/auth/login')) {
            await loginPage.navigateToLoginPage();
            await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
            await loginPage.verifyLoginSuccessful();
        }

        await dashboardPage.verifyDashboardDisplayed();
        await dashboardPage.logout();
        await dashboardPage.verifyLoggedOut();
    });
});

