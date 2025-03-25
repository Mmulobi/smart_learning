import { Earning } from '../../../types/database';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EarningsSummaryProps {
  totalEarnings: number;
  pendingEarnings: number;
  recentEarnings: Earning[];
}

export function EarningsSummary({ 
  totalEarnings, 
  pendingEarnings, 
  recentEarnings 
}: EarningsSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Earnings Summary
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p className="text-xl font-semibold text-gray-900">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-xl font-semibold text-gray-900">${pendingEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Recent Transactions</h3>
          {recentEarnings.length > 0 ? (
            <div className="space-y-3">
              {recentEarnings.map((earning) => (
                <div 
                  key={earning.id} 
                  className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${earning.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {earning.status === 'paid' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        ${earning.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(earning.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    earning.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {earning.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent transactions</p>
            </div>
          )}
          
          {pendingEarnings > 0 && (
            <div className="mt-4 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Request Payout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
