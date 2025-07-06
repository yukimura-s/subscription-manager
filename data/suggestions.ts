import { SubscriptionSuggestion } from '@/types/subscription';

export const getCategoryFromName = (name: string): string => {
  const suggestion = suggestionDatabase.find(s => s.name === name);
  return suggestion?.category || 'その他';
};

export const suggestionDatabase: SubscriptionSuggestion[] = [
  { name: 'Netflix', price: 1490, billingCycle: 'monthly', category: '動画配信' },
  { name: 'Amazon Prime Video', price: 500, billingCycle: 'monthly', category: '動画配信' },
  { name: 'Disney+', price: 990, billingCycle: 'monthly', category: '動画配信' },
  { name: 'Hulu', price: 1026, billingCycle: 'monthly', category: '動画配信' },
  { name: 'U-NEXT', price: 2189, billingCycle: 'monthly', category: '動画配信' },
  { name: 'ABEMA プレミアム', price: 960, billingCycle: 'monthly', category: '動画配信' },
  { name: 'Spotify', price: 980, billingCycle: 'monthly', category: '音楽' },
  { name: 'Apple Music', price: 1080, billingCycle: 'monthly', category: '音楽' },
  { name: 'YouTube Music', price: 980, billingCycle: 'monthly', category: '音楽' },
  { name: 'Amazon Music Unlimited', price: 1080, billingCycle: 'monthly', category: '音楽' },
  { name: 'Adobe Creative Cloud', price: 6248, billingCycle: 'monthly', category: 'デザイン' },
  { name: 'Canva Pro', price: 1500, billingCycle: 'monthly', category: 'デザイン' },
  { name: 'Figma Professional', price: 1440, billingCycle: 'monthly', category: 'デザイン' },
  { name: 'Microsoft 365', price: 12984, billingCycle: 'yearly', category: 'オフィス' },
  { name: 'Google Workspace', price: 680, billingCycle: 'monthly', category: 'オフィス' },
  { name: 'Notion Pro', price: 480, billingCycle: 'monthly', category: '生産性' },
  { name: 'Evernote Premium', price: 600, billingCycle: 'monthly', category: '生産性' },
  { name: 'Dropbox Plus', price: 1200, billingCycle: 'monthly', category: 'ストレージ' },
  { name: 'GitHub Pro', price: 400, billingCycle: 'monthly', category: '開発' },
  { name: 'ChatGPT Plus', price: 2000, billingCycle: 'monthly', category: 'AI' },
  { name: 'Claude Pro', price: 2000, billingCycle: 'monthly', category: 'AI' },
  { name: 'YouTube Premium', price: 1180, billingCycle: 'monthly', category: '動画配信' },
  { name: 'Amazon Prime', price: 4900, billingCycle: 'yearly', category: 'ショッピング' },
  { name: 'iCloud+', price: 130, billingCycle: 'monthly', category: 'ストレージ' }
];