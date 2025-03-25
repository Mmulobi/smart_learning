import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
import type { Session, TutorProfile, Earning, StudentProfile } from '../../types/database';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './tutor/Sidebar';
import { Dashboard } from './tutor/Dashboard';
import { Schedule } from './tutor/Schedule';
import { Messages } from './tutor/Messages';
import { Settings } from './tutor/Settings';
import { Resources } from './tutor/Resources';

// Define the legacy StudentInsightData interface for compatibility
interface StudentInsightData {
  student: {
    id: string;
    name: string;
  };
  sessions: Session[];
  strengths: string[];
  weaknesses: string[];
}

export function TutorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth/tutor');
        return;
      }
      
      // Load tutor profile
      loadTutorProfile(session.user.id);
    };
    
    checkAuth();
    
    return () => {
      // Cleanup any subscriptions when component unmounts
      RealtimeService.unsubscribeFromChannel('session-updates');
    };
  }, [navigate]);
  
  const loadTutorProfile = async (userId: string) => {
    try {
      setLoading(true);
      const tutorProfile = await DatabaseService.getTutorProfile(userId);
      
      if (!tutorProfile) {
        setError('Could not load tutor profile');
        return;
      }
      
      setProfile(tutorProfile);
      
      // Subscribe to real-time session updates
      subscribeToSessionUpdates(tutorProfile.id);
      
      // Load sessions, earnings, and students
      await Promise.all([
        loadSessions(tutorProfile.id),
        loadEarnings(tutorProfile.id)
      ]);
    } catch (err: any) {
      setError(err.message || 'Error loading tutor profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const subscribeToSessionUpdates = (tutorId: string) => {
    RealtimeService.subscribeToSessions(
      tutorId,
      'tutor',
      (updatedSession) => {
        // Handle the real-time session update
        setSessions(prevSessions => {
          // Check if this session already exists in our state
          const existingIndex = prevSessions.findIndex(s => s.id === updatedSession.id);
          
          if (existingIndex >= 0) {
            // Update the existing session
            const updatedSessions = [...prevSessions];
            updatedSessions[existingIndex] = updatedSession;
            return updatedSessions;
          } else {
            // Add the new session
            return [...prevSessions, updatedSession];
          }
        });
      }
    );
  };
  
  const loadSessions = async (tutorId: string) => {
    try {
      const sessionsData = await DatabaseService.getSessionsByTutor(tutorId);
      setSessions(sessionsData);
      
      // Extract unique students from sessions
      const uniqueStudents = Array.from(
        new Set(sessionsData.map(session => session.student_id))
      ).map(studentId => {
        const session = sessionsData.find(s => s.student_id === studentId);
        return session?.student_profiles;
      }).filter(Boolean) as StudentProfile[];
      
      setStudents(uniqueStudents);
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };
  
  const loadEarnings = async (tutorId: string) => {
    try {
      const earningsData = await DatabaseService.getEarningsByTutor(tutorId);
      setEarnings(earningsData);
    } catch (err) {
      console.error('Error loading earnings:', err);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      navigate('/auth/tutor');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  
  const handleMessageStudent = (studentId: string) => {
    // Navigate to messages tab and select the student
    setActiveTab('messages');
    // Additional logic to select the specific student conversation
    console.log(`Opening messages with student ${studentId}`);
  };
  
  const handleUpdateSession = async (session: Session) => {
    try {
      const updatedSession = await DatabaseService.updateSession(session);
      
      // Update the sessions state
      setSessions(prevSessions => {
        const index = prevSessions.findIndex(s => s.id === updatedSession.id);
        if (index >= 0) {
          const updatedSessions = [...prevSessions];
          updatedSessions[index] = updatedSession;
          return updatedSessions;
        }
        return prevSessions;
      });
    } catch (err: any) {
      setError(err.message || 'Error updating session');
      console.error(err);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error || "Could not load your tutor profile"}
          </h2>
          <p className="text-gray-500 mb-4">
            There was an error loading your dashboard. Please try again or contact support.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Process the sessions to generate student insights
  const processSessionsForInsights = () => {
    // Group sessions by student for insights
    return sessions.reduce((acc: Record<string, StudentInsightData>, session) => {
      if (!session.student_profiles) return acc;
      
      const studentId = session.student_id;
      
      if (!acc[studentId]) {
        acc[studentId] = {
          student: {
            id: studentId,
            name: session.student_profiles.name || 'Unknown Student'
          },
          sessions: [],
          strengths: [],
          weaknesses: []
        };
      }
      
      acc[studentId].sessions.push(session);
      
      return acc;
    }, {});
  };
  
  const studentInsights = Object.values(processSessionsForInsights());
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        tutorName={profile.name}
      />
      
      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between lg:px-8">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'schedule' && 'Schedule'}
                {activeTab === 'messages' && 'Messages'}
                {activeTab === 'resources' && 'Resources'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>
            <div className="ml-4 flex items-center lg:ml-6">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative">
                {error}
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                sessions={sessions} 
                earnings={earnings} 
                insights={studentInsights}
                onMessageStudent={handleMessageStudent}
                onUpdateSession={handleUpdateSession}
              />
            )}
            
            {activeTab === 'schedule' && (
              <Schedule 
                profile={profile} 
                sessions={sessions} 
                onUpdateAvailability={(availability) => {
                  DatabaseService.updateTutorProfile(profile.user_id, { availability })
                    .then(updatedProfile => setProfile(updatedProfile))
                    .catch(err => setError(err.message));
                }} 
              />
            )}
            
            {activeTab === 'messages' && (
              <Messages profile={profile} />
            )}
            
            {activeTab === 'resources' && (
              <Resources profile={profile} />
            )}
            
            {activeTab === 'settings' && (
              <Settings 
                profile={profile}
                onUpdateProfile={(updates) => {
                  DatabaseService.updateTutorProfile(profile.user_id, updates)
                    .then(updatedProfile => setProfile(updatedProfile))
                    .catch(err => setError(err.message));
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}