import { Subscription } from '@/types/subscription';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: number) => void;
  onEdit: (subscription: Subscription) => void;
  onDeleteSuccess?: (name: string) => void;
}

export const SubscriptionCard = ({ subscription, onDelete, onEdit, onDeleteSuccess }: SubscriptionCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(subscription.id);
    setShowDeleteConfirm(false);
    onDeleteSuccess?.(subscription.name);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-gray-800">{subscription.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(subscription)}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
            title="編集"
          >
            編集
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm"
            title="削除"
          >
            削除
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">料金</span>
          <span className="font-bold text-2xl text-gray-900">¥{subscription.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">請求サイクル</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            subscription.billingCycle === 'monthly' 
              ? 'bg-gray-100 text-gray-700' 
              : 'bg-gray-200 text-gray-800'
          }`}>
            {subscription.billingCycle === 'monthly' ? '月額' : '年額'}
          </span>
        </div>
        {subscription.nextBilling && (
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-gray-600">次回請求</span>
            <span className="font-semibold text-gray-700">{subscription.nextBilling}</span>
          </div>
        )}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">月換算</span>
            <span className="font-bold text-gray-900">
              ¥{subscription.billingCycle === 'yearly' ? Math.round(subscription.price / 12) : subscription.price}
            </span>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="サブスクリプションを削除"
        message={`「${subscription.name}」を削除しますか？この操作は取り消すことができません。`}
        confirmText="削除"
        cancelText="キャンセル"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />
    </div>
  );
};