# 🚀 smash-qa-framework

End-to-end Playwright tests for Smashburger’s web ordering flow. It follows a clean Page Object Model with data-driven scenarios, fast semantic locators, and pragmatic stability/performance helpers.

## ⚡ Quick start

1) Clone and install

```bash
git clone https://github.com/Anasss/smash-qa-framework
cd smash-qa-framework
npm install
```

2) Run tests (headless by default)

```bash
npx playwright test
```

3) View report (after a run)

```bash
npx playwright show-report
```

## 🧰 What’s inside

- pages/ — Page Objects (catalog, store-locator, product, cart, checkout, order-confirmation)
- tests/ — Specs (single E2E, dataset-driven, image mock)
- fixtures/ — Pages and flows fixtures (bootstrap pickup, go to Create Your Own)
- utils/ — Test data loader, logger, micro-flows, helpers
- test-data/ — JSON datasets for customers, payments, locations, burger scenarios

## 🧭 Standard flow covered

1. Select order type + location (Pickup by zipcode)
2. Navigate menu (SMASHBURGERS → CREATE YOUR OWN)
3. Configure burger, add to cart
4. Verify cart → checkout → payment → place order
5. Verify confirmation (Thank You, order number, options)

## 🧩 Data and fixtures

- Data-driven: scenarios come from JSON in `test-data/` and are typed via helpers in `utils/`.
- Flows fixture: `bootstrapPickupAtZip(zip)` and `gotoCreateYourOwn()` keep specs focused on assertions.

## 🛡️ Stability and performance

- Network hygiene: blocks analytics/marketing/social noise to reduce flakiness and speed up loads.
- Resource tweaks: fonts/animations trimmed for consistency.
- Failure artifacts: screenshots on failure; Playwright HTML report enabled.
- Optional timing logs: per-step durations for store selection and menu navigation (enable logs via LOG_LEVEL/info).

## 🧪 Useful run examples

- Run a single spec

```bash
npx playwright test tests/pickup-create-your-own-order.spec.ts
```

- Headed mode (debug visually)

```bash
npx playwright test --headed
```

- Filter by title

```bash
npx playwright test -g "Create Your Own"
```

## 📄 Reports and artifacts

- HTML report: `npx playwright show-report`
- Test results (screenshots, traces when enabled): `./test-results/`

## 📖 Documentation

For detailed testing strategy, API observations, and framework notes, see [TESTING.md](https://github.com/Anasss/smash-qa-framework/blob/main/TESTING.md)
