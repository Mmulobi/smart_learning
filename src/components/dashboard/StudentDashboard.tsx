import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { RealtimeService } from '../../services/realtime';
import type { StudentProfile, TutorProfile, Session } from '../../types/database';
import { User, Bell, Search, X, ChevronLeft, Settings, ExternalLink, AlertCircle, Video } from 'lucide-react';
import { Sidebar } from './student/Sidebar';
import { Dashboard } from './student/Dashboard';
import { LiveSessions } from './student/LiveSessions';
import { SessionScheduler } from './student/SessionScheduler';
import { ProfileEditor } from './student/ProfileEditor';
import { TutorFinder } from './student/TutorList';
import { TutorDetails } from './student/TutorDetails';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export function StudentDashboard() {
  // Core state
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScheduler, setShowScheduler] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showFindTutor, setShowFindTutor] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [notifications, setNotifications] = useState<{id: string, message: string, read: boolean, sessionId?: string, type?: string, timestamp?: Date}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    
    // Request notification permission when the app loads
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    // Initial setup complete
    
    return () => {
      // Cleanup any subscriptions when component unmounts
      RealtimeService.unsubscribeFromChannel('session-updates');
    };
  }, []);
  
  // Handle clicks outside of notifications panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node) && showNotifications) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
          
          // Check if this is a session being activated by a tutor
          const existingSession = existingIndex >= 0 ? prevSessions[existingIndex] : null;
          if (existingSession && existingSession.status !== 'in-progress' && updatedSession.status === 'in-progress') {
            // This session was just activated - create a notification
            const tutorName = updatedSession.tutor_profiles?.name || 'Your tutor';
            const subject = updatedSession.subject || 'your session';
            
            // Add a notification with timestamp
            const newNotification = {
              id: `session-${updatedSession.id}-${Date.now()}`,
              message: `${tutorName} has started ${subject} session. Join now!`,
              read: false,
              sessionId: updatedSession.id,
              type: 'session-start',
              timestamp: new Date()
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show a toast notification
            toast(
              (t) => (
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Session Started</p>
                    <p className="text-sm text-gray-600">{`${tutorName} has started ${subject}`}</p>
                  </div>
                  <button 
                    onClick={() => {
                      toast.dismiss(t.id);
                      setActiveTab('sessions');
                    }}
                    className="ml-4 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Join Now
                  </button>
                </div>
              ),
              {
                duration: 8000,
                position: 'top-right',
                icon: <Video className="h-5 w-5 text-green-500" />,
                style: {
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#333',
                },
              }
            );
            
            // Show a browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Session Started', {
                body: `${tutorName} has started your ${subject} session. Join now!`,
                icon: '/favicon.ico'
              });
            }
          }
          
          // Check if this is a session being completed
          if (existingSession && existingSession.status === 'in-progress' && updatedSession.status === 'completed') {
            // Show a toast notification for completed session
            toast.success(`Your ${updatedSession.subject} session has been completed!`, {
              duration: 5000,
              position: 'top-right',
            });
          }
          
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
  
  // Update the active tab and close other views
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowFindTutor(false); // Close the tutor finder when changing tabs
    setSelectedTutor(null);
  };
  

  const handleSelectTutor = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
  };
  
  const handleCloseFind = () => {
    setShowFindTutor(false);
    setSelectedTutor(null);
    setActiveTab('dashboard'); // Ensure we navigate back to the dashboard
  };
  
  const handleReadNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? {...notif, read: true} : notif)
    );
  };
  
  const handleNotificationClick = (notification: {id: string, message: string, read: boolean, sessionId?: string, type?: string}) => {
    // Mark the notification as read
    handleReadNotification(notification.id);
    
    // If this is a session notification, navigate to the sessions tab
    if (notification.type === 'session-start' && notification.sessionId) {
      setActiveTab('sessions');
      setShowNotifications(false);
      
      // Find the session and activate it
      const session = sessions.find(s => s.id === notification.sessionId);
      if (session) {
        // The LiveSessions component will handle showing the active session
      }
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-white rounded-full shadow-md"></div>
            </div>
            <p className="text-center mt-6 text-indigo-600 font-medium">Loading your dashboard...</p>
          </motion.div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
          <motion.div 
            className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <AlertCircle className="h-8 w-8 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
            <p className="mt-2 text-gray-600">Unable to load your profile. Please try again.</p>
            <motion.button
              onClick={() => navigate('/auth/student')}
              className="mt-6 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login
            </motion.button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Toast notifications */}
      <Toaster position="top-right" />
      
      <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onChangeTab={handleTabChange} 
          onSignOut={handleSignOut}
          onEditProfile={() => setShowProfileEditor(true)}
          onFindTutor={handleFindTutor}
          sessions={sessions}
          studentName={profile?.name}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main content */}
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          ref={contentRef}
        >
          {/* Header */}
          <header className="bg-white shadow-md z-10 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  {sidebarCollapsed && (
                    <button 
                      onClick={() => setSidebarCollapsed(false)}
                      className="mr-3 p-1.5 rounded-full hover:bg-indigo-50 text-indigo-600"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'sessions' && 'Live Sessions'}
                    {activeTab === 'resources' && 'Learning Resources'}
                    {activeTab === 'messages' && 'Messages'}
                    {showFindTutor && 'Find Your Perfect Mentor'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Settings button */}
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-150"
                    title="Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  
                  {/* Notifications */}
                  <div className="relative" ref={notificationsRef}>
                    <motion.button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-150"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <motion.span 
                          className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </motion.button>
                    
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div 
                          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
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
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  visible: { transition: { staggerChildren: 0.05 } },
                                  hidden: {}
                                }}
                              >
                                {notifications.map(notification => (
                                  <motion.div 
                                    key={notification.id} 
                                    className={`px-4 py-3 border-b border-gray-100 last:border-0 ${!notification.read ? 'bg-indigo-50' : ''} ${notification.type === 'session-start' ? 'cursor-pointer hover:bg-indigo-100' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                    variants={{
                                      hidden: { opacity: 0, y: 10 },
                                      visible: { opacity: 1, y: 0 }
                                    }}
                                  >
                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.timestamp ? new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </p>
                                    {notification.type === 'session-start' && (
                                      <button className="mt-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">
                                        Join Now <ExternalLink className="inline h-3 w-3 ml-1" />
                                      </button>
                                    )}
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {profile && (
                    <div className="flex items-center">
                      <motion.div 
                        className="h-9 w-9 rounded-full bg-white p-0.5 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                          {profile.image_url ? (
                            <img src={profile.image_url} alt={profile.name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                      </motion.div>
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
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm relative mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
                <button 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <span className="text-red-500">×</span>
                </button>
              </motion.div>
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
                <TutorFinder 
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
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Find Your Perfect Mentor</h3>
                    <p className="text-gray-600 text-center max-w-md mb-6">
                      Select a mentor from the list to view their details and schedule a personalized learning session.
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
        </motion.div>
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
    </>
  );
}
