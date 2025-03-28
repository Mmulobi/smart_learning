import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, ChevronRight } from 'lucide-react';
import { InsightsService, StudentInsight } from '../../../services/insights';
import { TutorProfile } from '../../../types/database';
import { toast } from 'react-hot-toast';

interface StudentInsightsProps {
  profile: TutorProfile;
}

export const StudentInsights: React.FC<StudentInsightsProps> = ({ profile }) => {
  const [insights, setInsights] = useState<StudentInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [profile.id]);

  const loadInsights = async () => {
    try {
      const data = await InsightsService.getStudentInsights(profile.id);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Failed to load student insights');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Insights</h2>
        <div className="text-sm text-gray-500">
          {insights.length} student{insights.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {insight.student_profiles?.name || 'Student'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudent(selectedStudent === insight.id ? null : insight.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight
                    className={`w-5 h-5 transform transition-transform ${
                      selectedStudent === insight.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              <AnimatePresence>
                {selectedStudent === insight.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-green-600">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">Strengths</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {insight.strengths.map((strength, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="font-medium">Areas for Improvement</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {insight.weaknesses.map((weakness, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                          >
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>

                    {insight.notes && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-blue-600">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">Additional Notes</span>
                        </div>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {insight.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {insights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Insights Yet</h3>
          <p className="text-gray-500 mt-2">
            Student insights will appear here once they provide feedback.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
