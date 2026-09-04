import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ENV } from '../config/environment';

test.describe('OrangeHRM Login Tests', () => {
    test.use({
        storageState: {
            cookies: [],
            origins: []
        }
    });

    test('should login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
        await loginPage.verifyLoginSuccessful();
    });

    test('should receive an error with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.login('InvalidUser', 'wrongpassword');
        await loginPage.verifyLoginFailed();
    });
});