import { Locator, expect, Page } from '@playwright/test';
import { TIMEOUTS } from '../config/timeouts';

export class PIMPage {
readonly page: Page;
readonly inputEmployeeName: Locator;
readonly buttonSearch: Locator;
readonly tableRows: Locator;
readonly messageNoRecordsFound: Locator;
readonly headingEmployeeInfo: Locator;
readonly buttonAddEmployee: Locator;
readonly noRecordsMessage: Locator;
readonly successToast: Locator;


constructor(page: Page) {
    this.page = page;

    this.inputEmployeeName = page
        .getByPlaceholder('Type for hints...')
        .first();

    this.buttonSearch = page.getByRole('button', {
        name: 'Search',
        exact: true,
    });

    this.buttonAddEmployee = page.getByRole('link', {
        name: 'Add Employee',
        exact: true,
    });

    this.tableRows = page.locator('.oxd-table-card');

    this.messageNoRecordsFound = page.locator('span', { hasText: 'No Records Found' }).first();

    this.noRecordsMessage = page.locator('span', { hasText: 'No Records Found' }).first();

    this.headingEmployeeInfo = page.getByRole('heading', {
        name: 'Employee Information',
        exact: true,
    });

    this.successToast = page.locator('.oxd-toast--success');
}

async navigateToEmployeeList() {
    await this.page.goto(
        '/web/index.php/pim/viewEmployeeList',
        {
            waitUntil: 'domcontentloaded',
        }
    );

    // Longer timeout for parallel test execution
    await expect(this.inputEmployeeName).toBeVisible({
        timeout: 30000,
    });
}

async navigateToAddEmployee() {
    await this.page.goto(
        '/web/index.php/pim/addEmployee',
        {
            waitUntil: 'domcontentloaded',
        }
    );

    await expect(
        this.page.getByRole('heading', { name: 'Add Employee' })
    ).toBeVisible({
        timeout: 30000,
    });
}

async searchEmployeeByName(name: string) {
    await expect(this.inputEmployeeName).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });

    await this.inputEmployeeName.fill(name);

    await this.buttonSearch.click();

    // Wait for either results or "No Records Found"
    await Promise.race([
        this.tableRows.first().waitFor({
            state: 'visible',
            timeout: TIMEOUTS.MEDIUM,
        }),
        this.noRecordsMessage.waitFor({
            state: 'visible',
            timeout: TIMEOUTS.MEDIUM,
        }),
    ]).catch(() => {});
}

async verifyTableExists() {
    await expect(this.tableRows.first()).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });
}

async verifyNoRecordsFound() {
    await expect(this.messageNoRecordsFound).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });
}

async deleteEmployeeByName(name: string) {
    const employeeRow = this.tableRows
        .filter({
            hasText: name,
        })
        .first();

    await expect(employeeRow).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });

    const checkbox = employeeRow
        .locator('input[type="checkbox"]')
        .first();

    await checkbox.check();

    const deleteButton = this.page.getByRole('button', {
        name: /^Delete$/,
    });

    await deleteButton.click();

    const confirmDeleteButton = this.page.getByRole('button', {
        name: 'Yes, Delete',
        exact: true,
    });

    await confirmDeleteButton.click();

    await expect(this.successToast).toBeVisible({
        timeout: TIMEOUTS.MEDIUM,
    });
}

async clickDeleteButton() {
    const deleteButton = this.page.getByRole('button', {
        name: /^Delete$/,
    });
    await deleteButton.click();
}

async confirmDelete() {
    const confirmDeleteButton = this.page.getByRole('button', {
        name: 'Yes, Delete',
        exact: true,
    });
    await confirmDeleteButton.click();
}


}
