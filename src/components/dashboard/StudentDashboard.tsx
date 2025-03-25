import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
import type { StudentProfile, TutorProfile, Session } from '../../types/database';
import { LogOut, User, Bell, Search, X } from 'lucide-react';
import { Sidebar } from './student/Sidebar';
import { Dashboard } from './student/Dashboard';
import { LiveSessions } from './student/LiveSessions';
import { SessionScheduler } from './student/SessionScheduler';
import { ProfileEditor } from './student/ProfileEditor';
import { TutorList } from './student/TutorList';
import { TutorDetails } from './student/TutorDetails';

export function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showFindTutor, setShowFindTutor] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [notifications, setNotifications] = useState<{id: string, message: string, read: boolean}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    
    // Mock notifications for UI demonstration
    setNotifications([
      { id: '1', message: 'Your math session is starting in 30 minutes', read: false },
      { id: '2', message: 'New learning resources available for Physics', read: false },
      { id: '3', message: 'Tutor John Smith accepted your session request', read: true }
    ]);
    
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
  
  const handleFindTutor = () => {
    setShowFindTutor(true);
    setSelectedTutor(null);
  };
  
  const handleStartLesson = () => {
    setShowScheduler(true);
  };
  
  const handleSelectTutor = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
  };
  
  const handleCloseFind = () => {
    setShowFindTutor(false);
    setSelectedTutor(null);
  };
  
  const handleReadNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? {...notif, read: true} : notif)
    );
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-white rounded-full shadow-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          <p className="mt-2 text-gray-600">Unable to load your profile. Please try again.</p>
          <button
            onClick={() => navigate('/auth/student')}
            className="mt-6 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        onSignOut={handleSignOut}
        onEditProfile={() => setShowProfileEditor(true)}
        onFindTutor={handleFindTutor}
        onStartLesson={handleStartLesson}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'sessions' && 'Live Sessions'}
                {activeTab === 'resources' && 'Learning Resources'}
                {activeTab === 'messages' && 'Messages'}
                {showFindTutor && 'Find a Tutor'}
              </h1>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-150"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications</div>
                        ) : (
                          notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 border-b border-gray-100 last:border-0 ${!notification.read ? 'bg-indigo-50' : ''}`}
                              onClick={() => handleReadNotification(notification.id)}
                            >
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">Just now</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {profile && (
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-white p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                        {profile.image_url ? (
                          <img src={profile.image_url} alt={profile.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-800">{profile.name}</p>
                      <button 
                        onClick={() => setShowProfileEditor(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm relative mb-6 animate-fadeIn">
              {error}
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <span className="text-red-500">×</span>
              </button>
            </div>
          )}
          
          {activeTab === 'dashboard' && profile && !showFindTutor && (
            <Dashboard profile={profile} sessions={sessions} />
          )}
          
          {activeTab === 'sessions' && !showFindTutor && (
            <LiveSessions 
              sessions={sessions} 
              onScheduleSession={() => setShowScheduler(true)} 
            />
          )}
          
          {showFindTutor && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TutorList 
                  tutors={tutors} 
                  onSelectTutor={handleSelectTutor} 
                  selectedTutorId={selectedTutor?.id}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedTutor ? (
                  <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <TutorDetails 
                      tutor={selectedTutor} 
                      onScheduleSession={() => {
                        setShowScheduler(true);
                        setShowFindTutor(false);
                      }} 
                    />
                  </div>
                ) : (
                  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center h-full">
                    <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-12 w-12 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Find Your Perfect Tutor</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      Select a tutor from the list to view their details and schedule a session.
                    </p>
                    <button
                      onClick={handleCloseFind}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 text-sm font-medium transition-colors duration-150"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
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
