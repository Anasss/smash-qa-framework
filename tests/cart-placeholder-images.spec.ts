import { test } from '../fixtures/pages';
import { Logger } from '../utils/logger';

/**
 * @precondition
 * - User navigates to menu page
 * - User adds multiple menu items to cart
 * @expected
 * - All cart items with placeholder images display mock image
 */

test('Cart displays mock images for items with placeholder thumbnails', async ({
  page,
  catalog: menu,
  storeLocator: location,
  checkout,
  cart,
  locations,
  mockCartItems,
}) => {
  // Start from the Locations page 
  await location.gotoLocationsPage();
  await location.selectOrderType('Pickup');
  const denverPickup = locations.find(l => l.type === 'pickup' && l.zipCode === '80246') ?? locations[0];
  await location.searchLocation(denverPickup.zipCode);
  await location.chooseFirstLocation();

  const log = Logger.get('tests:cart-placeholder-images');
  // Use data-driven items from fixtures
  for (const orderItem of mockCartItems) {
    log.info(`Order a ${orderItem.subMenuOption}`);
    await menu.clickMenuOption(orderItem.menuOption);
    await menu.clickSubMenuOption(orderItem.subMenuOption);
    // Some PDPs may not expose a numeric spinbutton; only set quantity when present.
    const hasSpin = await page.getByRole('spinbutton').count();
    if (hasSpin > 0) {
      await checkout.editOrderQty(orderItem.qty);
    }
    await checkout.clickAddToCart();
    await checkout.clickReturnToMenu();
  }

  await cart.viewCart();
  // Intercept placeholder image requests and fulfill with a known image to validate visuals consistently.
  await cart.insertMockCartImages();
  await cart.verifyCartImages();
});
