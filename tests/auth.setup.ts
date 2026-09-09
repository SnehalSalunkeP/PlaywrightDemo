import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ENV } from '../config/environment';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();

    await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    await loginPage.verifyLoginSuccessful();

    // Belt-and-braces: assert real dashboard content is visible before
    // trusting this session enough to save it. If this fails, every
    // downstream test would otherwise fail with a confusing "element not
    // found" error instead of pointing straight at the real cause here.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });

    // Save authentication state
    await page.context().storageState({ path: authFile });
});
