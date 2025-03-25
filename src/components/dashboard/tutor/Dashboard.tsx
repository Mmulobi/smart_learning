import { TutorProfile, Session, Earning } from '../../../types/database';
import { UpcomingSessionsCard } from './UpcomingSessionsCard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { EarningsSummary } from './EarningsSummary';
import { StudentsList } from './StudentsList';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';

interface StudentInsightData {
  student: {
    id: string;
    name: string;
  };
  sessions: Session[];
  strengths: string[];
  weaknesses: string[];
}

interface DashboardProps {
  profile: TutorProfile;
  sessions: Session[];
  earnings: Earning[];
  insights: StudentInsightData[];
  onMessageStudent: (studentId: string) => void;
  onUpdateSession: (session: Session) => Promise<void>;
}

export function Dashboard({ profile, sessions, earnings, insights, onMessageStudent, onUpdateSession }: DashboardProps) {
  // Get upcoming sessions (scheduled sessions in the future)
  const now = new Date();
  const upcomingSessions = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate > now && session.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5); // Show only next 5 upcoming sessions
  
  // Calculate earnings metrics
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const pendingEarnings = earnings
    .filter(earning => earning.status === 'pending')
    .reduce((sum, earning) => sum + earning.amount, 0);
  
  // Calculate session metrics
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(session => session.status === 'completed').length;
  const totalHours = sessions.reduce((total, session) => {
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return total + durationHours;
  }, 0);
  
  // Get recent earnings (last 5)
  const recentEarnings = [...earnings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  // Count active students (those with sessions in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeStudentIds = new Set(
    sessions
      .filter(session => new Date(session.start_time) >= thirtyDaysAgo)
      .map(session => session.student_id)
  );
  
  const activeStudentCount = activeStudentIds.size;

  // Extract student profiles from insights
  const students = insights.map(insight => ({
    id: insight.student.id,
    name: insight.student.name,
    subjects: [],
    email: '',
    grade_level: '',
    user_id: insight.student.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile.name}</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your tutoring activity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
              <p className="text-xl font-semibold text-gray-900">{totalSessions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="text-xl font-semibold text-gray-900">
                {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
              <p className="text-xl font-semibold text-gray-900">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-indigo-100">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
              <p className="text-xl font-semibold text-gray-900">{activeStudentCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingSessionsCard 
          sessions={upcomingSessions}
        />
        <PerformanceMetrics 
          completedSessions={completedSessions}
          totalSessions={totalSessions}
          totalHours={totalHours}
          subjects={profile.subjects}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsSummary 
          totalEarnings={totalEarnings}
          pendingEarnings={pendingEarnings}
          recentEarnings={recentEarnings}
        />
        <StudentsList 
          students={students}
          activeStudentCount={activeStudentCount}
          onMessageStudent={onMessageStudent}
        />
      </div>
    </div>
  );
}
