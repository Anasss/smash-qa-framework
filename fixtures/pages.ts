import { test as base } from '@playwright/test';
import { CatalogPage } from '../pages/catalog';
import { StoreLocatorPage } from '../pages/store-locator';
import { ProductPage } from '../pages/product';
import { CheckoutFlow } from '../pages/checkout-flow';
import { CartPage } from '../pages/cart';
import { OrderConfirmationPage } from '../pages/order-confirmation';
import {
  CustomerProfile,
  LocationEntry,
  PaymentMethod,
  getCustomerProfiles,
  getLocations,
  getPaymentMethods,
  MockCartItem,
  getMockCartItems,
} from '../utils/testdata';

export type PagesFixture = {
  catalog: CatalogPage;
  storeLocator: StoreLocatorPage;
  product: ProductPage;
  checkout: CheckoutFlow;
  cart: CartPage;
  confirmation: OrderConfirmationPage;
};

export type DataFixture = {
  customers: CustomerProfile[];
  locations: LocationEntry[];
  paymentMethods: PaymentMethod[];
  mockCartItems: MockCartItem[];
};

export const test = base.extend<PagesFixture & DataFixture>({
  // Third-Party Service Blocking — reduce noise and speed up navigation
  page: async ({ page }, use) => {
    const blocklist: string[] = [
      // Google Analytics / Tag Manager / Ads
      '*://www.google-analytics.com/**',
      '*://ssl.google-analytics.com/**',
      '*://www.googletagmanager.com/**',
      '*://*.g.doubleclick.net/**',
      '*://*.doubleclick.net/**',
      '*://*.googlesyndication.com/**',
      // Braze / Amplitude (common marketing/analytics backing)
      '*://*.braze.com/**',
      '*://sdk.iad-01.braze.com/**',
      '*://api.amplitude.com/**',
      '*://cdn.amplitude.com/**',
      // TrustArc (privacy management)
      '*://*.trustarc.com/**',
      '*://consent.trustarc.com/**',
      // Qualtrics (site intercept/feedback)
      '*://*.qualtrics.com/**',
      '*://siteintercept.qualtrics.com/**',
    ];

    for (const pattern of blocklist) {
      // Fast fulfill with 204 to avoid errors while skipping execution
      page.route(pattern, route => route.fulfill({ status: 204, body: '' }));
    }

    // Resource loading optimization — fonts off, animations off
    // Block common web font file types to reduce transfer and layout shifts
    const fontPatterns = ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.otf'];
    for (const fp of fontPatterns) {
      page.route(fp, route => route.fulfill({ status: 204, body: '' }));
    }

    // Disable CSS animations/transitions and smooth scrolling to stabilize interactions
    await page.addStyleTag({
      content: `
        *, *::before, *::after { transition: none !important; animation: none !important; }
        html { scroll-behavior: auto !important; }
        :root { --reduced-motion: reduce; }
      `,
    });

    await use(page);
  },
  catalog: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  storeLocator: async ({ page }, use) => {
    await use(new StoreLocatorPage(page));
  },
  product: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutFlow(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  confirmation: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
  // Data fixtures (test-scoped for simplicity; optimize to worker if needed)
  customers: async ({}, use) => {
    await use(getCustomerProfiles());
  },
  locations: async ({}, use) => {
    await use(getLocations());
  },
  paymentMethods: async ({}, use) => {
    await use(getPaymentMethods());
  },
  mockCartItems: async ({}, use) => {
    await use(getMockCartItems());
  },
});

export { expect } from '@playwright/test';
