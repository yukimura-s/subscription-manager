import React, { useState, useRef } from 'react';
import { Subscription } from '@/types/subscription';

interface DataBackupRestoreProps {
  subscriptions: Subscription[];
  onImportSubscriptions: (subscriptions: Subscription[]) => void;
}

interface BackupData {
  subscriptions: Subscription[];
  exportDate: string;
  version: string;
}

export const DataBackupRestore = ({ subscriptions, onImportSubscriptions }: DataBackupRestoreProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportBackup = () => {
    const backupData: BackupData = {
      subscriptions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subscription_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ 
      type: 'success', 
      text: `${subscriptions.length}件のサブスクリプションをバックアップしました` 
    });
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      setMessage({ type: 'error', text: 'JSONファイルを選択してください' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // バックアップデータの検証
        if (validateBackupData(data)) {
          const importedSubscriptions = data.subscriptions;
          
          // 重複を避けるためにIDを再生成
          const processedSubscriptions = importedSubscriptions.map((sub: Subscription) => ({
            ...sub,
            id: Date.now() + Math.random()
          }));

          onImportSubscriptions(processedSubscriptions);
          setMessage({ 
            type: 'success', 
            text: `${processedSubscriptions.length}件のサブスクリプションをインポートしました` 
          });
        } else {
          throw new Error('無効なバックアップファイル形式です');
        }
      } catch (error) {
        console.error('Import error:', error);
        setMessage({ 
          type: 'error', 
          text: error instanceof Error ? error.message : 'ファイルの読み込みに失敗しました' 
        });
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setMessage(null), 5000);
      }
    };

    reader.onerror = () => {
      setMessage({ type: 'error', text: 'ファイルの読み込みに失敗しました' });
      setIsProcessing(false);
      setTimeout(() => setMessage(null), 3000);
    };

    reader.readAsText(file);
  };

  const validateBackupData = (data: any): data is BackupData => {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.subscriptions)) return false;
    
    return data.subscriptions.every((sub: any) => 
      typeof sub.id === 'number' &&
      typeof sub.name === 'string' &&
      typeof sub.price === 'number' &&
      (sub.billingCycle === 'monthly' || sub.billingCycle === 'yearly') &&
      (sub.nextBilling === undefined || typeof sub.nextBilling === 'string')
    );
  };

  const importSampleData = () => {
    const sampleSubscriptions: Subscription[] = [
      {
        id: Date.now() + 1,
        name: 'Sample Netflix',
        price: 1490,
        billingCycle: 'monthly',
        nextBilling: '2025-07-15'
      },
      {
        id: Date.now() + 2,
        name: 'Sample Spotify',
        price: 980,
        billingCycle: 'monthly',
        nextBilling: '2025-07-05'
      }
    ];

    onImportSubscriptions(sampleSubscriptions);
    setMessage({ 
      type: 'info', 
      text: 'サンプルデータを追加しました' 
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const clearAllData = () => {
    if (window.confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      onImportSubscriptions([]);
      localStorage.removeItem('subscriptions');
      localStorage.removeItem('budgetData');
      setMessage({ 
        type: 'info', 
        text: 'すべてのデータを削除しました' 
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">データバックアップ・復元</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
          'bg-blue-100 text-blue-700 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* バックアップセクション */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">バックアップ</h3>
          <p className="text-sm text-gray-600 mb-4">
            現在のサブスクリプションデータをJSONファイルとしてエクスポートします
          </p>
          
          <div className="space-y-3">
            <button
              onClick={exportBackup}
              disabled={subscriptions.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                subscriptions.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              📦 バックアップをダウンロード
            </button>
            
            <div className="text-xs text-gray-500">
              {subscriptions.length > 0 
                ? `${subscriptions.length}件のサブスクリプションをバックアップ`
                : 'バックアップするデータがありません'
              }
            </div>
          </div>
        </div>

        {/* 復元セクション */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">復元</h3>
          <p className="text-sm text-gray-600 mb-4">
            バックアップファイルからデータを復元します
          </p>
          
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
              id="backup-file-input"
            />
            
            <label
              htmlFor="backup-file-input"
              className={`block w-full py-3 px-4 rounded-lg font-semibold text-center cursor-pointer transition-colors duration-200 ${
                isProcessing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? '処理中...' : '📁 バックアップファイルを選択'}
            </label>
            
            <button
              onClick={importSampleData}
              disabled={isProcessing}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                isProcessing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              🎯 サンプルデータを追加
            </button>
          </div>
        </div>
      </div>

      {/* データ管理セクション */}
      <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ データ管理</h3>
        <p className="text-sm text-red-700 mb-4">
          危険な操作です。実行前に必ずバックアップを取ってください。
        </p>
        
        <button
          onClick={clearAllData}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-semibold transition-colors duration-200"
        >
          🗑️ すべてのデータを削除
        </button>
      </div>

      {/* 使用方法 */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 使用方法</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>バックアップ:</strong> 現在のデータをJSONファイルとして保存します</li>
          <li>• <strong>復元:</strong> バックアップファイルからデータを読み込みます（既存データに追加されます）</li>
          <li>• <strong>サンプルデータ:</strong> アプリの動作確認用のサンプルデータを追加します</li>
          <li>• <strong>データ削除:</strong> すべてのサブスクリプションデータと設定を削除します</li>
        </ul>
      </div>
    </div>
  );
};