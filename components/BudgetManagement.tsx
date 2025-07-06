import React, { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';

interface BudgetManagementProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

interface BudgetData {
  monthlyBudget: number;
  yearlyBudget: number;
  categories: {
    [key: string]: number;
  };
}

export const BudgetManagement = ({ subscriptions, totalMonthly }: BudgetManagementProps) => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthlyBudget: 0,
    yearlyBudget: 0,
    categories: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState<BudgetData>(budgetData);

  // カテゴリ別の自動分類
  const categorizeSubscriptions = (subs: Subscription[]) => {
    const categories: { [key: string]: { services: Subscription[], total: number } } = {
      'エンターテイメント': { services: [], total: 0 },
      'ビジネス・生産性': { services: [], total: 0 },
      'クラウドストレージ': { services: [], total: 0 },
      '音楽・動画': { services: [], total: 0 },
      'その他': { services: [], total: 0 }
    };

    subs.forEach(sub => {
      const name = sub.name.toLowerCase();
      let category = 'その他';
      
      if (name.includes('netflix') || name.includes('prime') || name.includes('hulu') || name.includes('disney')) {
        category = 'エンターテイメント';
      } else if (name.includes('spotify') || name.includes('youtube') || name.includes('apple music')) {
        category = '音楽・動画';
      } else if (name.includes('office') || name.includes('adobe') || name.includes('notion') || name.includes('figma')) {
        category = 'ビジネス・生産性';
      } else if (name.includes('icloud') || name.includes('dropbox') || name.includes('drive')) {
        category = 'クラウドストレージ';
      }

      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      categories[category].services.push(sub);
      categories[category].total += monthlyPrice;
    });

    return categories;
  };

  const categorizedData = categorizeSubscriptions(subscriptions);

  // ローカルストレージからの読み込み
  useEffect(() => {
    const savedBudget = localStorage.getItem('budgetData');
    if (savedBudget) {
      try {
        const parsed = JSON.parse(savedBudget);
        setBudgetData(parsed);
        setTempBudget(parsed);
      } catch (error) {
        console.error('Failed to parse budget data:', error);
      }
    }
  }, []);

  // ローカルストレージへの保存
  const saveBudgetData = (data: BudgetData) => {
    try {
      localStorage.setItem('budgetData', JSON.stringify(data));
      setBudgetData(data);
      setTempBudget(data);
    } catch (error) {
      console.error('Failed to save budget data:', error);
    }
  };

  const handleSave = () => {
    saveBudgetData(tempBudget);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBudget(budgetData);
    setIsEditing(false);
  };

  const getBudgetStatus = (actual: number, budget: number) => {
    if (budget === 0) return { status: 'no-budget', percentage: 0 };
    const percentage = (actual / budget) * 100;
    
    if (percentage <= 70) return { status: 'good', percentage };
    if (percentage <= 90) return { status: 'warning', percentage };
    return { status: 'danger', percentage };
  };

  const monthlyStatus = getBudgetStatus(totalMonthly, budgetData.monthlyBudget);
  const yearlyTotal = totalMonthly * 12;
  const yearlyStatus = getBudgetStatus(yearlyTotal, budgetData.yearlyBudget);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">予算管理</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200 text-sm sm:text-base"
        >
          {isEditing ? 'キャンセル' : '予算設定'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                月額予算（円）
              </label>
              <input
                type="number"
                value={tempBudget.monthlyBudget || ''}
                onChange={(e) => setTempBudget({
                  ...tempBudget,
                  monthlyBudget: Number(e.target.value) || 0
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
                placeholder="20000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年額予算（円）
              </label>
              <input
                type="number"
                value={tempBudget.yearlyBudget || ''}
                onChange={(e) => setTempBudget({
                  ...tempBudget,
                  yearlyBudget: Number(e.target.value) || 0
                })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
                placeholder="240000"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">カテゴリ別予算</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(categorizedData).map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {category}
                  </label>
                  <input
                    type="number"
                    value={tempBudget.categories[category] || ''}
                    onChange={(e) => setTempBudget({
                      ...tempBudget,
                      categories: {
                        ...tempBudget.categories,
                        [category]: Number(e.target.value) || 0
                      }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:outline-none transition-colors"
                    placeholder="5000"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 全体予算vs実績 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">月額予算vs実績</h3>
              {budgetData.monthlyBudget > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">予算</span>
                    <span className="font-semibold">¥{budgetData.monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">実績</span>
                    <span className="font-semibold">¥{Math.round(totalMonthly).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        monthlyStatus.status === 'good' ? 'bg-green-500' :
                        monthlyStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(monthlyStatus.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {monthlyStatus.percentage.toFixed(1)}% 使用
                    {monthlyStatus.status === 'danger' && (
                      <span className="text-red-600 ml-2">
                        （¥{Math.round(totalMonthly - budgetData.monthlyBudget).toLocaleString()}超過）
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">月額予算が設定されていません</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">年額予算vs実績</h3>
              {budgetData.yearlyBudget > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">予算</span>
                    <span className="font-semibold">¥{budgetData.yearlyBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">実績（年換算）</span>
                    <span className="font-semibold">¥{Math.round(yearlyTotal).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        yearlyStatus.status === 'good' ? 'bg-green-500' :
                        yearlyStatus.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(yearlyStatus.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {yearlyStatus.percentage.toFixed(1)}% 使用
                    {yearlyStatus.status === 'danger' && (
                      <span className="text-red-600 ml-2">
                        （¥{Math.round(yearlyTotal - budgetData.yearlyBudget).toLocaleString()}超過）
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">年額予算が設定されていません</p>
              )}
            </div>
          </div>

          {/* カテゴリ別予算vs実績 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">カテゴリ別予算vs実績</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categorizedData).map(([category, data]) => {
                const budget = budgetData.categories[category] || 0;
                const status = getBudgetStatus(data.total, budget);
                
                return (
                  <div key={category} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
                    <div className="text-sm text-gray-600 mb-2">
                      {data.services.length}件のサービス
                    </div>
                    {budget > 0 ? (
                      <>
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span>予算: ¥{budget.toLocaleString()}</span>
                          <span>実績: ¥{Math.round(data.total).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              status.status === 'good' ? 'bg-green-500' :
                              status.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(status.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {status.percentage.toFixed(1)}% 使用
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        実績: ¥{Math.round(data.total).toLocaleString()}
                        <br />
                        <span className="text-xs">予算未設定</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 予算設定のヒント */}
          {budgetData.monthlyBudget === 0 && budgetData.yearlyBudget === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 予算設定のヒント</h4>
              <p className="text-sm text-blue-700">
                現在の月額合計は¥{Math.round(totalMonthly).toLocaleString()}です。
                これを基準に、20-30%程度の余裕を持った予算設定をおすすめします。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};