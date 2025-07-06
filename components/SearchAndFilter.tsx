import React, { useState, useCallback } from 'react';
import { Subscription } from '@/types/subscription';

interface SearchAndFilterProps {
  subscriptions: Subscription[];
  onFilteredResults: (filteredSubscriptions: Subscription[]) => void;
}

export const SearchAndFilter = ({ subscriptions, onFilteredResults }: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [billingCycleFilter, setBillingCycleFilter] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'nextBilling'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const applyFilters = useCallback(() => {
    let filtered = [...subscriptions];

    // 検索フィルター
    if (searchTerm.trim()) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 料金フィルター
    if (priceFilter.trim()) {
      const price = parseFloat(priceFilter);
      if (!isNaN(price)) {
        filtered = filtered.filter(sub => {
          const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
          return monthlyPrice <= price;
        });
      }
    }

    // 請求サイクルフィルター
    if (billingCycleFilter !== 'all') {
      filtered = filtered.filter(sub => sub.billingCycle === billingCycleFilter);
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.billingCycle === 'yearly' ? a.price / 12 : a.price;
          bValue = b.billingCycle === 'yearly' ? b.price / 12 : b.price;
          break;
        case 'nextBilling':
          aValue = a.nextBilling || '';
          bValue = b.nextBilling || '';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onFilteredResults(filtered);
  }, [subscriptions, searchTerm, priceFilter, billingCycleFilter, sortBy, sortOrder, onFilteredResults]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter('');
    setBillingCycleFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    onFilteredResults(subscriptions);
  };

  // フィルターが変更されるたびに自動で適用
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">検索・フィルター</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* サービス名検索 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービス名で検索
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Netflix, Spotify..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 料金フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            月額上限（円）
          </label>
          <input
            type="number"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            placeholder="1000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 請求サイクルフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            請求サイクル
          </label>
          <select
            value={billingCycleFilter}
            onChange={(e) => setBillingCycleFilter(e.target.value as 'all' | 'monthly' | 'yearly')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
          >
            <option value="all">すべて</option>
            <option value="monthly">月額</option>
            <option value="yearly">年額</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ソート条件 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            並び順
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'nextBilling')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
          >
            <option value="name">サービス名</option>
            <option value="price">月額料金</option>
            <option value="nextBilling">次回請求日</option>
          </select>
        </div>

        {/* ソート方向 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            順序
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
          >
            <option value="asc">昇順</option>
            <option value="desc">降順</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={resetFilters}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
        >
          リセット
        </button>
        <div className="text-sm text-gray-600 flex items-center">
          結果: {subscriptions.length}件のサービス
        </div>
      </div>
    </div>
  );
};