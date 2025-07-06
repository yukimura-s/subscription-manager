export interface SubscriptionTemplate {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
  description?: string;
  logo?: string;
}

export const subscriptionTemplates: SubscriptionTemplate[] = [
  // エンターテイメント
  {
    id: 'netflix',
    name: 'Netflix',
    price: 1490,
    billingCycle: 'monthly',
    category: 'エンターテイメント',
    description: '動画ストリーミングサービス',
    logo: '🎬'
  },
  {
    id: 'netflix-premium',
    name: 'Netflix プレミアム',
    price: 1980,
    billingCycle: 'monthly',
    category: 'エンターテイメント',
    description: '4K対応プレミアムプラン',
    logo: '🎬'
  },
  {
    id: 'spotify',
    name: 'Spotify Premium',
    price: 980,
    billingCycle: 'monthly',
    category: 'エンターテイメント',
    description: '音楽ストリーミングサービス',
    logo: '🎵'
  },
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    price: 1180,
    billingCycle: 'monthly',
    category: 'エンターテイメント',
    description: '広告なし動画視聴・YouTube Music付き',
    logo: '📺'
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime',
    price: 4900,
    billingCycle: 'yearly',
    category: 'エンターテイメント',
    description: '配送特典・Prime Video・Prime Music',
    logo: '📦'
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    price: 990,
    billingCycle: 'monthly',
    category: 'エンターテイメント',
    description: 'ディズニー作品ストリーミング',
    logo: '🏰'
  },

  // ソフトウェア・開発
  {
    id: 'adobe-cc',
    name: 'Adobe Creative Cloud',
    price: 6248,
    billingCycle: 'monthly',
    category: 'ソフトウェア',
    description: 'デザイン・動画編集ソフトウェア',
    logo: '🎨'
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    price: 12984,
    billingCycle: 'yearly',
    category: 'ソフトウェア',
    description: 'Office アプリケーション・OneDrive',
    logo: '📊'
  },
  {
    id: 'github-pro',
    name: 'GitHub Pro',
    price: 4,
    billingCycle: 'monthly',
    category: '開発ツール',
    description: 'プライベートリポジトリ・高度な機能',
    logo: '💻'
  },
  {
    id: 'figma-pro',
    name: 'Figma Professional',
    price: 1440,
    billingCycle: 'monthly',
    category: 'デザイン',
    description: 'デザイン・プロトタイピングツール',
    logo: '🎯'
  },
  {
    id: 'notion-pro',
    name: 'Notion Pro',
    price: 480,
    billingCycle: 'monthly',
    category: 'ソフトウェア',
    description: 'ノート・データベース・プロジェクト管理',
    logo: '📝'
  },

  // クラウドストレージ
  {
    id: 'google-one',
    name: 'Google One',
    price: 250,
    billingCycle: 'monthly',
    category: 'ストレージ',
    description: 'Googleドライブ容量拡張（100GB）',
    logo: '☁️'
  },
  {
    id: 'google-one-2tb',
    name: 'Google One 2TB',
    price: 1300,
    billingCycle: 'monthly',
    category: 'ストレージ',
    description: 'Googleドライブ容量拡張（2TB）',
    logo: '☁️'
  },
  {
    id: 'dropbox-plus',
    name: 'Dropbox Plus',
    price: 1200,
    billingCycle: 'monthly',
    category: 'ストレージ',
    description: 'クラウドストレージ（2TB）',
    logo: '📁'
  },
  {
    id: 'icloud-plus',
    name: 'iCloud+',
    price: 130,
    billingCycle: 'monthly',
    category: 'ストレージ',
    description: 'Apple クラウドストレージ（50GB）',
    logo: '☁️'
  },

  // ビジネス・コミュニケーション
  {
    id: 'slack-pro',
    name: 'Slack Pro',
    price: 925,
    billingCycle: 'monthly',
    category: 'ビジネス',
    description: 'チームコミュニケーションツール',
    logo: '💬'
  },
  {
    id: 'zoom-pro',
    name: 'Zoom Pro',
    price: 2200,
    billingCycle: 'monthly',
    category: 'ビジネス',
    description: 'ビデオ会議ツール',
    logo: '📹'
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    price: 20,
    billingCycle: 'monthly',
    category: 'AI',
    description: 'AI チャットボット（GPT-4アクセス）',
    logo: '🤖'
  },

  // ニュース・学習
  {
    id: 'nikkei-digital',
    name: '日経電子版',
    price: 4277,
    billingCycle: 'monthly',
    category: 'ニュース',
    description: '経済ニュース・企業情報',
    logo: '📰'
  },
  {
    id: 'kindle-unlimited',
    name: 'Kindle Unlimited',
    price: 980,
    billingCycle: 'monthly',
    category: '読書',
    description: '電子書籍読み放題',
    logo: '📚'
  },

  // フィットネス・ヘルス
  {
    id: 'apple-fitness',
    name: 'Apple Fitness+',
    price: 600,
    billingCycle: 'monthly',
    category: 'フィットネス',
    description: 'ワークアウト動画配信',
    logo: '💪'
  }
];

export const getTemplatesByCategory = (category?: string): SubscriptionTemplate[] => {
  if (!category) return subscriptionTemplates;
  return subscriptionTemplates.filter(template => template.category === category);
};

export const getCategories = (): string[] => {
  const categories = subscriptionTemplates.map(template => template.category);
  return Array.from(new Set(categories));
};

export const searchTemplates = (query: string): SubscriptionTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return subscriptionTemplates.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.category.toLowerCase().includes(lowercaseQuery) ||
    template.description?.toLowerCase().includes(lowercaseQuery)
  );
};