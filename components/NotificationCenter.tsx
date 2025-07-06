import React, { useState, useEffect } from 'react';
import { Subscription } from '@/types/subscription';

interface NotificationCenterProps {
  subscriptions: Subscription[];
  budgetLimit?: number;
  totalMonthly: number;
}

interface Notification {
  id: string;
  type: 'billing' | 'budget' | 'info';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export const NotificationCenter = ({ subscriptions, budgetLimit, totalMonthly }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState<number>(budgetLimit || 0);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const generateNotifications = React.useCallback(() => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 請求日通知
    subscriptions.forEach(sub => {
      if (sub.nextBilling) {
        const billingDate = new Date(sub.nextBilling);
        
        if (billingDate >= today && billingDate <= next7Days) {
          newNotifications.push({
            id: `billing-${sub.id}-7d`,
            type: 'billing',
            title: '請求予定',
            message: `${sub.name}の請求が7日以内（${sub.nextBilling}）に予定されています。金額: ¥${sub.price.toLocaleString()}`,
            date: today.toISOString(),
            isRead: false
          });
        } else if (billingDate >= today && billingDate <= next30Days) {
          newNotifications.push({
            id: `billing-${sub.id}-30d`,
            type: 'billing',
            title: '今月の請求予定',
            message: `${sub.name}の請求が今月（${sub.nextBilling}）に予定されています。金額: ¥${sub.price.toLocaleString()}`,
            date: today.toISOString(),
            isRead: false
          });
        }
      }
    });

    // 予算超過アラート - 日付ベースでユニークIDを生成
    const dateKey = today.toISOString().split('T')[0];
    if (budget > 0 && totalMonthly > budget) {
      newNotifications.push({
        id: `budget-exceeded-${dateKey}`,
        type: 'budget',
        title: '予算超過アラート',
        message: `月額予算（¥${budget.toLocaleString()}）を¥${Math.round(totalMonthly - budget).toLocaleString()}超過しています。現在の合計: ¥${Math.round(totalMonthly).toLocaleString()}`,
        date: today.toISOString(),
        isRead: false
      });
    } else if (budget > 0 && totalMonthly > budget * 0.9) {
      newNotifications.push({
        id: `budget-warning-${dateKey}`,
        type: 'budget',
        title: '予算警告',
        message: `月額予算の90%に達しました。予算: ¥${budget.toLocaleString()}、現在: ¥${Math.round(totalMonthly).toLocaleString()}`,
        date: today.toISOString(),
        isRead: false
      });
    }

    // 重複を除去して設定
    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNewNotifications = newNotifications.filter(n => !existingIds.includes(n.id));
      
      if (uniqueNewNotifications.length > 0) {
        return [...uniqueNewNotifications, ...prev];
      }
      return prev;
    });
  }, [subscriptions, budget, totalMonthly]);

  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const setBudgetLimit = (newBudget: number) => {
    setBudget(newBudget);
    setShowBudgetModal(false);
    // 予算変更後に通知を再生成（依存関係の変更により自動的に実行される）
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3 rounded-lg transition-colors duration-200 ${
            unreadCount > 0 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="通知センター"
        >
          <div className="text-xl">🔔</div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">通知センター</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBudgetModal(true)}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    予算設定
                  </button>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      すべて削除
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-2xl mb-2">📭</div>
                  <p>通知はありません</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg">
                        {notification.type === 'billing' ? '💰' : 
                         notification.type === 'budget' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.date).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 予算設定モーダル */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">月額予算設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                月額予算（円）
              </label>
              <input
                type="number"
                value={budget || ''}
                onChange={(e) => setBudget(Number(e.target.value) || 0)}
                placeholder="20000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">
                現在の月額合計: ¥{Math.round(totalMonthly).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setBudgetLimit(budget)}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200 text-center"
              >
                設定
              </button>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 text-center"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};