import { motion } from 'framer-motion';
import { Activity, BarChart, Clock, Star, TrendingUp } from 'lucide-react';

interface PerformanceAnalyticsPageProps {
  data: {
    subjects: string[];
    progress: number[];
    scores: number[];
    sessionsCompleted: number;
    totalHours: number;
  };
}

export function PerformanceAnalyticsPage({ data }: PerformanceAnalyticsPageProps) {
  // Find the subject with highest score
  const maxScoreIndex = data.scores.indexOf(Math.max(...data.scores));
  const bestSubject = data.subjects[maxScoreIndex];
  
  // Find the subject with lowest score
  const minScoreIndex = data.scores.indexOf(Math.min(...data.scores));
  const improvementSubject = data.subjects[minScoreIndex];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Performance Analytics</h2>
              <p className="text-sm text-gray-500">
                Track your learning progress and achievements
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sessions Completed</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.sessionsCompleted}</h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <BarChart className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Learning Hours</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.totalHours.toFixed(1)}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {data.scores.length ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0}%
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(data.progress.reduce((a, b) => a + b, 0) / data.progress.length)}%
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subject Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
        <div className="space-y-6">
          {data.subjects.map((subject, index) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{subject}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Progress: {data.progress[index]}%</span>
                  <span className="text-sm font-medium text-gray-900">Score: {data.scores[index]}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    data.scores[index] >= 80 ? 'bg-green-500' : 
                    data.scores[index] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${data.progress[index]}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <Star className="h-5 w-5" />
            <span className="font-medium">Top Performing Subject</span>
          </div>
          <p className="text-gray-600">
            You're performing exceptionally well in <span className="font-medium text-green-600">{bestSubject}</span>. 
            Keep up the great work!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Focus Area</span>
          </div>
          <p className="text-gray-600">
            Consider focusing more on <span className="font-medium text-red-600">{improvementSubject}</span>. 
            We recommend scheduling additional sessions.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 