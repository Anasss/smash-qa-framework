import { test } from '../fixtures/flows';
import { getBurgerScenarios, scenarioToBurger } from '../utils/testdata';

/**
 * @description
 * Data-driven tests for Smashburger "Create Your Own" pickup orders.
 *
 * @precondition
 *   - User is on Smashburger "Create Your Own" page.
 *   - User has selected a location for pickup
 * @expected
 *   - Pickup order is placed successfully for each dataset.
 *   - Cart, checkout, and order confirmation pages display correct burger details.
 */

const scenarios = getBurgerScenarios();
test.describe.parallel('Pickup orders — Create Your Own variations from dataset', () => {
  test.beforeEach(async ({ bootstrapPickupAtZip, gotoCreateYourOwn, customers }) => {
    const customer = customers.find(c => c.id === 'default') ?? customers[0];
    await bootstrapPickupAtZip(customer.zipCode);
    await gotoCreateYourOwn();
  });

  scenarios.forEach((scenario, index) => {
    const burger = scenarioToBurger(scenario);
    test(`Place pickup order ${index + 1}: ${burger.size} on ${burger.bun} with ${burger.cheese}`, async ({
      product: create,
      checkout,
      cart,
      confirmation,
      customers,
      paymentMethods,
    }) => {
      // For each scenario, use default customer/location/card (80246)
      const customer = customers.find(c => c.id === 'default') ?? customers[0];
      const card = paymentMethods.find(p => p.type === 'credit' && p.zipCode === customer.zipCode) ?? paymentMethods[0];
      // Setup above navigates to Create Your Own

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
});
