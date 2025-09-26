import fs from 'fs';
import path from 'path';
import type { Burger } from '../domain/types';

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: 'credit' | 'debit';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  zipCode: string;
}

export interface LocationEntry {
  zipCode: string;
  type: 'pickup' | 'delivery';
  selectIndex: number;
  expectedResults: number;
}

export interface BurgerScenario {
  name: string;
  protein: string;
  bun: string;
  cheese: string;
  toppings: string[];
  sauces?: string[];
  premiumAddOns?: string[];
  quantity: number;
}

export interface MockCartItem {
  menuOption: string;
  subMenuOption: string;
  qty: string;
}

// Unified dataset shape used by existing tests
export interface OrderData {
  zipcode: string;
  burgerOptions: Burger;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  cardInfo: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

function readJson<T>(relativePath: string): T {
  const filePath = path.resolve(__dirname, `../test-data/${relativePath}`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function getCustomerProfiles(): CustomerProfile[] {
  const data = readJson<{ customerProfiles: CustomerProfile[] }>('customer-info.json');
  return data.customerProfiles;
}

export function getPaymentMethods(): PaymentMethod[] {
  const data = readJson<{ paymentMethods: PaymentMethod[] }>('payment-methods.json');
  return data.paymentMethods;
}

export function getLocations(): LocationEntry[] {
  const data = readJson<{ locations: LocationEntry[] }>('locations.json');
  return data.locations;
}

export function getBurgerScenarios(): BurgerScenario[] {
  const data = readJson<{ burgerScenarios: BurgerScenario[] }>('burger-combinations.json');
  return data.burgerScenarios;
}

export function getMockCartItems(): MockCartItem[] {
  const data = readJson<{ items: MockCartItem[] }>('mock-cart-items.json');
  return data.items;
}

export function scenarioToBurger(s: BurgerScenario): Burger {
  return {
    size: s.protein,
    bun: s.bun,
    cheese: s.cheese,
    toppings: s.toppings,
    sauces: s.sauces,
    addOns: s.premiumAddOns,
    quantity: s.quantity,
  };
}

// Compose a simple array of OrderData based on existing JSON files.
export function getOrderData(): OrderData[] {
  const customers = getCustomerProfiles();
  const payments = getPaymentMethods();
  const scenarios = getBurgerScenarios();

  const defaultCustomer = customers.find(c => c.id === 'default') ?? customers[0];
  const zip = defaultCustomer?.zipCode ?? '80246';
  const payment = payments.find(p => p.zipCode === zip) ?? payments[0];

  return scenarios.map(s => {
    const burger = scenarioToBurger(s);
    return {
      zipcode: zip,
      burgerOptions: burger,
      customerInfo: {
        firstName: defaultCustomer.firstName,
        lastName: defaultCustomer.lastName,
        email: defaultCustomer.email,
        phone: defaultCustomer.phone,
      },
      cardInfo: {
        number: payment.cardNumber,
        expiry: payment.expiryDate,
        cvv: payment.cvv,
      },
    } as OrderData;
  });
}
