import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Users, ChevronRight } from 'lucide-react';
import { TutorProfile, Session } from '../../../types/database';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  profile: TutorProfile;
  sessions: Session[];
  insights: {
    student: {
      id: string;
      name: string;
    };
    sessions: Session[];
    strengths: string[];
    weaknesses: string[];
  }[];
  onMessageStudent: (studentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  sessions,
  insights,
  onMessageStudent,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter upcoming and completed sessions
  const now = new Date();
  const upcomingSessions = sessions.filter(
    (session) => {
      const sessionDate = new Date(session.start_time);
      return sessionDate > now && session.status === 'scheduled';
    }
  );

  const completedSessions = sessions.filter(
    (session) => session.status === 'completed'
  );

  // Calculate total hours and average rating
  const totalHours = completedSessions.reduce(
    (acc, session) => acc + (session.duration || 0),
    0
  );

  const averageRating = completedSessions.reduce(
    (acc, session) => acc + (session.rating || 0),
    0
  ) / (completedSessions.length || 1);

  // Get recent sessions
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
    .slice(0, 5);

  console.log('Dashboard sessions:', {
    total: sessions.length,
    upcoming: upcomingSessions.length,
    completed: completedSessions.length,
    recent: recentSessions.length
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.name}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your tutoring sessions today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              {upcomingSessions.length} upcoming
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Upcoming Sessions
          </h3>
          <p className="text-gray-600">
            You have {upcomingSessions.length} sessions scheduled for today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">
              {totalHours} hours total
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Total Hours
          </h3>
          <p className="text-gray-600">
            You've completed {totalHours} hours of tutoring sessions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">
              {averageRating.toFixed(1)} avg rating
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Average Rating
          </h3>
          <p className="text-gray-600">
            Your students rate you {averageRating.toFixed(1)} out of 5.
          </p>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/tutor/sessions/${session.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {session.subject || 'Untitled Session'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.start_time), 'MMM d, yyyy h:mm a')}
                  </p>
                  {session.student_profiles && (
                    <p className="text-sm text-gray-500">
                      Student: {session.student_profiles.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
          {recentSessions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No sessions found. Check back later!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
