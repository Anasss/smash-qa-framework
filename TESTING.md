# Smashburger UI Test Strategy & Analysis  

## Tech Stack Analysis  

Based on DOM and network inspection, the Smashburger website (`https://dev.smashburger.com`) is built with:  

- **Core Frameworks**: Next.js (React), React, Tailwind CSS  
- **Data Management**: Likely React Query (via `dehydratedState`)  
- **Third-Party Integrations**:  
  - Google Tag Manager, Google Analytics  
  - Google Maps API (location services)  
  - Google reCAPTCHA (bot protection)  
  - Braze (customer engagement)  
  - TrustArc (cookie consent)  
  - Qualtrics (survey)  
  - Font Awesome (icons)  
- **Infrastructure**: Cloudflare (CDN), Google Fonts, AWS S3 (assets)  
- **Dev Tools**: TypeScript, ESLint/Prettier  

This stack implies modern, scalable, and component-driven front-end architecture.  

---

## Observed APIs (via Network Tab)  

### Location & Menu  
- `GET /api/location/search?query=80246` → Search restaurants by ZIP code.  
- `GET /api/location/menu` → Fetch menu by location.  
- `GET /api/location` → Retrieve location details.  

### Basket & Ordering  
- `POST /api/basket` → Create a new basket (requires `VendorId`).  
- `GET /api/basket` → Retrieve basket.  
- `POST /api/basket/products` → Add products with options.  
- `GET /api/basket/delivery-mode` → Delivery/pickup options.  
- `POST /api/basket/validate` → Basket validation.  
- `GET /api/basket/freedompay-iframe?billingMethod=creditcard` → Payment iframe.  

### Page Data (Next.js)  
- `GET /_next/data/.../menu/smashburgers/create-your-own.json`  
- `GET /_next/data/.../cart.json`  
- `GET /_next/data/.../cart/checkout.json`  

### Third-Party  
- `GET https://maps.googleapis.com/maps/api/...` → Google Maps API  

**Implication:** UI tests heavily rely on backend APIs. Failures may originate in backend rather than UI. Hybrid API+UI tests or API health monitoring could reduce flakiness.  

---

## Testing Notes (Summary)  

- **Scope**: Focus on **UI automation** with Playwright + TypeScript, minimal framework.  
- **Primary Flow**: E2E burger ordering — pickup order via “Create Your Own Burger” page.  
- **Data Setup**: Use ZIP code `80246`, select the first restaurant.  
- **Validation Points**: Ensure order details are consistent across Cart, Checkout, and Order Details pages.  
- **Design**: Page Object Model (POM), modular code, fixtures for setup, utilities for reusability.  
- **Resilience**: Prefer `data-testid`/ID locators, handle dynamic elements properly.  
- **Quality**: Parallel execution, headless runs, screenshot capture on failures.  
