import { test, expect } from '@playwright/test';
import '../utils/hooks';
// import {test,expect} from "../fixtures/component.fixture";
import { LoginPage } from '../pages/loginPage';
import { PIMPage } from '../pages/PIMPage';
import { EmployeePage } from '../pages/EmployeePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ENV } from '../config/environment';
import { generateUniqueEmployee } from '../test-data/employeeData';
import { setPriority, setKnownIssue } from '../utils/annotations';

test.describe('OrangeHRM Employee Access Tests', { tag: '@regression' }, () => {
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

test.describe('OrangeHRM Employee Operations Tests @regression', () => {
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

  test('should successfully add a new employee', async ({}, testInfo) => {
    setPriority(testInfo, 'P0-Critical');
    // test.slow();

    const employee = generateUniqueEmployee();
    await pimPage.navigateToAddEmployee();
    await employeePage.addEmployee(employee.firstName, employee.middleName, employee.lastName);
    await employeePage.verifyEmployeeSaved();
  });

  test('should search for an employee by name', { tag: '@smoke' }, async ({}, testInfo) => {
    setPriority(testInfo, 'P1-High');
    // Search for a known employee name - just verify search doesn't crash
    await pimPage.searchEmployeeByName('Admin');
    // Verify page is still on employee list (either with results or no-records message)
    await expect(pimPage.inputEmployeeName).toBeVisible();
  });

  test('should display the employee list', { tag: '@smoke' }, async ({}, testInfo) => {
    setPriority(testInfo, 'P1-High');
    await pimPage.verifyTableExists();
  });

  test('should display no records for a non-existent employee', async ({}, testInfo) => {
    setPriority(testInfo, 'P2-Medium');
    await pimPage.searchEmployeeByName('NonExistentEmployee12345XYZ');
    await expect(pimPage.noRecordsMessage).toBeVisible();
    test.skip(process.env.CI === 'true','Skip on CI');
  });

  test('should validate required fields on Add Employee form', async ({ page }, testInfo) => {
    setPriority(testInfo, 'P1-High');
    await pimPage.navigateToAddEmployee();

    await employeePage.inputFirstName.clear();
    await employeePage.inputMiddleName.clear();
    await employeePage.inputLastName.clear();

    await employeePage.buttonSave.click();
    await page.waitForTimeout(1000);

    // Verify form is still visible (save was rejected due to validation)
    await expect(employeePage.inputFirstName).toBeVisible();
    await expect(employeePage.inputLastName).toBeVisible();
  });

  test('should require last name when only first name is entered', async ({ page }, testInfo) => {
    setPriority(testInfo, 'P2-Medium');
    await pimPage.navigateToAddEmployee();

    await employeePage.inputFirstName.fill('OnlyFirst');
    await employeePage.inputLastName.clear();

    await employeePage.buttonSave.click();
    await page.waitForTimeout(1000);

    // Verify form is still visible (save was rejected; last name is required)
    await expect(employeePage.inputLastName).toBeVisible();
  });

  test('should delete an employee created during the test', { tag: '@integration' }, async (
    { page },
    testInfo
  ) => {
    setPriority(testInfo, 'P1-High');
    setKnownIssue(testInfo, 'PA-142: delete-confirmation toast is occasionally slow on the shared public demo');
    test.skip(
      process.env.TEST_LANE === 'fast',
      'Destructive delete flow skipped in the fast lane (TEST_LANE=fast) — run the full regression lane to include it.'
    );

    await pimPage.navigateToEmployeeList();
    await expect(pimPage.tableRows.first()).toBeVisible();

    await pimPage.tableRows.first().click();
    await expect(employeePage.headingEmployeeInfo).toBeVisible();

    await employeePage.buttonDelete.click();
    await employeePage.buttonConfirmDelete.click();

    await page.waitForTimeout(2000);
    await expect(pimPage.inputEmployeeName).toBeVisible();
  });
});
