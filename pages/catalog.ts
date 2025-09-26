import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class CatalogPage extends BasePage {
  private readonly chooseLocationLink: Locator;
  private readonly orderNowBtn: Locator;
  private readonly createYourOwnHeading: Locator;
  private readonly startOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.chooseLocationLink = this.page
      .getByRole('link', { name: 'Choose a location to order' })
      .describe('Choose location link');
    this.orderNowBtn = this.page.getByRole('banner').getByRole('link', { name: 'Order Now' });
    this.createYourOwnHeading = this.page
      .getByRole('heading', { name: 'CREATE YOUR OWN' })
      .describe('Create Your Own heading');
    this.startOrderLink = this.page
      .getByRole('link', { name: 'Start an Order' })
      .describe('Start Order link');
  }

  private async dismissConsentIfPresent() {
    try {
      const banner = this.page.locator('#truste-consent-track');
      if ((await banner.count()) && (await banner.isVisible())) {
        const close = this.page.locator('#truste-consent-close');
        if ((await close.count()) && (await close.isVisible())) {
          await close.click();
          return;
        }
        const accept = this.page.getByRole('button', { name: /Accept|Agree|OK|Close|Got it/i });
        if (await accept.count()) {
          await accept.first().click();
        }
      }
    } catch (_) {}
  }

  private async ensureOnMenu() {
    // If not already on a /menu route, go there directly.
    const url = this.page.url();
    if (!/\/menu(\b|\/|\?|#)/.test(url)) {
      await this.page.goto('/menu');
    }
    // Wait for the primary category anchor to be visible; if it flakes, retry by reloading /menu once.
    const anchor = this.page.getByRole('link', { name: 'SMASHBURGERS' });
    try {
      await anchor.first().waitFor({ state: 'visible', timeout: 4000 });
    } catch {
      await this.page.goto('/menu');
      await anchor.first().waitFor({ state: 'visible', timeout: 6000 });
    }
  }

  async gotoMenuPage() {
    await this.page.goto('/menu');
  }

  async clickChooseLocation() {
    this.chooseLocationLink.click();
  }

  async clickOrderNow() {
    this.orderNowBtn.click();
  }

  async clickMenuOption(menuItem: string) {
    await this.dismissConsentIfPresent();
    await this.ensureOnMenu();
    await this.page.getByRole('link', { name: menuItem }).click();
  }

  async clickSubMenuOption(subMenuItem: string) {
    await this.page.getByRole('link', { name: subMenuItem, exact: true }).click();
  }

  // Directly open Create Your Own product category, skipping category/subcategory clicks.
  async gotoCreateYourOwnDirect() {
    await this.page.goto('/menu/smashburgers/create-your-own');
    await this.createYourOwnHeading.first().waitFor({ state: 'visible' });
    // If the page still shows a Start Order link (common after location changes), click it to open the builder.
    try {
      if ((await this.startOrderLink.count()) && (await this.startOrderLink.isVisible())) {
        await this.startOrderLink.click();
      }
    } catch {}
    // Rely on the heading presence; ProductPage will assert step-by-step readiness.
  }
}
