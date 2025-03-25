import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
import type { StudentProfile, TutorProfile, Session } from '../../types/database';
import { LogOut, User } from 'lucide-react';
import { Sidebar } from './student/Sidebar';
import { Dashboard } from './student/Dashboard';
import { LiveSessions } from './student/LiveSessions';
import { SessionScheduler } from './student/SessionScheduler';
import { ProfileEditor } from './student/ProfileEditor';

export function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    
    return () => {
      // Cleanup any subscriptions when component unmounts
      RealtimeService.unsubscribeFromChannel('session-updates');
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/student');
        return;
      }

      // Load student profile
      const profile = await DatabaseService.getStudentProfile(user.id);
      if (!profile) {
        // Create student profile if it doesn't exist
        const newProfile = await DatabaseService.createStudentProfile({
          user_id: user.id,
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          grade_level: '',
          subjects: [],
        });
        setProfile(newProfile);
        
        // Subscribe to real-time updates for this student's sessions
        subscribeToSessionUpdates(newProfile.id);
      } else {
        setProfile(profile);
        
        // Subscribe to real-time updates for this student's sessions
        subscribeToSessionUpdates(profile.id);
      }

      // Load tutors
      const tutors = await DatabaseService.getAllTutors();
      setTutors(tutors);
      
      // Load sessions
      if (profile) {
        const sessions = await DatabaseService.getStudentSessions(profile.id);
        setSessions(sessions);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const subscribeToSessionUpdates = (studentId: string) => {
    RealtimeService.subscribeToSessions(
      studentId,
      'student',
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

  const handleBookSession = async (tutorId: string, subject: string, startTime: string, endTime: string, notes: string): Promise<void> => {
    if (!profile) throw new Error('No student profile found');

    try {
      const newSession = await DatabaseService.createSession({
        tutor_id: tutorId,
        student_id: profile.id,
        subject,
        start_time: startTime,
        end_time: endTime,
        notes,
        status: 'scheduled',
      });
      
      setSessions([...sessions, newSession]);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/student');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleProfileUpdate = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    setShowProfileEditor(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          <p className="mt-2 text-gray-600">Unable to load your profile. Please try again.</p>
          <button
            onClick={() => navigate('/auth/student')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        onSignOut={handleSignOut}
        onEditProfile={() => setShowProfileEditor(true)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'sessions' && 'Live Sessions'}
                {activeTab === 'resources' && 'Learning Resources'}
                {activeTab === 'messages' && 'Messages'}
              </h1>
              <div className="flex items-center">
                {profile && (
                  <div className="flex items-center mr-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        {profile.image_url ? (
                          <img src={profile.image_url} alt={profile.name} className="h-8 w-8 rounded-full" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                    </div>
                    <button 
                      onClick={() => setShowProfileEditor(true)}
                      className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
              {error}
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <span className="text-red-500">×</span>
              </button>
            </div>
          )}
          
          {activeTab === 'dashboard' && profile && (
            <Dashboard profile={profile} sessions={sessions} />
          )}
          
          {activeTab === 'sessions' && (
            <LiveSessions 
              sessions={sessions} 
              onScheduleSession={() => setShowScheduler(true)} 
            />
          )}
          
          {/* Other tabs will be implemented here */}
        </main>
      </div>
      
      {/* Session scheduler modal */}
      {showScheduler && (
        <SessionScheduler 
          tutors={tutors} 
          onSchedule={handleBookSession} 
          onCancel={() => setShowScheduler(false)} 
        />
      )}

      {/* Profile editor modal */}
      {showProfileEditor && profile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ProfileEditor
              profile={profile}
              onUpdate={handleProfileUpdate}
              onCancel={() => setShowProfileEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
