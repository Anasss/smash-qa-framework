import { expect, Page, Locator } from '@playwright/test';
import { Burger } from '../domain/types';

export class OrderConfirmationPage {
  private readonly page: Page;
  private readonly thankYouHeading: Locator;
  private readonly thankYouH1: Locator;
  private readonly orderNumberH2: Locator;
  private readonly orderPlacedRow: Locator;
  private readonly orderPlacedTime: Locator;
  private readonly pickupDateRow: Locator;
  private readonly pickupDateTime: Locator;
  private readonly pickupFromButton: Locator;
  private readonly orderSummaryButton: Locator;
  private readonly totals: Locator;
  private readonly bagFeeText: Locator;

  constructor(page: Page) {
    this.page = page;
    // Headings
    this.thankYouHeading = page
      .getByRole('heading', { name: 'Thank You' })
      .describe('Thank You heading');
    this.thankYouH1 = page.getByRole('heading', { level: 1, name: 'Thank You' }).describe('H1 Thank You');
    this.orderNumberH2 = page
      .getByRole('heading', { level: 2 })
      .filter({ hasText: /^Order #/ })
      .first()
      .describe('Order number h2');

    // Meta rows and times
    this.orderPlacedRow = page.getByText(/^Order placed/).describe('Order placed row');
    this.orderPlacedTime = this.orderPlacedRow.locator('time').first().describe('Order placed <time>');
    this.pickupDateRow = page.getByText(/^For pickup on/).describe('Pickup date row');
    this.pickupDateTime = this.pickupDateRow.locator('time').first().describe('Pickup date <time>');

    // Disclosure buttons
    this.pickupFromButton = page
      .getByRole('button')
      .filter({ hasText: /^Pickup From:/ })
      .first()
      .describe('Pickup From button');
    this.orderSummaryButton = page
      .getByRole('button', { name: /Order Summary/ })
      .first()
      .describe('Order Summary button');

    // Totals and fee
    this.totals = page.locator('dl').describe('Totals section');
    this.bagFeeText = page.getByText(/Bag Fee\$/).describe('Bag Fee label');
  }

  async waitForLoaded() {
    try {
      await expect(this.page).not.toHaveURL(/.*checkout/, { timeout: 10000 });
    } catch (_) {
      // Continue to content checks
    }
    await Promise.all([
      this.thankYouHeading.waitFor({ state: 'visible' }),
      this.orderNumberH2.waitFor({ state: 'visible' }),
    ]);
  }

  async getOrderNumber(): Promise<string | null> {
    const text = (await this.orderNumberH2.textContent())?.trim() ?? '';
    const m = text.match(/Order #([0-9]+)/);
    return m?.[1] ?? null;
  }

  async verifyPickupFromContains(...snippets: string[]) {
    await expect(this.pickupFromButton).toBeVisible();
    for (const s of snippets) {
      await expect(this.pickupFromButton).toContainText(new RegExp(s, 'i'));
    }
  }

  async verifyMetaTimes() {
    await Promise.all([
      expect(this.orderPlacedRow).toBeVisible(),
      expect(this.orderPlacedTime).toBeVisible(),
      expect(this.pickupDateRow).toBeVisible(),
      expect(this.pickupDateTime).toBeVisible(),
    ]);
  }

  async verifyOrderConfirmationWithOptions(burger: Burger) {
    // await this.waitForLoaded();

    // Header and meta sections
    await Promise.all([
      expect(this.thankYouH1).toContainText('Thank You'),
      expect(this.orderNumberH2).toBeVisible(),
    ]);
    await this.verifyMetaTimes();

    // Pickup From: verify visible and contains city/zip if present in DOM label
    await expect(this.pickupFromButton).toBeVisible();

    // Expand Order Summary just once to reveal totals if collapsed
    await this.orderSummaryButton.click();

    // Core burger attributes
    const checks: Array<Promise<unknown>> = [
      expect(this.totals).toContainText(new RegExp(burger.size, 'i')),
      expect(this.totals).toContainText(new RegExp(burger.bun, 'i')),
      expect(this.totals).toContainText(new RegExp(burger.cheese, 'i')),
    ];

    if (burger.extraCheese?.length) {
      for (const extra of burger.extraCheese) {
        checks.push(expect(this.totals).toContainText(new RegExp(extra, 'i')));
      }
    }
    if (burger.toppings?.length) {
      for (const topping of burger.toppings) {
        checks.push(expect(this.totals).toContainText(new RegExp(topping, 'i')));
      }
    }
    if (burger.sauces?.length) {
      for (const sauce of burger.sauces) {
        checks.push(expect(this.totals).toContainText(new RegExp(sauce, 'i')));
      }
    }
    if (burger.addOns?.length) {
      for (const addOns of burger.addOns) {
        checks.push(expect(this.totals).toContainText(new RegExp(addOns, 'i')));
      }
    }

    checks.push(expect(this.bagFeeText).toBeVisible());
    checks.push(expect(this.totals).toBeVisible());

    await Promise.all(checks);
  }
}
