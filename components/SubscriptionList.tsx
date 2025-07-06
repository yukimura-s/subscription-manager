import { Subscription } from '@/types/subscription';
import { SubscriptionCard } from './SubscriptionCard';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: (id: number) => void;
  onEdit: (subscription: Subscription) => void;
  onDeleteSuccess?: (name: string) => void;
}

export const SubscriptionList = ({ subscriptions, onDelete, onEdit, onDeleteSuccess }: SubscriptionListProps) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4"></div>
        <p className="text-gray-500 text-xl mb-2">まだサブスクリプションが登録されていません</p>
        <p className="text-gray-400">「新規追加」ボタンから始めましょう！</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map(subscription => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onDelete={onDelete}
          onEdit={onEdit}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
};