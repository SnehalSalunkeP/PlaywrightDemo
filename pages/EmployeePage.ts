import { Page,expect, Locator } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';
import { DashboardPage } from './DashboardPage';

export class EmployeePage {
    readonly page: Page;
    readonly inputFirstName: Locator;
    readonly inputMiddleName: Locator;
    readonly inputLastName: Locator;
    readonly inputEmployeeId: Locator;
    readonly buttonSave: Locator;
    readonly buttonDelete: Locator;
    readonly buttonConfirmDelete: Locator;
    readonly messageSuccess: Locator;
    readonly messageValidationError: Locator;
    readonly headingEmployeeInfo: Locator;
    private lastEmployeeName: string = '';
    

    constructor(page: Page) {
        this.page = page;
        this.inputFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.inputMiddleName = page.getByRole('textbox', { name: 'Middle Name' });
        this.inputLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.inputEmployeeId = page.locator('input').nth(3);
        this.buttonSave = page.getByRole('button', { name: 'Save' });
        this.buttonDelete = page.getByRole('button', { name: 'Delete' });
        this.buttonConfirmDelete = page.getByRole('button', { name: 'Yes, Delete' });
        this.messageSuccess = page.locator('.oxd-toast--success');
        this.messageValidationError = page.locator('.oxd-input__error, .oxd-input-field-error, .oxd-alert--error, [role="alert"]');
        this.headingEmployeeInfo = page.getByRole('heading', { name: 'Employee Information' });
    }


    async addEmployee(firstName: string, middleName: string, lastName: string): Promise<void> {
        if (!firstName?.trim() || !lastName?.trim()) {
            throw new Error('First name and last name are required');
        }

        this.lastEmployeeName =`${firstName} ${lastName}`;

        await this.inputFirstName.fill(firstName);
        await this.inputMiddleName.fill(middleName ?? '');
        await this.inputLastName.fill(lastName);

        if (await this.inputEmployeeId.isVisible().catch(() => false)) {
            const uniqueId = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 9000) + 1000}`;
            await this.inputEmployeeId.fill(uniqueId);
        }

        await this.buttonSave.click();
        await this.page.waitForTimeout(1000);
    }

    async verifyEmployeeSaved(){
    await expect(this.page).toHaveURL(
        /pim\/viewPersonalDetails/,
        {
            timeout: TIMEOUTS.MEDIUM,
        }
    );
    }

    async getCurrentEmployeeId(): Promise<string | null> {
        const match = this.page.url().match(/viewPersonalDetails\/(\d+)/);
        if (match?.[1]) {
            return match[1];
        }

        if (!this.lastEmployeeName) {
            return null;
        }

        await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'domcontentloaded' });
        const searchInput = this.page.getByPlaceholder('Type for hints...').first();
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill(this.lastEmployeeName);
            await this.page.getByRole('button', { name: 'Search' }).click();
            await this.page.waitForTimeout(1000);
        }

        const link = this.page.locator('a[href*="viewPersonalDetails"]').first();
        const href = await link.getAttribute('href').catch(() => null);
        if (!href) {
            return null;
        }

        return href.match(/viewPersonalDetails\/(\d+)/)?.[1] ?? null;
    }

    async deleteEmployee(): Promise<void> {
        await this.buttonDelete.click();
        await this.buttonConfirmDelete.click();
    }

    async verifyEmployeeDeleted(): Promise<void> {
        await this.messageSuccess.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    }
}