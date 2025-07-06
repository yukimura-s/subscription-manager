'use client';

import { useState, useEffect } from 'react';

export default function Home(){
  const [subscriptions, setSubscriptions] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly',
    nextBilling: ''
  });

  const defaultSubscriptions = [
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

  const suggestionDatabase = [
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

  const filteredSuggestions = suggestionDatabase.filter(suggestion =>
    suggestion.name.toLowerCase().includes(newSubscription.name.toLowerCase()) &&
    !subscriptions.some(sub => sub.name === suggestion.name)
  );

  const selectSuggestion = (suggestion) => {
    setNewSubscription({
      name: suggestion.name,
      price: suggestion.price.toString(),
      billingCycle: suggestion.billingCycle,
      nextBilling: ''
    });
    setShowSuggestions(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('subscriptions');
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    } else {
      setSubscriptions(defaultSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(defaultSubscriptions));
    }
  }, []);

  const saveToStorage = (subs) => {
    localStorage.setItem('subscriptions', JSON.stringify(subs));
  };

  const addSubscription = () => {
    if (!newSubscription.name || !newSubscription.price) return;
    
    const subscription = {
      id: Date.now(),
      ...newSubscription,
      price: parseFloat(newSubscription.price)
    };
    
    const updated = [...subscriptions, subscription];
    setSubscriptions(updated);
    saveToStorage(updated);
    
    setNewSubscription({ name: '', price: '', billingCycle: 'monthly', nextBilling: '' });
    setIsAddingNew(false);
  };

  const deleteSubscription = (id) => {
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    saveToStorage(updated);
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
    return sum + monthlyPrice;
  }, 0);

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💳 サブスクリプション管理</h1>
          <p className="text-gray-600">毎月の支出を可視化して、賢く管理しましょう</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">月額合計</h2>
              <p className="text-3xl font-bold">¥{totalMonthly.toFixed(0)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">年間予想</p>
              <p className="text-xl font-semibold">¥{(totalMonthly * 12).toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">登録中のサービス</h2>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ➕ 新規追加
            </button>
          </div>

          {isAddingNew && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">新しいサブスクリプションを追加</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="サービス名を入力..."
                    value={newSubscription.name}
                    onChange={(e) => {
                      setNewSubscription({...newSubscription, name: e.target.value});
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(newSubscription.name.length > 0)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">{suggestion.name}</p>
                              <p className="text-sm text-gray-600">{suggestion.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">¥{suggestion.price}</p>
                              <p className="text-xs text-gray-500">{suggestion.billingCycle === 'monthly' ? '月額' : '年額'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="料金（円）"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="monthly">月額</option>
                  <option value="yearly">年額</option>
                </select>
                <input
                  type="date"
                  value={newSubscription.nextBilling}
                  onChange={(e) => setNewSubscription({...newSubscription, nextBilling: e.target.value})}
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addSubscription}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  ✅ 追加
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setShowSuggestions(false);
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  ❌ キャンセル
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map(sub => (
              <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-800">{sub.name}</h3>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    title="削除"
                  >
                    🗑️
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">料金</span>
                    <span className="font-bold text-2xl text-blue-600">¥{sub.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">請求サイクル</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      sub.billingCycle === 'monthly' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {sub.billingCycle === 'monthly' ? '月額' : '年額'}
                    </span>
                  </div>
                  {sub.nextBilling && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">次回請求</span>
                      <span className="font-semibold text-orange-600">{sub.nextBilling}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">月換算</span>
                      <span className="font-bold text-purple-600">
                        ¥{sub.billingCycle === 'yearly' ? Math.round(sub.price / 12) : sub.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {subscriptions.length === 0 && !isAddingNew && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-500 text-xl mb-2">まだサブスクリプションが登録されていません</p>
              <p className="text-gray-400">「新規追加」ボタンから始めましょう！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
