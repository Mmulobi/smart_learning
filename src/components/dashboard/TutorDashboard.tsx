import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import type { Session, TutorProfile, Earning, StudentProfile } from '../../types/database';
import { useNavigate } from 'react-router-dom';
import { SessionManager } from './tutor/SessionManager';
import { StudentInsights } from './tutor/StudentInsights';
import { EarningsTracker } from './tutor/EarningsTracker';
import { ProfileShowcase } from './tutor/ProfileShowcase';
import { LogOut } from 'lucide-react';

export interface StudentInsight {
  student: StudentProfile;
  sessions: Session[];
  strengths: string[];
  weaknesses: string[];
}

export function TutorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    setupRealtimeSubscriptions();
  }, []);

  const setupRealtimeSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/tutor');
        return;
      }

      // Subscribe to session updates
      const sessionSubscription = supabase
        .channel('sessions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sessions',
            filter: `tutor_id=eq.${user.id}`,
          },
          () => {
            loadDashboardData();
          }
        )
        .subscribe();

      // Subscribe to review updates
      const reviewSubscription = supabase
        .channel('reviews')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reviews',
            filter: `tutor_id=eq.${user.id}`,
          },
          () => {
            loadDashboardData();
          }
        )
        .subscribe();

      return () => {
        sessionSubscription.unsubscribe();
        reviewSubscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up subscriptions:', error);
      setError('Failed to set up real-time updates');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/tutor');
        return;
      }

      // Get tutor profile first
      const tutorProfile = await DatabaseService.getTutorProfile(user.id);
      if (!tutorProfile) {
        setError('Tutor profile not found. Please contact support.');
        return;
      }

      // Only fetch other data if we have a valid tutor profile
      const [tutorSessions, tutorEarnings] = await Promise.all([
        DatabaseService.getSessionsByTutor(tutorProfile.id),
        DatabaseService.getEarningsByTutor(tutorProfile.id),
      ]);

      setProfile(tutorProfile);
      setSessions(tutorSessions);
      setEarnings(tutorEarnings);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your tutor profile. Please contact support.</p>
          <button
            onClick={() => navigate('/auth/tutor')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Group sessions by student for insights
  const sessionsByStudent = sessions.reduce((acc, session) => {
    if (!session.student_profiles) return acc;
    
    const studentId = session.student_id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: session.student_profiles,
        sessions: [],
        strengths: [],
        weaknesses: []
      };
    }
    acc[studentId].sessions.push(session);

    // Update strengths and weaknesses based on session data
    const subjects = acc[studentId].sessions.map(s => s.subject);
    acc[studentId].strengths = [...new Set(subjects)];
    acc[studentId].weaknesses = [];

    return acc;
  }, {} as { [key: string]: StudentInsight });

  const handleUpdateSession = async (updatedSession: Session) => {
    try {
      await DatabaseService.updateSession(updatedSession);
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating session:', error);
      setError('Failed to update session');
    }
  };

  const handleUpdateProfile = async (updatedProfile: Partial<TutorProfile>) => {
    try {
      if (!profile) return;
      const { error } = await supabase
        .from('tutor_profiles')
        .update(updatedProfile)
        .eq('user_id', profile.user_id);
      
      if (error) throw error;
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleRequestPayout = async () => {
    if (!profile) return;
    try {
      // For now, just mark all pending earnings as paid
      const { error } = await supabase
        .from('earnings')
        .update({ status: 'paid' })
        .eq('tutor_id', profile.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      await loadDashboardData();
    } catch (error) {
      console.error('Error requesting payout:', error);
      setError('Failed to request payout');
    }
  };

  const handleMessageStudent = async (studentId: string, message: string) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: profile.id,
          receiver_id: studentId,
          content: message
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/tutor');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {profile.name}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProfileShowcase
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              darkMode={darkMode}
            />
            
            <SessionManager
              sessions={sessions}
              darkMode={darkMode}
              onUpdateSession={handleUpdateSession}
            />

            <div className="space-y-8">
              <StudentInsights
                insights={Object.values(sessionsByStudent)}
                darkMode={darkMode}
                onMessageStudent={handleMessageStudent}
              />
              
              <EarningsTracker
                earnings={earnings}
                onRequestPayout={handleRequestPayout}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}