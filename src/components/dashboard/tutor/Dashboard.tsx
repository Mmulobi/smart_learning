import { TutorProfile, Session, Earning } from '../../../types/database';
import { UpcomingSessionsCard } from './UpcomingSessionsCard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { EarningsSummary } from './EarningsSummary';
import { StudentsList } from './StudentsList';
import { Calendar, Clock, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../../styles/3d-effects.css';

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
}

export function Dashboard({ profile, sessions, earnings, insights, onMessageStudent }: DashboardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
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
  
  // Calculate completion rate for the progress ring
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <div className={`transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header with welcome message and animated gradient background */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
        <div className="animate-pulse-slow absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        <div className="animate-pulse-slow delay-700 absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile.name}</h1>
            <p className="text-indigo-100">Here's an overview of your tutoring activity</p>
          </div>
          
          {/* Animated completion rate ring */}
          <div className="mt-6 md:mt-0 flex items-center">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="-rotate-90 h-24 w-24">
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke="white"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{completionRate}%</span>
                <span className="text-xs text-indigo-100">Completion</span>
              </div>
            </div>
            <div className="ml-4 text-white">
              <div className="text-sm font-medium">Your Stats</div>
              <div className="text-indigo-100 text-xs">{completedSessions} of {totalSessions} sessions</div>
              <div className="text-indigo-100 text-xs">{totalHours.toFixed(1)} hours total</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === 'overview' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === 'sessions' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === 'earnings' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${activeTab === 'students' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Students
          </button>
        </div>
      </div>
      
      {/* Stats cards with hover effects and animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
              <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: '100%', animationDelay: '0.1s' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="text-2xl font-bold text-gray-900">
                {completionRate}%
              </p>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-green-600 h-1 rounded-full" style={{ width: `${completionRate}%`, animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
              <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-1 rounded-full" style={{ width: `${Math.min((totalHours / 100) * 100, 100)}%`, animationDelay: '0.3s' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
              <p className="text-2xl font-bold text-gray-900">{activeStudentCount}</p>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${Math.min((activeStudentCount / 20) * 100, 100)}%`, animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Main content area with conditional rendering based on active tab */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
              <UpcomingSessionsCard 
                sessions={upcomingSessions}
                tutorName={profile.name}
              />
            </div>
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 delay-100">
              <PerformanceMetrics 
                completedSessions={completedSessions}
                totalSessions={totalSessions}
                totalHours={totalHours}
                subjects={profile.subjects}
              />
            </div>
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 delay-200">
              <EarningsSummary 
                totalEarnings={totalEarnings}
                pendingEarnings={pendingEarnings}
                recentEarnings={recentEarnings}
              />
            </div>
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 delay-300">
              <StudentsList 
                students={students}
                activeStudentCount={activeStudentCount}
                onMessageStudent={onMessageStudent}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
              <UpcomingSessionsCard 
                sessions={upcomingSessions}
                tutorName={profile.name}
              />
            </div>
            <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 delay-100">
              <PerformanceMetrics 
                completedSessions={completedSessions}
                totalSessions={totalSessions}
                totalHours={totalHours}
                subjects={profile.subjects}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
            <EarningsSummary 
              totalEarnings={totalEarnings}
              pendingEarnings={pendingEarnings}
              recentEarnings={recentEarnings}
            />
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
            <StudentsList 
              students={students}
              activeStudentCount={activeStudentCount}
              onMessageStudent={onMessageStudent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
