import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
import { InsightsService } from '../../services/insights';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BookOpen,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  Video,
  Star,
} from 'lucide-react';
import { TutorProfile, Session, Earning } from '../../types/database';
import { Dashboard } from './tutor/Dashboard';
import { Schedule } from './tutor/Schedule';
import { Messages } from './tutor/Messages';
import { Resources } from './tutor/Resources';
import { Earnings } from './tutor/Earnings';
import { Students } from './tutor/Students';
import { Settings as SettingsPage } from './tutor/Settings';
import { VideoConference } from './tutor/VideoConference';
import { StudentInsights } from './tutor/StudentInsights';

interface DashboardProps {
  profile: TutorProfile;
  sessions: Session[];
  earnings: Earning[];
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

interface ScheduleProps {
  profile: TutorProfile;
  sessions: Session[];
  onUpdateAvailability?: (availability: any) => void;
}

interface MessagesProps {
  profile: TutorProfile;
}

interface ResourcesProps {
  profile: TutorProfile;
}

interface StudentsProps {
  profile: TutorProfile;
}

interface EarningsProps {
  profile: TutorProfile;
  earnings: Earning[];
}

interface SettingsProps {
  profile: TutorProfile;
}

export const TutorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('tutor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (!profile) {
        throw new Error('Tutor profile not found');
      }

      setProfile(profile);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('tutor_id', profile.id);

      if (sessionsError) {
        console.error('Sessions fetch error:', sessionsError);
        throw sessionsError;
      }
      setSessions(sessionsData || []);

      const { data: earningsData, error: earningsError } = await supabase
        .from('earnings')
        .select('*')
        .eq('tutor_id', profile.id);

      if (earningsError) {
        console.error('Earnings fetch error:', earningsError);
        throw earningsError;
      }
      setEarnings(earningsData || []);

      const { data: studentsData, error: studentsError } = await supabase
        .from('student_profiles')
        .select('*');

      if (studentsError) {
        console.error('Students fetch error:', studentsError);
        throw studentsError;
      }
      setStudents(studentsData || []);

      try {
        const insightsData = await InsightsService.getStudentInsights(profile.id);
        setInsights(insightsData);
      } catch (error) {
        console.warn('Insights feature not available:', error);
        setInsights([]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleMessageStudent = (studentId: string) => {
    window.location.href = `/messages?student=${studentId}`;
  };

  const handleUpdateAvailability = async (availability: any) => {
    if (!profile) return;
    
    try {
      await DatabaseService.updateTutorProfile(profile.user_id, { availability });
      setProfile(prev => prev ? { ...prev, availability } : null);
      toast.success('Schedule updated successfully');
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast.error('Failed to update schedule');
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
        console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const renderContent = () => {
    if (!profile) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            profile={profile}
            sessions={sessions}
            earnings={earnings}
            insights={insights}
            onMessageStudent={handleMessageStudent}
          />
        );
      case 'schedule':
        return (
          <Schedule
            profile={profile}
            sessions={sessions}
            onUpdateAvailability={handleUpdateAvailability}
          />
        );
      case 'messages':
        return <Messages profile={profile} />;
      case 'resources':
        return <Resources profile={profile} />;
      case 'earnings':
        return <Earnings profile={profile} earnings={earnings} />;
      case 'students':
        return <Students profile={profile} />;
      case 'settings':
        return <SettingsPage profile={profile} />;
      case 'video':
        return <VideoConference profile={profile} students={students} />;
      case 'insights':
        return <StudentInsights profile={profile} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p>Please complete your tutor profile to access the dashboard.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? 250 : 0 }}
        animate={{ width: isSidebarOpen ? 250 : 0 }}
        className="bg-white shadow-lg relative"
      >
        <div className="p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
            { id: 'resources', icon: BookOpen, label: 'Resources' },
            { id: 'earnings', icon: DollarSign, label: 'Earnings' },
            { id: 'students', icon: Users, label: 'Students' },
            { id: 'video', icon: Video, label: 'Video Conference' },
            { id: 'insights', icon: Star, label: 'Student Insights' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            whileHover={{ x: 5 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};