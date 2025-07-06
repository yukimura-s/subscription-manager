interface TotalSummaryProps {
  totalMonthly: number;
}

export const TotalSummary = ({ totalMonthly }: TotalSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">月額合計</h2>
          <p className="text-3xl font-bold">¥{totalMonthly.toFixed(0)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">年間予想</p>
          <p className="text-xl font-semibold">¥{(totalMonthly * 12).toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};