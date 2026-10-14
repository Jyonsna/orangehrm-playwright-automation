import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { EmployeeDetailsPage } from '../src/pages/employee-details.page';
import employee from '../test-data/employee.json';

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
    employee.employeeId
  );

  await expect(
    page.getByRole('heading', { name: 'Personal Details' })
  ).toBeVisible();
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

await employeeIdField.fill(employee.employeeId);
await page.getByRole('button', { name: 'Search' }).click();

// Wait for OrangeHRM to update the results
await expect(page.getByText('No Records Found', { exact: true }))
  .toBeHidden({ timeout: 10000 }).catch(() => {});

// Print the table contents for debugging
console.log(
  'Search results:',
  await page.locator('.oxd-table-body').innerText()
);

  // Update Job Title and Employment Status
  await employeePage.editJobDetails('QA Engineer', 'Full-Time');
});