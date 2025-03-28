import { StudentProfile, Session } from '../../../types/database';
import { UpcomingLessons } from './UpcomingLessons';
import { EnrolledCourses } from './EnrolledCourses';
import { motion } from 'framer-motion';
import { User, Calendar, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  profile: StudentProfile;
  sessions: Session[];
}

export function Dashboard({ profile, sessions }: DashboardProps) {
  // Get upcoming sessions (scheduled sessions in the future)
  const now = new Date();
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate > now && session.status === 'scheduled';
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  // Calculate quick stats
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const totalHours = sessions.filter(s => s.status === 'completed')
    .reduce((total, session) => {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      return total + durationHours;
    }, 0);
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {profile.name}!</h2>
            <p className="text-sm text-gray-500">
              Here's what's happening with your learning journey
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{upcomingSessions.length}</h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-indigo-600" />
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
              <p className="text-sm text-gray-500">Completed Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedSessions}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
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
              <p className="text-sm text-gray-500">Learning Hours</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalHours.toFixed(1)}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top row - Upcoming Lessons and Enrolled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <UpcomingLessons 
            sessions={upcomingSessions} 
            studentName={profile.name} 
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EnrolledCourses subjects={profile.subjects} />
        </motion.div>
      </div>
    </div>
  );
}
