import { useState } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import type { Earning } from '../../../types/database';

interface EarningsTrackerProps {
  earnings: Earning[];
  darkMode: boolean;
  onRequestPayout: () => void;
}

export function EarningsTracker({ earnings, darkMode, onRequestPayout }: EarningsTrackerProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const getChartData = () => {
    const now = new Date();
    const periods = timeframe === 'weekly' ? 7 : 30;
    const labels = Array.from({ length: periods }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }).reverse();

    const data = labels.map((label) => {
      const dayEarnings = earnings.filter(
        (e) =>
          new Date(e.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }) === label
      );
      return dayEarnings.reduce((sum, e) => sum + e.amount, 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Earnings',
          data,
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = earnings
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Earnings Overview</h2>
        <TrendingUp className="text-indigo-500" size={24} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg p-4 flex items-center justify-between`}
        >
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Earnings
            </p>
            <p className="text-2xl font-semibold">${totalEarnings.toFixed(2)}</p>
          </div>
          <DollarSign className="text-green-500" size={24} />
        </div>

        <div
          className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg p-4 flex items-center justify-between`}
        >
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pending Payout
            </p>
            <p className="text-2xl font-semibold">${pendingEarnings.toFixed(2)}</p>
          </div>
          {pendingEarnings > 0 && (
            <button
              onClick={onRequestPayout}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Request Payout
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 'weekly'
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-100'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeframe === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-100'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div
          className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } rounded-lg p-4`}
        >
          <Line
            data={getChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  ticks: {
                    callback: (value) => `$${value}`,
                    color: darkMode ? '#9ca3af' : '#4b5563',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: darkMode ? '#9ca3af' : '#4b5563',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
