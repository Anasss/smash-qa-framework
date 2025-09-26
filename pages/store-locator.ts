import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class StoreLocatorPage extends BasePage {
  private readonly searchLocBox: Locator;
  private readonly searchLocBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.searchLocBox = this.page
      .getByRole('combobox', { name: 'Search' })
      .describe('Search box for location');
    this.searchLocBtn = this.page
      .locator('button')
      .filter({ hasText: 'Search' })
      .describe('Button for searching location');
  }

  async gotoLocationsPage() {
    await this.page.goto('https://dev.smashburger.com/locations');
  }

  async gotoLocationsWithReturnUrl(returnUrlPath: string) {
    const encoded = encodeURIComponent(returnUrlPath);
    await this.page.goto(`https://dev.smashburger.com/locations?return_url=${encoded}`);
  }

  async selectOrderType(orderType: string) {
    // If already selected, do nothing
    const orderTypeBtn = this.page.getByRole('button', { name: 'Order Type' });
    const btnText = (await orderTypeBtn.textContent())?.toLowerCase() ?? '';
    if (btnText.includes(orderType.toLowerCase())) {
      return;
    }

    await orderTypeBtn.click();
    // Keep original selection mechanism to avoid behavior change
    await this.page.getByLabel('Pickup').getByText(orderType).click();
  }

  async searchLocation(zipcode: string) {
    this.searchLocBox.click();
    this.searchLocBox.fill(zipcode);
    await this.page.getByRole('option', { name: 'Search for “' + zipcode + '”' }).click();
    this.searchLocBtn.click();
  }

  async chooseFirstLocation() {
    const firstResult = this.page.getByTestId('location-search-result-item').first();
    await expect(firstResult).toBeVisible();
    await firstResult.getByRole('button', { name: 'Start Order' }).click();
  }
}
