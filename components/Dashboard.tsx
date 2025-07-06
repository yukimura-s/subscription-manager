import { Subscription } from '@/types/subscription';
import { CategoryPieChart } from './CategoryPieChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';

interface DashboardProps {
  subscriptions: Subscription[];
  totalMonthly: number;
}

export const Dashboard = ({ subscriptions, totalMonthly }: DashboardProps) => {
  const yearlyTotal = totalMonthly * 12;
  const averagePerService = subscriptions.length > 0 ? totalMonthly / subscriptions.length : 0;

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ダッシュボード</h2>
        <p className="text-gray-600">支出の分析とトレンドを確認しましょう</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">月額合計</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">¥{totalMonthly.toFixed(0)}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">年間予想</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">¥{yearlyTotal.toFixed(0)}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">サービス平均</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">¥{averagePerService.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryPieChart subscriptions={subscriptions} />
        <MonthlyTrendChart subscriptions={subscriptions} />
      </div>
    </div>
  );
};