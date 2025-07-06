import { useState, useEffect } from 'react';
import { Subscription, NewSubscriptionForm } from '@/types/subscription';

const defaultSubscriptions: Subscription[] = [
  {
    id: 1,
    name: 'Netflix',
    price: 1490,
    billingCycle: 'monthly',
    nextBilling: '2025-07-15'
  },
  {
    id: 2,
    name: 'Spotify',
    price: 980,
    billingCycle: 'monthly',
    nextBilling: '2025-07-05'
  },
  {
    id: 3,
    name: 'Adobe Creative Cloud',
    price: 6248,
    billingCycle: 'monthly',
    nextBilling: '2025-07-12'
  },
  {
    id: 4,
    name: 'Microsoft 365',
    price: 12984,
    billingCycle: 'yearly',
    nextBilling: '2026-03-15'
  },
  {
    id: 5,
    name: 'YouTube Premium',
    price: 1180,
    billingCycle: 'monthly',
    nextBilling: '2025-06-30'
  },
  {
    id: 6,
    name: 'Amazon Prime',
    price: 4900,
    billingCycle: 'yearly',
    nextBilling: '2025-12-01'
  },
  {
    id: 7,
    name: 'Notion Pro',
    price: 480,
    billingCycle: 'monthly',
    nextBilling: '2025-07-08'
  },
  {
    id: 8,
    name: 'Figma Professional',
    price: 1440,
    billingCycle: 'monthly',
    nextBilling: '2025-07-20'
  }
];

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('subscriptions');
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse subscriptions from localStorage:', error);
        setSubscriptions(defaultSubscriptions);
        saveToStorage(defaultSubscriptions);
      }
    } else {
      setSubscriptions(defaultSubscriptions);
      saveToStorage(defaultSubscriptions);
    }
  }, []);

  const saveToStorage = (subs: Subscription[]) => {
    try {
      localStorage.setItem('subscriptions', JSON.stringify(subs));
    } catch (error) {
      console.error('Failed to save subscriptions to localStorage:', error);
    }
  };

  const addSubscription = (newSubscription: NewSubscriptionForm) => {
    if (!newSubscription.name.trim() || !newSubscription.price.trim()) {
      throw new Error('サービス名と料金は必須です');
    }

    const price = parseFloat(newSubscription.price);
    if (isNaN(price) || price <= 0) {
      throw new Error('料金は正の数値で入力してください');
    }

    const subscription: Subscription = {
      id: Date.now(),
      name: newSubscription.name.trim(),
      price,
      billingCycle: newSubscription.billingCycle,
      nextBilling: newSubscription.nextBilling || undefined
    };

    const updated = [...subscriptions, subscription];
    setSubscriptions(updated);
    saveToStorage(updated);
    return subscription;
  };

  const deleteSubscription = (id: number) => {
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    saveToStorage(updated);
  };

  const updateSubscription = (id: number, updatedData: Partial<Subscription>) => {
    const updated = subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updatedData } : sub
    );
    setSubscriptions(updated);
    saveToStorage(updated);
  };

  const importSubscriptions = (importedSubscriptions: Subscription[]) => {
    const updated = [...subscriptions, ...importedSubscriptions];
    setSubscriptions(updated);
    saveToStorage(updated);
  };

  const replaceAllSubscriptions = (newSubscriptions: Subscription[]) => {
    setSubscriptions(newSubscriptions);
    saveToStorage(newSubscriptions);
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
    return sum + monthlyPrice;
  }, 0);

  return {
    subscriptions,
    addSubscription,
    deleteSubscription,
    updateSubscription,
    importSubscriptions,
    replaceAllSubscriptions,
    totalMonthly
  };
};