import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
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
} from 'lucide-react';
import { TutorProfile, Session, Earning } from '../../types/database';
import { Dashboard } from './tutor/Dashboard';
import { Schedule } from './tutor/Schedule';
import { Messages } from './tutor/Messages';
import { Resources } from './tutor/Resources';
import { Earnings } from './tutor/Earnings';
import { Students } from './tutor/Students';
import { Settings as SettingsPage } from './tutor/Settings';

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
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [insights, setInsights] = useState<{
    student: {
      id: string;
      name: string;
    };
    sessions: Session[];
    strengths: string[];
    weaknesses: string[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        console.log('Current user:', user.id); // Debug log

        const { data: profile, error: profileError } = await supabase
          .from('tutor_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error loading profile:', profileError);
          throw profileError;
        }
        console.log('Loaded profile:', profile); // Debug log
        setProfile(profile);

        // Load sessions with student profiles
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            *,
            student_profiles (
              id,
              name,
              email
            ),
            tutor_profiles (
              id,
              name,
              email
            )
          `)
          .eq('tutor_id', profile.id) // Changed from user.id to profile.id
          .order('start_time', { ascending: false });

        if (sessionsError) {
          console.error('Error loading sessions:', sessionsError);
          throw sessionsError;
        }

        console.log('Loaded sessions:', sessionsData);
        setSessions(sessionsData || []);

        // Load earnings
        const { data: earningsData, error: earningsError } = await supabase
          .from('earnings')
          .select('*')
          .eq('tutor_id', profile.id) // Changed from user.id to profile.id
          .order('created_at', { ascending: false });

        if (earningsError) {
          console.error('Error loading earnings:', earningsError);
          throw earningsError;
        }
        console.log('Loaded earnings:', earningsData); // Debug log
        setEarnings(earningsData || []);

        // Load student insights
        const uniqueStudents = new Map();
        sessionsData?.forEach(session => {
          if (session.student_profiles && !uniqueStudents.has(session.student_profiles.id)) {
            uniqueStudents.set(session.student_profiles.id, {
              student: {
                id: session.student_profiles.id,
                name: session.student_profiles.name
              },
              sessions: sessionsData.filter(s => s.student_id === session.student_id),
              strengths: [],
              weaknesses: []
            });
          }
        });

        setInsights(Array.from(uniqueStudents.values()));

        // Subscribe to session updates
        const sessionsSubscription = supabase
          .channel('session-updates')
          .on(
            'postgres_changes' as any,
            {
              event: '*',
              schema: 'public',
              table: 'sessions',
              filter: `tutor_id=eq.${profile.id}` // Changed from user.id to profile.id
            },
            async (payload: { new: { id: string } }) => {
              console.log('Session update received:', payload); // Debug log
              // Fetch updated session with student profile
              const { data: updatedSession, error: fetchError } = await supabase
                .from('sessions')
                .select(`
                  *,
                  student_profiles (
                    id,
                    name,
                    email
                  ),
                  tutor_profiles (
                    id,
                    name,
                    email
                  )
                `)
                .eq('id', payload.new.id)
                .single();

              if (fetchError) {
                console.error('Error fetching updated session:', fetchError);
                return;
              }

              if (updatedSession) {
                console.log('Updated session:', updatedSession); // Debug log
                setSessions(prev => {
                  const index = prev.findIndex(s => s.id === updatedSession.id);
                  if (index === -1) {
                    return [updatedSession, ...prev];
                  }
                  const newSessions = [...prev];
                  newSessions[index] = updatedSession;
                  return newSessions;
                });
              }
            }
          )
          .subscribe();

        return () => {
          sessionsSubscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="bg-white shadow-lg"
      >
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'resources', label: 'Resources', icon: BookOpen },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full mt-8 flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <Dashboard 
              profile={profile} 
              sessions={sessions}
              insights={insights}
              onMessageStudent={handleMessageStudent}
            />
          )}
          {activeTab === 'schedule' && (
            <Schedule 
              profile={profile} 
              sessions={sessions}
              onUpdateAvailability={handleUpdateAvailability}
            />
          )}
          {activeTab === 'messages' && <Messages profile={profile} />}
          {activeTab === 'resources' && <Resources profile={profile} />}
          {activeTab === 'students' && <Students profile={profile} />}
          {activeTab === 'earnings' && <Earnings profile={profile} earnings={earnings} />}
          {activeTab === 'settings' && <SettingsPage profile={profile} />}
        </div>
      </div>
    </div>
  );
};