import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async click(locator: Locator) {
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }
}
