import { test as pagesTest } from './pages';
import { selectPickupAtZip, navigateToCreateYourOwn } from '../utils/flows';

type Flows = {
  bootstrapPickupAtZip: (zip: string) => Promise<void>;
  gotoCreateYourOwn: () => Promise<void>;
};

// Combine existing pages fixture with extra flow helpers.
export const test = pagesTest.extend<Flows>({
  bootstrapPickupAtZip: async ({ product, storeLocator }, use) => {
    await use(async (zip: string) => {
      await selectPickupAtZip(product, storeLocator, zip);
    });
  },

  gotoCreateYourOwn: async ({ catalog }, use) => {
    await use(async () => {
      await navigateToCreateYourOwn(catalog);
    });
  },
});

export const expect = pagesTest.expect;
