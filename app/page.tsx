'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Dashboard } from '@/components/Dashboard';
import { AddSubscriptionForm } from '@/components/AddSubscriptionForm';
import { SubscriptionList } from '@/components/SubscriptionList';
import { EditSubscriptionModal } from '@/components/EditSubscriptionModal';
import { ExportData } from '@/components/ExportData';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { NewSubscriptionForm, Subscription } from '@/types/subscription';

export default function Home() {
  const { subscriptions, addSubscription, deleteSubscription, updateSubscription, totalMonthly } = useSubscriptions();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleAddSubscription = (newSubscription: NewSubscriptionForm) => {
    try {
      const subscription = addSubscription(newSubscription);
      setIsAddingNew(false);
      showSuccess('サブスクリプションを追加しました', `${subscription.name}を登録しました`);
    } catch (error) {
      showError('追加に失敗しました', error instanceof Error ? error.message : '未知のエラーが発生しました');
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  const handleUpdateSubscription = (id: number, updatedData: Partial<Subscription>) => {
    try {
      updateSubscription(id, updatedData);
      setEditingSubscription(null);
      showSuccess('サブスクリプションを更新しました');
    } catch (error) {
      showError('更新に失敗しました', error instanceof Error ? error.message : '未知のエラーが発生しました');
    }
  };


  const handleDeleteSuccess = (name: string) => {
    showSuccess('サブスクリプションを削除しました', `${name}を削除しました`);
  };

  const existingNames = subscriptions.map(sub => sub.name);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">サブスクリプション管理</h1>
              <p className="text-gray-600">毎月の支出を可視化して、賢く管理しましょう</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportData subscriptions={subscriptions} />
              <NotificationCenter 
                subscriptions={subscriptions} 
                totalMonthly={totalMonthly}
              />
            </div>
          </div>
        </div>
        
        <Dashboard subscriptions={subscriptions} totalMonthly={totalMonthly} />

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">登録中のサービス</h2>
            <button
              onClick={() => setIsAddingNew(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200"
            >
              新規追加
            </button>
          </div>

          {isAddingNew && (
            <AddSubscriptionForm
              onAdd={handleAddSubscription}
              onCancel={() => setIsAddingNew(false)}
              existingNames={existingNames}
            />
          )}

          <SubscriptionList
            subscriptions={subscriptions}
            onDelete={deleteSubscription}
            onEdit={handleEditSubscription}
            onDeleteSuccess={handleDeleteSuccess}
          />

          {subscriptions.length === 0 && !isAddingNew && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4"></div>
              <p className="text-gray-500 text-xl mb-2">まだサブスクリプションが登録されていません</p>
              <p className="text-gray-400">「新規追加」ボタンから始めましょう！</p>
            </div>
          )}
        </div>

        {editingSubscription && (
          <EditSubscriptionModal
            subscription={editingSubscription}
            isOpen={!!editingSubscription}
            onClose={() => setEditingSubscription(null)}
            onSave={handleUpdateSubscription}
          />
        )}
      </div>
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}