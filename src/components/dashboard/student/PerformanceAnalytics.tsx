import { BarChart, Activity, Clock } from 'lucide-react';

interface PerformanceData {
  subjects: string[];
  progress: number[];
  scores: number[];
  sessionsCompleted: number;
  totalHours: number;
}

interface PerformanceAnalyticsProps {
  data: PerformanceData;
}

export function PerformanceAnalytics({ data }: PerformanceAnalyticsProps) {
  // Find the subject with highest score
  const maxScoreIndex = data.scores.indexOf(Math.max(...data.scores));
  const bestSubject = data.subjects[maxScoreIndex];
  
  // Find the subject with lowest score
  const minScoreIndex = data.scores.indexOf(Math.min(...data.scores));
  const improvementSubject = data.subjects[minScoreIndex];
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Performance Analytics
        </h2>
      </div>
      
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Sessions Completed</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.sessionsCompleted}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-violet-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 font-medium">Learning Hours</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalHours.toFixed(1)}</h3>
              </div>
              <div className="bg-violet-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Average Score</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {data.scores.length ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0}%
                </h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Chart */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-gray-900 mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {data.subjects.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{subject}</span>
                  <span className="text-sm font-medium text-gray-900">{data.scores[index]}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      data.scores[index] >= 80 ? 'bg-emerald-500' : 
                      data.scores[index] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.scores[index]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Strengths</h4>
            <p className="mt-1 text-sm text-gray-600">
              You're performing exceptionally well in <span className="font-medium text-emerald-600">{bestSubject}</span>. 
              Keep up the great work!
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Areas for Improvement</h4>
            <p className="mt-1 text-sm text-gray-600">
              Consider focusing more on <span className="font-medium text-red-600">{improvementSubject}</span>. 
              We recommend scheduling additional sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
