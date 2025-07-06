export interface Subscription {
  id: number;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling?: string;
}

export interface SubscriptionSuggestion {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
}

export interface NewSubscriptionForm {
  name: string;
  price: string;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
}