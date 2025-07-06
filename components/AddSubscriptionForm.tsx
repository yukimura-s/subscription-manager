import { useState } from 'react';
import { NewSubscriptionForm, SubscriptionSuggestion } from '@/types/subscription';
import { suggestionDatabase } from '@/data/suggestions';
import { subscriptionTemplates, getCategories, getTemplatesByCategory, SubscriptionTemplate } from '@/data/templates';

interface AddSubscriptionFormProps {
  onAdd: (subscription: NewSubscriptionForm) => void;
  onCancel: () => void;
  existingNames: string[];
}

export const AddSubscriptionForm = ({ onAdd, onCancel, existingNames }: AddSubscriptionFormProps) => {
  const [formData, setFormData] = useState<NewSubscriptionForm>({
    name: '',
    price: '',
    billingCycle: 'monthly',
    nextBilling: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string>('');

  const categories = getCategories();

  const filteredSuggestions = suggestionDatabase.filter(suggestion =>
    suggestion.name.toLowerCase().includes(formData.name.toLowerCase()) &&
    !existingNames.includes(suggestion.name)
  );

  const selectSuggestion = (suggestion: SubscriptionSuggestion) => {
    setFormData({
      name: suggestion.name,
      price: suggestion.price.toString(),
      billingCycle: suggestion.billingCycle,
      nextBilling: ''
    });
    setShowSuggestions(false);
    setError('');
  };

  const selectTemplate = (template: SubscriptionTemplate) => {
    setFormData({
      name: template.name,
      price: template.price.toString(),
      billingCycle: template.billingCycle,
      nextBilling: ''
    });
    setShowTemplates(false);
    setError('');
  };

  const templatesForCategory = selectedCategory 
    ? getTemplatesByCategory(selectedCategory)
    : subscriptionTemplates.slice(0, 20);

  const handleSubmit = () => {
    try {
      onAdd(formData);
      setFormData({ name: '', price: '', billingCycle: 'monthly', nextBilling: '' });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">新しいサブスクリプションを追加</h3>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm"
        >
          {showTemplates ? 'テンプレートを閉じる' : 'テンプレートを使用'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showTemplates && (
        <div className="mb-6 p-4 bg-white rounded-lg border">
          <h4 className="text-md font-semibold mb-3 text-gray-800">テンプレートを選択</h4>
          
          {/* カテゴリフィルター */}
          <div className="mb-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* テンプレート一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {templatesForCategory.map(template => (
              <div
                key={template.id}
                onClick={() => selectTemplate(template)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{template.logo}</span>
                  <span className="font-semibold text-sm text-gray-800">{template.name}</span>
                </div>
                <div className="text-xs text-gray-600 mb-1">{template.category}</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-blue-600">¥{template.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">
                    {template.billingCycle === 'monthly' ? '月額' : '年額'}
                  </span>
                </div>
                {template.description && (
                  <div className="text-xs text-gray-500 mt-1 truncate">{template.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="サービス名を入力..."
            value={formData.name}
            onChange={(e) => {
              setFormData({...formData, name: e.target.value});
              setShowSuggestions(e.target.value.length > 0);
              setError('');
            }}
            onFocus={() => setShowSuggestions(formData.name.length > 0)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors text-gray-900"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{suggestion.name}</p>
                      <p className="text-sm text-gray-600">{suggestion.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">¥{suggestion.price}</p>
                      <p className="text-xs text-gray-500">{suggestion.billingCycle === 'monthly' ? '月額' : '年額'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="number"
          placeholder="料金（円）"
          value={formData.price}
          onChange={(e) => {
            setFormData({...formData, price: e.target.value});
            setError('');
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors text-gray-900"
        />
        <select
          value={formData.billingCycle}
          onChange={(e) => setFormData({...formData, billingCycle: e.target.value as 'monthly' | 'yearly'})}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors text-gray-900"
        >
          <option value="monthly">月額</option>
          <option value="yearly">年額</option>
        </select>
        <input
          type="date"
          value={formData.nextBilling}
          onChange={(e) => setFormData({...formData, nextBilling: e.target.value})}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:border-gray-500 focus:outline-none transition-colors text-gray-900"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200"
        >
          追加
        </button>
        <button
          onClick={() => {
            onCancel();
            setShowSuggestions(false);
            setShowTemplates(false);
            setError('');
          }}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};