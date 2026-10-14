
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page
      .getByRole('textbox', { name: 'Username' })
      .fill(username);

    await this.page
      .getByRole('textbox', { name: 'Password' })
      .fill(password);

    await this.page
      .getByRole('button', { name: 'Login' })
      .click();

    await expect(this.page).toHaveURL(/\/dashboard\/index/);
  }
}
