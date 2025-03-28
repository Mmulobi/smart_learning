import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

interface EnrolledCoursesProps {
  subjects: string[];
}

export function EnrolledCourses({ subjects }: EnrolledCoursesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Enrolled Courses</h2>
              <p className="text-sm text-gray-500">
                {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {subjects.length > 0 ? (
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {subject}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        View course materials and progress
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses</h3>
            <p className="text-gray-500 mb-4">
              Start by finding a tutor and enrolling in your desired subjects
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Find a Tutor
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
