import { Award, Clock, BookOpen, BarChart } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [animateIn, setAnimateIn] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    // Trigger chart animations with a slight delay
    const chartTimer = setTimeout(() => setAnimateCharts(true), 600);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(chartTimer);
    };
  }, []);
  
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
  
  // Sort subjects by percentage for better visualization
  const sortedSubjectData = [...subjectData].sort((a, b) => b.percentage - a.percentage);
  
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out transform hover:shadow-xl ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-white opacity-20 animate-ping-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-8 h-8 rounded-full bg-white opacity-10 animate-ping-slow delay-500"></div>
        </div>
        
        <h2 className="text-lg font-semibold text-white flex items-center relative z-10">
          <BarChart className="h-5 w-5 mr-2" />
          Performance Metrics
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Completion Rate Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 shadow-sm border border-indigo-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-indigo-600">Completion Rate</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                  <span className="ml-1 text-xs text-green-600">{completionRate > 75 ? '↑ Good' : completionRate > 50 ? '→ Average' : '↓ Needs work'}</span>
                </div>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: animateCharts ? `${completionRate}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          {/* Total Hours Card */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-green-600">Total Hours</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
                  <span className="ml-1 text-xs text-green-600">hours</span>
                </div>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-green-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: animateCharts ? `${Math.min((totalHours / 100) * 100, 100)}%` : '0%' }}
              ></div>
            </div>
          </div>
          
          {/* Subjects Taught Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-blue-600">Subjects Taught</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
                  <span className="ml-1 text-xs text-blue-600">subjects</span>
                </div>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: animateCharts ? `${Math.min((subjects.length / 10) * 100, 100)}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Subject Distribution</h3>
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
              {subjects.length} subjects
            </span>
          </div>
          
          <div className="space-y-4">
            {sortedSubjectData.map((subject, index) => (
              <div key={index} className="transition-all duration-500 ease-in-out" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-purple-500' : index === 2 ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                    {subject.name}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{subject.hours} hrs</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-purple-500' : index === 2 ? 'bg-blue-500' : 'bg-gray-400'}`}
                    style={{ width: animateCharts ? `${subject.percentage}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Circular chart for top 3 subjects */}
          <div className="mt-8 flex justify-center">
            <div className="relative h-48 w-48">
              <svg className="-rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                />
                
                {/* Create a circle segment for each of the top 3 subjects */}
                {sortedSubjectData.slice(0, 3).map((subject, index) => {
                  // Calculate the circumference
                  const radius = 45;
                  const circumference = 2 * Math.PI * radius;
                  
                  // Calculate the stroke dash offset based on previous segments
                  const previousPercentages = sortedSubjectData
                    .slice(0, index)
                    .reduce((sum, s) => sum + (s.percentage / 100) * circumference, 0);
                  
                  // Calculate the stroke dash array
                  const dashArray = `${(subject.percentage / 100) * circumference} ${circumference}`;
                  
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={index === 0 ? '#4f46e5' : index === 1 ? '#a855f7' : '#3b82f6'}
                      strokeWidth="10"
                      strokeDasharray={dashArray}
                      strokeDashoffset={-previousPercentages}
                      className="transition-all duration-1500 ease-out"
                      style={{ strokeDashoffset: animateCharts ? -previousPercentages : circumference }}
                    />
                  );
                })}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-bold text-gray-900">{totalHours.toFixed(1)}</span>
                <span className="text-xs text-gray-500">Total Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
