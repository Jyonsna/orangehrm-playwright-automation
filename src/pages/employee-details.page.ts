import { Page, expect } from '@playwright/test';

export class EmployeeDetailsPage {
  constructor(private readonly page: Page) {}

  async openAddEmployee() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await this.page.getByRole('button', { name: 'Add' }).click();

    await expect(
      this.page.getByRole('heading', { name: 'Add Employee' })
    ).toBeVisible();
  }

  async addEmployee(
    firstName: string,
    middleName: string,
    lastName: string,
    employeeId: string
  ) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Middle Name').fill(middleName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);

    const idField = this.page
      .locator('form')
      .getByRole('textbox')
      .nth(3);

    await idField.fill(employeeId);
    await this.page.getByRole('button', { name: 'Save' }).click();

    await expect(
      this.page.getByRole('heading', { name: 'Personal Details' })
    ).toBeVisible();
  }

  async openEmployeeJobDetails() {
    await this.page.getByRole('tab', { name: 'Job' }).click();

    await expect(
      this.page.getByText('Job Details', { exact: true }).last()
    ).toBeVisible();
  }

  async editJobDetails(
    jobTitle: string,
    employmentStatus: string
  ) {
    await this.openEmployeeJobDetails();

    // Enable editing in the Job Details section
    await this.page.locator('.orangehrm-edit-employee').getByRole('button').click();

    // Select the Job Title using OrangeHRM's custom dropdown
    const jobTitleField = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Job Title' })
      .locator('.oxd-select-text');

    await jobTitleField.click();
    await this.page.getByRole('option', { name: jobTitle }).click();

    // Select the Employment Status
    const employmentStatusField = this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employment Status' })
      .locator('.oxd-select-text');

    await employmentStatusField.click();
    await this.page.getByRole('option', { name: employmentStatus }).click();

    // Save the changes
    await this.page.getByRole('button', { name: 'Save' }).last().click();

    // Confirm the Job Details section is visible after saving
    await expect(
      this.page.getByText('Job Details', { exact: true }).last()
    ).toBeVisible();
  }
}