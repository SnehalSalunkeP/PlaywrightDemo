import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ENV } from '../config/environment';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();

    await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();

    // Save authentication state
    await page.context().storageState({ path: authFile });
});