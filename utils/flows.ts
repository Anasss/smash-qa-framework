import { Logger } from './logger';

export type StoreLocatorLike = {
  selectOrderType: (type: 'Pickup' | 'Delivery') => Promise<void>;
  searchLocation: (zip: string) => Promise<void>;
  chooseFirstLocation: () => Promise<void>;
};

export type ProductLike = {
  gotoCreateYourOwn: () => Promise<void>;
  clickStartOrder: () => Promise<void>;
};

export type CatalogLike = {
  clickMenuOption: (text: string) => Promise<void>;
  clickSubMenuOption: (text: string) => Promise<void>;
};

// Selects pickup order at a given zipcode from the standard entry path
export async function selectPickupAtZip(
  product: ProductLike,
  locator: StoreLocatorLike,
  zip: string
) {
  const log = Logger.get('flows:pickup');
  const t0 = Date.now();

  // Single navigation entry that matches existing tests
  await product.gotoCreateYourOwn();
  const tGoto = Date.now();
  await product.clickStartOrder();
  const tStart = Date.now();
  await locator.selectOrderType('Pickup');
  const tOrderType = Date.now();
  await locator.searchLocation(zip);
  const tSearch = Date.now();
  await locator.chooseFirstLocation();
  const tChoose = Date.now();

  log.info('timing', {
    totalMs: tChoose - t0,
    gotoCreateYourOwnMs: tGoto - t0,
    clickStartOrderMs: tStart - tGoto,
    selectOrderTypeMs: tOrderType - tStart,
    searchLocationMs: tSearch - tOrderType,
    chooseFirstLocationMs: tChoose - tSearch,
  });
}

// Navigates the menu to Create Your Own path
export async function navigateToCreateYourOwn(catalog: CatalogLike) {
  const log = Logger.get('flows:menu');
  const t0 = Date.now();
  await catalog.clickMenuOption('SMASHBURGERS');
  const tMenu = Date.now();
  await catalog.clickSubMenuOption('CREATE YOUR OWN');
  const tSub = Date.now();
  log.info('timing', {
    totalMs: tSub - t0,
    clickMenuOptionMs: tMenu - t0,
    clickSubMenuOptionMs: tSub - tMenu,
  });
}
