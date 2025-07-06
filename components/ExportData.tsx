import { Subscription } from '@/types/subscription';
import { useState } from 'react';

interface ExportDataProps {
  subscriptions: Subscription[];
}

export const ExportData = ({ subscriptions }: ExportDataProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const exportToJSON = () => {
    const dataStr = JSON.stringify(subscriptions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscriptions_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvHeader = 'サービス名,料金,請求サイクル,次回請求日,月換算料金\n';
    
    const csvRows = subscriptions.map(sub => {
      const monthlyPrice = sub.billingCycle === 'yearly' ? Math.round(sub.price / 12) : sub.price;
      const billingCycleText = sub.billingCycle === 'monthly' ? '月額' : '年額';
      const nextBilling = sub.nextBilling || '';
      
      return `"${sub.name}","¥${sub.price}","${billingCycleText}","${nextBilling}","¥${monthlyPrice}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportSummaryTXT = () => {
    const totalMonthly = subscriptions.reduce((sum, sub) => {
      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      return sum + monthlyPrice;
    }, 0);
    
    const totalYearly = totalMonthly * 12;
    
    const summary = `サブスクリプション一覧
生成日: ${new Date().toLocaleDateString('ja-JP')}

【概要】
登録サービス数: ${subscriptions.length}件
月額合計: ¥${Math.round(totalMonthly).toLocaleString()}
年額合計: ¥${Math.round(totalYearly).toLocaleString()}

【詳細】
${subscriptions.map((sub, index) => {
  const monthlyPrice = sub.billingCycle === 'yearly' ? Math.round(sub.price / 12) : sub.price;
  const billingCycleText = sub.billingCycle === 'monthly' ? '月額' : '年額';
  return `${index + 1}. ${sub.name}
   料金: ¥${sub.price.toLocaleString()} (${billingCycleText})
   月換算: ¥${monthlyPrice.toLocaleString()}
   次回請求: ${sub.nextBilling || '未設定'}`;
}).join('\n\n')}
`;
    
    const txtBlob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
    
    const url = URL.createObjectURL(txtBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscription_summary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="データエクスポート"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">データエクスポート</h3>
            <div className="space-y-2">
              <button
                onClick={() => { exportToJSON(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                📄 JSON形式
              </button>
              <button
                onClick={() => { exportToCSV(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors duration-200"
              >
                📊 CSV形式
              </button>
              <button
                onClick={() => { exportSummaryTXT(); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors duration-200"
              >
                📋 サマリー
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};