import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { EmployeeDetailsPage } from '../src/pages/employee-details.page';
import employee from '../test-data/employee.json';

const testEmployeeId = `QA${Date.now().toString().slice(-6)}`;

test('Create an employee using JSON test data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const employeePage = new EmployeeDetailsPage(page);

  await loginPage.open();
  await loginPage.login('Admin', 'admin123');

  await employeePage.openAddEmployee();

  await employeePage.addEmployee(
    employee.firstName,
    employee.middleName,
    employee.lastName,
    testEmployeeId
  );
});

test('Edit Job Title and Employment Status for the existing employee', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const employeePage = new EmployeeDetailsPage(page);

  await loginPage.open();
  await loginPage.login('Admin', 'admin123');

  // Open Employee List
  await page.getByRole('link', { name: 'PIM' }).click();

  await expect(
    page.getByRole('heading', { name: 'Employee Information' })
  ).toBeVisible();

 // Search for the existing employee using Employee ID
const employeeIdField = page
  .locator('.oxd-input-group')
  .filter({ hasText: 'Employee Id' })
  .locator('input');

await employeeIdField.fill(testEmployeeId);
await page.getByRole('button', { name: 'Search' }).click();

const employeeRow = page
  .getByRole('row')
  .filter({
    has: page.getByRole('cell', { name: testEmployeeId, exact: true }),
  });
await expect(employeeRow).toHaveCount(1);
await employeeRow.locator('button:has(i.bi-pencil-fill)').click();
await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);

  // Update Job Title and Employment Status
  await employeePage.editJobDetails(
    employee.jobTitle,
    employee.employmentStatus
  );
});
