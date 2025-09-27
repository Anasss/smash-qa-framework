# 🚀 smash-qa-framework

End-to-end Playwright + TypeScript tests for Smashburger’s web ordering flow. The framework uses a clean Page Object Model (POM) design, data-driven scenarios, fast and semantic locators, and includes pragmatic helpers for test stability, performance, and maintainability.

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
