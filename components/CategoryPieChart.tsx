'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Subscription } from '@/types/subscription';
import { getCategoryFromName } from '@/data/suggestions';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  subscriptions: Subscription[];
}

export const CategoryPieChart = ({ subscriptions }: CategoryPieChartProps) => {
  const categoryData = subscriptions.reduce((acc, sub) => {
    const category = getCategoryFromName(sub.name);
    const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
    
    if (acc[category]) {
      acc[category] += monthlyPrice;
    } else {
      acc[category] = monthlyPrice;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);
  
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = Math.round(context.raw);
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${label}: ¥${value} (${percentage}%)`;
          }
        }
      }
    }
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
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">カテゴリ別支出</h3>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};