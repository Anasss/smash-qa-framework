// Shared domain types to gradually centralize contracts. Backwards-compatible exports.

export interface Burger {
  size: string;
  bun: string;
  cheese: string;
  toppings?: string[];
  extraCheese?: string[];
  sauces?: string[];
  addOns?: string[];
  quantity?: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

export interface CardInfo {
  number: string;
  expiry: string;
  cvv: string;
  zip?: string;
}
