'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Subscription } from '@/types/subscription';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyTrendChartProps {
  subscriptions: Subscription[];
}

export const MonthlyTrendChart = ({ subscriptions }: MonthlyTrendChartProps) => {
  const generateMonthlyData = () => {
    const currentDate = new Date();
    const months = [];
    const monthlyTotals = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('ja-JP', { month: 'short' });
      months.push(monthName);

      const total = subscriptions.reduce((sum, sub) => {
        const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
        return sum + monthlyPrice;
      }, 0);

      monthlyTotals.push(Math.round(total));
    }

    return { months, monthlyTotals };
  };

  const { months, monthlyTotals } = generateMonthlyData();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: '月額支出',
        data: monthlyTotals,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `¥${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `¥${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">月別支出推移</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};