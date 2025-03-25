import { TrendingUp, Award, Clock, BookOpen } from 'lucide-react';

interface PerformanceMetricsProps {
  completedSessions: number;
  totalSessions: number;
  totalHours: number;
  subjects: string[];
}

export function PerformanceMetrics({ 
  completedSessions, 
  totalSessions, 
  totalHours,
  subjects 
}: PerformanceMetricsProps) {
  
  // Calculate completion rate
  const completionRate = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100) 
    : 0;
  
  // Generate random data for subject distribution (in a real app, this would come from the database)
  const subjectData = subjects.map(subject => ({
    name: subject,
    hours: Math.round(Math.random() * totalHours * 10) / 10,
    percentage: Math.round(Math.random() * 100)
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Performance Metrics
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-indigo-100">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                <p className="text-lg font-semibold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-100">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
                <p className="text-lg font-semibold text-gray-900">{totalHours.toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Subjects Taught</h3>
                <p className="text-lg font-semibold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Subject Distribution</h3>
          <div className="space-y-4">
            {subjectData.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                  <span className="text-sm text-gray-500">{subject.hours} hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
