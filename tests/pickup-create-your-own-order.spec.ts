import { test } from '../fixtures/flows';
import { getBurgerScenarios, scenarioToBurger } from '../utils/testdata';

/**
 * @description
 * E2E test for a Smashburger "Create Your Own" single order.
 *
 * @precondition
 *   - User is on Smashburger "Create Your Own" page.
 *   - User has selected a location for pickup
 * @expected
 *   - Pickup order is placed successfully.
 *   - Cart, checkout, and order confirmation pages display correct burger details.
 */

test.describe(() => {
  test.beforeEach(async ({ bootstrapPickupAtZip, gotoCreateYourOwn, customers }) => {
    const customer = customers.find(c => c.id === 'default') ?? customers[0];
    await bootstrapPickupAtZip(customer.zipCode);
    await gotoCreateYourOwn();
  });

  test('Place a pickup order for a Create Your Own Smashburger and verify details end-to-end', async ({
    checkout,
    product: create,
    cart,
    confirmation,
    customers,
    paymentMethods,
  }) => {
    const [firstScenario] = getBurgerScenarios();
    const burger = scenarioToBurger(firstScenario);
    // Select default profiles from fixtures
    const customer = customers.find(c => c.id === 'default') ?? customers[0];
    const card = paymentMethods.find(p => p.type === 'credit' && p.zipCode === customer.zipCode) ?? paymentMethods[0];
    // Setup above moves us to Create Your Own already
    await create.createBurger(burger);
    await create.clickProceedToCheckout();
    await cart.verifyCartSummaryWithOptions(burger);
    await cart.proceedToCheckout();

    await checkout.verifyCheckoutSummaryWithOptions(burger);
    await cart.proceedToCheckout();
    await checkout.fillCustomerInfo({
      first: customer.firstName,
      last: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    });

    await checkout.fillPaymentInfo({
      number: card.cardNumber,
      expiry: card.expiryDate,
      cvv: card.cvv,
      zip: customer.zipCode,
    });

    await checkout.placeOrder();
    await confirmation.verifyOrderConfirmationWithOptions(burger);
  });
});
