import { Locator, Page } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

export class LoginPage {
    readonly page: Page;
    readonly inputUsername: Locator;
    readonly inputPassword: Locator;
    readonly buttonLogin: Locator;
    readonly headingLogin: Locator;
    readonly messageInvalidCredentials: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputUsername = page.getByPlaceholder('Username');
        this.inputPassword = page.getByPlaceholder('Password');
        this.buttonLogin = page.getByRole('button', { name: 'Login' });
        this.headingLogin = page.getByRole('heading', { name: 'Login' });
        this.messageInvalidCredentials = page.getByText('Invalid credentials');
    }

    async navigateToLoginPage(){
        await this.page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
    }

    async login(username: string, password: string){
        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.buttonLogin.click();
    }

    async verifyLoginPageDisplayed() {
        await this.headingLogin.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.inputUsername.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.inputPassword.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.buttonLogin.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    }

    async verifyLoginSuccessful(){
        await this.page.waitForURL(/dashboard/, { timeout: TIMEOUTS.MEDIUM });
    }

    async verifyLoginFailed() {
        await this.messageInvalidCredentials.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    }
}


