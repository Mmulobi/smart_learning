import { Earning } from '../../../types/database';
import { DollarSign, Calendar, CreditCard, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

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
  const [animateIn, setAnimateIn] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    // Trigger items animation with a slight delay
    const itemsTimer = setTimeout(() => setAnimateItems(true), 600);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(itemsTimer);
    };
  }, []);
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out transform hover:shadow-xl ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white opacity-20 animate-ping-slow"></div>
          <div className="absolute bottom-0 left-1/4 w-8 h-8 rounded-full bg-white opacity-10 animate-ping-slow delay-700"></div>
        </div>
        
        <h2 className="text-lg font-semibold text-white flex items-center relative z-10">
          <DollarSign className="h-5 w-5 mr-2" />
          Earnings Summary
        </h2>
      </div>
      
      <div className="p-6">
        {/* Earnings Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Earnings Card */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-600">Total Earnings</h3>
                <div className="mt-1 flex items-baseline">
                  <p className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                  <span className="ml-2 text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-0.5" />
                    <span>+12%</span>
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            
            {/* Animated progress indicator */}
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: animateItems ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
          
          {/* Pending Earnings Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-5 shadow-sm border border-yellow-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-600">Pending</h3>
                <p className="mt-1 text-2xl font-bold text-gray-900">${pendingEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            
            {/* Animated progress indicator */}
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: animateItems ? `${(pendingEarnings / totalEarnings) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Earnings Chart - Simplified version */}
        <div className="mb-8 bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Earnings Trend</h3>
            <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              Last 30 days
            </div>
          </div>
          
          {/* Simple bar chart */}
          <div className="h-24 flex items-end space-x-2">
            {Array.from({ length: 12 }).map((_, index) => {
              // Generate random heights for the demo
              const height = 20 + Math.random() * 80;
              return (
                <div 
                  key={index} 
                  className="bg-green-100 rounded-t-sm w-full transition-all duration-1000 ease-out flex-1"
                  style={{ 
                    height: animateItems ? `${height}%` : '0%',
                    transitionDelay: `${index * 50}ms`,
                    backgroundColor: index === 8 ? '#10b981' : '#d1fae5'
                  }}
                ></div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Recent Transactions</h3>
            <button className="text-xs text-green-600 hover:text-green-800 font-medium">
              View all
            </button>
          </div>
          
          {recentEarnings.length > 0 ? (
            <div className="space-y-3">
              {recentEarnings.map((earning, index) => (
                <div 
                  key={earning.id} 
                  className={`flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 transform ${animateItems ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${earning.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {earning.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${earning.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(earning.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`text-xs px-2.5 py-1 rounded-full font-medium mr-2 ${
                      earning.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {earning.status}
                    </div>
                    <CreditCard className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6">
              <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 text-green-600">
                <DollarSign className="h-8 w-8" />
              </div>
              <p className="text-gray-500 mb-4">No recent transactions</p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300">
                <Calendar className="h-4 w-4 mr-1.5" />
                View History
              </button>
            </div>
          )}
          
          {pendingEarnings > 0 && (
            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300">
                <DollarSign className="h-4 w-4 mr-1.5" />
                Request Payout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
