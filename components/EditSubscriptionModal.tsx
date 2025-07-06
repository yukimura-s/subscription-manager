import { useState } from 'react';
import { Subscription } from '@/types/subscription';

interface EditSubscriptionModalProps {
  subscription: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, updatedData: Partial<Subscription>) => void;
}

export const EditSubscriptionModal = ({ subscription, isOpen, onClose, onSave }: EditSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: subscription.name,
    price: subscription.price.toString(),
    billingCycle: subscription.billingCycle,
    nextBilling: subscription.nextBilling || ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    try {
      if (!formData.name.trim() || !formData.price.trim()) {
        throw new Error('サービス名と料金は必須です');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('料金は正の数値で入力してください');
      }

      const updatedData: Partial<Subscription> = {
        name: formData.name.trim(),
        price,
        billingCycle: formData.billingCycle,
        nextBilling: formData.nextBilling || undefined
      };

      onSave(subscription.id, updatedData);
      setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: subscription.name,
      price: subscription.price.toString(),
      billingCycle: subscription.billingCycle,
      nextBilling: subscription.nextBilling || ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">サブスクリプションを編集</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サービス名
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setError('');
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              料金（円）
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => {
                setFormData({...formData, price: e.target.value});
                setError('');
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              請求サイクル
            </label>
            <select
              value={formData.billingCycle}
              onChange={(e) => setFormData({...formData, billingCycle: e.target.value as 'monthly' | 'yearly'})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
            >
              <option value="monthly">月額</option>
              <option value="yearly">年額</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              次回請求日
            </label>
            <input
              type="date"
              value={formData.nextBilling}
              onChange={(e) => setFormData({...formData, nextBilling: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};