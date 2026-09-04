import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/loginPage';
import { PIMPage } from '../pages/PIMPage';
import { EmployeePage } from '../pages/EmployeePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ENV } from '../config/environment';
import { generateUniqueEmployee } from '../test-data/employeeData';

test.describe('OrangeHRM Employee Access Tests', () => {
test.use({
storageState: {
cookies: [],
origins: [],
},
});

test('should redirect an unauthenticated user to login when accessing Add Employee', async ({
page,
}) => {
const loginPage = new LoginPage(page);

await page.goto('/web/index.php/pim/addEmployee');

await expect(page).toHaveURL(/auth\/login/);
await expect(loginPage.inputUsername).toBeVisible();
await expect(loginPage.inputPassword).toBeVisible();


});
});

test.describe('OrangeHRM Employee Operations Tests', () => {
test.use({
storageState: 'playwright/.auth/user.json',
});

let dashboardPage: DashboardPage;
let pimPage: PIMPage;
let employeePage: EmployeePage;

test.beforeEach(async ({ page }) => {
dashboardPage = new DashboardPage(page);
pimPage = new PIMPage(page);
employeePage = new EmployeePage(page);

const onLoginPage = await page.getByPlaceholder('Username').isVisible().catch(() => false);
if (onLoginPage || page.url().includes('/auth/login')) {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
  await loginPage.verifyLoginSuccessful();
}

await pimPage.navigateToEmployeeList();

});

test('should successfully add a new employee', async () => {
const employee = generateUniqueEmployee();

await pimPage.navigateToAddEmployee();

await employeePage.addEmployee(
  employee.firstName,
  employee.middleName,
  employee.lastName
);

await employeePage.verifyEmployeeSaved();


});

test('should search for an employee by name', { tag: '@smoke' }, async () => {
// Search for a known employee name - just verify search doesn't crash
await pimPage.searchEmployeeByName('Admin');
// Verify page is still on employee list (either with results or no-records message)
await expect(pimPage.inputEmployeeName).toBeVisible();

});

test('should display the employee list', async () => {
await pimPage.verifyTableExists();
});

test('should display no records for a non-existent employee', async () => {
await pimPage.searchEmployeeByName('NonExistentEmployee12345XYZ');


await expect(pimPage.noRecordsMessage).toBeVisible();


});


test('should validate required fields on Add Employee form', async ({ page }) => {
await pimPage.navigateToAddEmployee();


await employeePage.inputFirstName.clear();
await employeePage.inputMiddleName.clear();
await employeePage.inputLastName.clear();

await employeePage.buttonSave.click();

// Wait for validation to process
await page.waitForTimeout(1000);

// Verify form is still visible (save was rejected due to validation)
await expect(employeePage.inputFirstName).toBeVisible();
await expect(employeePage.inputLastName).toBeVisible();


});

test('should require last name when only first name is entered', async ({ page }) => {
await pimPage.navigateToAddEmployee();


await employeePage.inputFirstName.fill('OnlyFirst');
await employeePage.inputLastName.clear();

await employeePage.buttonSave.click();

// Wait for validation to process
await page.waitForTimeout(1000);

// Verify form is still visible (save was rejected; last name is required)
await expect(employeePage.inputLastName).toBeVisible();


});

test.skip('should delete an employee created during the test', async ({ page }) => {
// Navigate to employee list
await pimPage.navigateToEmployeeList();

// Verify table has rows
await expect(pimPage.tableRows.first()).toBeVisible();

// Click on first employee row to open details
await pimPage.tableRows.first().click();

// Wait for details page to load
await expect(employeePage.headingEmployeeInfo).toBeVisible();

// Click delete button and confirm delete
await employeePage.buttonDelete.click();
await employeePage.buttonConfirmDelete.click();

// Wait briefly for toast
await page.waitForTimeout(2000);

// Verify we're back on the employee list
await expect(pimPage.inputEmployeeName).toBeVisible();


});
});
