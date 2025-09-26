import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { Burger } from '../domain/types';

export class ProductPage extends BasePage {
  private readonly startOrder: Locator;
  private readonly createYourOwnHeading: Locator;
  private readonly burgerSizeList: Locator;
  private readonly chooseBunText: Locator;
  private readonly pickCheeseText: Locator;
  private readonly pickExtraCheeseText: Locator;
  private readonly chooseToppingsText: Locator;
  private readonly chooseSauceText: Locator;
  private readonly chooseAddOnsText: Locator;
  private readonly addToCartButton: Locator;
  private readonly proceedToCheckoutLink: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.startOrder = page
      .getByRole('link', { name: 'Start an Order' })
      .describe('Start Order link');
    this.createYourOwnHeading = page
      .getByRole('heading', { name: 'CREATE YOUR OWN' })
      .describe('Create Your Own heading');
    this.burgerSizeList = page
      .getByRole('button', { name: 'Pick a Size Double Beef' })
      .describe('Burger size options dropdown');
    this.chooseBunText = page
      .getByText('Choose an Artisan Bun')
      .describe('Choose bun instruction text');
    this.pickCheeseText = page.getByText('Pick 1 Cheese').describe('Pick cheese instruction text');
    this.pickExtraCheeseText = page
      .getByText('Extra Cheese')
      .describe('Pick extra cheese instruction text');
    this.chooseToppingsText = page
      .getByText('Choose Your Toppings')
      .describe('Choose toppings instruction text');
    this.chooseSauceText = page
      .getByText('Choose Your Sauce')
      .describe('Choose sauce instruction text');
    this.chooseAddOnsText = page
      .getByText('Premium Add-Ons')
      .describe('Choose add-ons instruction text');
    this.addToCartButton = page
      .getByRole('button', { name: 'Add to Cart - $' })
      .describe('Add to Cart button');
    this.confirmationMessage = page
      .getByLabel('CREATE YOUR OWN has been')
      .getByText('CREATE YOUR OWN')
      .describe('Add to cart confirmation message');
    this.proceedToCheckoutLink = page
      .getByRole('link', { name: 'Proceed to checkout' })
      .describe('Proceed to checkout link');
  }

  private getSizeOption(size: string): Locator {
    // Prefer exact text to avoid matching similar sizes
    return this.page.getByText(size, { exact: true });
  }
  private getBunOption(bun: string): Locator {
    return this.page
      .getByRole('radio', { name: this.nameStartsWith(bun) })
      .describe(`${bun} bun option`);
  }
  private getCheeseOption(cheese: string): Locator {
    return this.page
      .getByRole('radio', { name: this.nameStartsWith(cheese) })
      .describe(`${cheese} cheese option`);
  }
  private getToppingOption(topping: string): Locator {
    // Anchor at start to avoid matching similar items
    return this.page
      .getByRole('checkbox', { name: this.nameStartsWith(topping) })
      .describe(`${topping} topping option`);
  }
  private getExtraCheeseOption(extra: string): Locator {
    return this.page
      .getByRole('checkbox', { name: this.nameStartsWith(extra) })
      .describe(`${extra} extra cheese option`);
  }
  private getSauceOption(sauce: string): Locator {
    return this.page
      .getByRole('checkbox', { name: this.nameStartsWith(sauce) })
      .describe(`${sauce} sauce option`);
  }
  private getPremiumOption(premium: string): Locator {
    return this.page
      .getByRole('checkbox', { name: this.nameStartsWith(premium) })
      .describe(`${premium} premium add-on option`);
  }

  // Build regex that matches accessible names, allowing for trailing words like "Add 5 Calories"
  private nameStartsWith(label: string): RegExp {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`^${escaped}(\\b|\\s)`, 'i');
  }

  async gotoCreateYourOwn() {
    await this.page.goto('/menu/smashburgers/create-your-own');
  }
  async clickStartOrder() {
    await expect(this.startOrder).toBeVisible();
    await this.startOrder.click();
  }
  private async dismissConsentIfPresent() {
    try {
      const banner = this.page.locator('#truste-consent-track');
      if (await banner.count()) {
        if (await banner.isVisible()) {
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
      }
    } catch (e) {}
  }

  async createBurger(burger: Burger) {
    await expect(this.createYourOwnHeading).toBeVisible();
    const sizeOption = this.getSizeOption(burger.size);
    await expect(sizeOption).toBeVisible();
    await sizeOption.click();

    await expect(this.chooseBunText).toBeVisible();
    const bunOption = this.getBunOption(burger.bun);
    await expect(bunOption).toBeVisible();
    await bunOption.check();

    await expect(this.pickCheeseText).toBeVisible();
    const cheeseOption = this.getCheeseOption(burger.cheese);
    await expect(cheeseOption).toBeVisible();
    await cheeseOption.check();

    if (burger.extraCheese) {
      for (const extra of burger.extraCheese) {
        const extraCheeseOption = this.getExtraCheeseOption(extra);
        await extraCheeseOption.check();
      }
    }

    if (burger.toppings) {
      for (const topping of burger.toppings) {
        const toppingOption = this.getToppingOption(topping);
        await toppingOption.check();
      }
    }

    if (burger.sauces) {
      for (const sauce of burger.sauces) {
        const sauceOption = this.getSauceOption(sauce);
        await sauceOption.check();
      }
    }

    if (burger.addOns) {
      for (const premium of burger.addOns) {
        const premiumOption = this.getPremiumOption(premium);
        await premiumOption.check();
      }
    }

    // Finalize by adding to cart
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }

  async clickAddToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }

  async clickProceedToCheckout() {
      await this.dismissConsentIfPresent();
      const checkoutLink = this.proceedToCheckoutLink;
      const checkoutBtn = this.page.getByRole('button', { name: /checkout/i });
      // Wait for either a 'Proceed to checkout' link or a 'Checkout' button to appear
      await Promise.race([
        checkoutLink.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
        checkoutBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
      ]);
      if (await checkoutLink.isVisible()) {
        await checkoutLink.click();
      } else if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
      } else {
        // As a last resort, navigate to the cart/checkout via header/cart link if present
        const cartLink = this.page.getByRole('link', { name: /cart|view cart/i });
        if (await cartLink.count()) {
          await cartLink.first().click();
        }
      }
  }
}
