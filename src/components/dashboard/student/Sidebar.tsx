import { useState, useEffect, useRef } from 'react';
import { VideoCall } from '../../VideoCall';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  MessageSquare, 
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  Search,
  Play,
  Sparkles,
  GraduationCap,
  Clock,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Session } from '../../../types/database';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
  onFindTutor?: () => void;
  onStartLesson?: () => void;
  sessions?: Session[];
  studentName?: string;
}

export function Sidebar({ 
  activeTab, 
  onChangeTab, 
  onSignOut, 
  onEditProfile, 
  onFindTutor, 
  onStartLesson,
  sessions = [],
  studentName = 'Student'
}: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [expandedSessions, setExpandedSessions] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Filter for active sessions (status is 'in-progress')
  const activeSessions = sessions.filter(session => session.status === 'in-progress');
  
  // Get upcoming sessions (scheduled sessions in the future)
  const now = new Date();
  const upcomingSessions = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate > now && session.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3); // Show only the next 3 upcoming sessions
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Trigger entrance animations after component mounts
    setTimeout(() => setAnimateIn(true), 100);
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-expand sessions section when there are active sessions
  useEffect(() => {
    if (activeSessions.length > 0) {
      setExpandedSessions(true);
    }
  }, [activeSessions.length]);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sessions', label: 'Live Sessions', icon: Video, badge: activeSessions.length > 0 ? activeSessions.length : undefined },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];
  
  const handleTabClick = (tabId: string) => {
    onChangeTab(tabId);
    setMobileMenuOpen(false);
  };
  
  const handleStartClassroomSession = () => {
    setShowVideoCall(true);
  };
  
  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    setActiveSession(null);
  };
  
  const handleJoinSession = (session: Session) => {
    setActiveSession(session);
    setShowVideoCall(true);
  };
  
  const toggleSessionsExpanded = () => {
    setExpandedSessions(!expandedSessions);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-indigo-700 to-purple-700 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="ml-2 text-lg font-semibold text-white flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Smart Learning
          </span>
        </div>
        {activeSessions.length > 0 && (
          <div className="animate-pulse">
            <button 
              onClick={() => handleTabClick('sessions')}
              className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium"
            >
              <Video className="h-3.5 w-3.5 mr-1.5" />
              {activeSessions.length} Active {activeSessions.length === 1 ? 'Session' : 'Sessions'}
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 z-10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative flex flex-col w-80 h-full max-w-xs bg-gradient-to-b from-indigo-800 to-indigo-900 pt-16 pb-4 overflow-y-auto shadow-xl" ref={sidebarRef}>
          <div className="px-4 py-3 mb-6 border-b border-indigo-700">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={onEditProfile}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-700 rounded-md transition-colors duration-150"
              >
                <User className="h-4 w-4 mr-3" />
                Edit Profile
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-indigo-700 rounded-md transition-colors duration-150"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Active Sessions Section (Mobile) */}
          {activeSessions.length > 0 && (
            <div className="px-4 mb-6">
              <div 
                className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-3 shadow-md transition-all duration-300"
              >
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Active Sessions
                </h3>
                <div className="space-y-2">
                  {activeSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-md p-2 hover:bg-opacity-20 transition-all duration-150"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-white">
                          <p className="text-xs font-medium">{session.subject}</p>
                          <p className="text-xs text-green-100">{new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <button
                          onClick={() => handleJoinSession(session)}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-green-600 hover:bg-green-50 transition-colors duration-150"
                        >
                          <Video className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onFindTutor}
                className="flex flex-col items-center justify-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
              >
                <Search className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Find Tutor</span>
              </button>
              <button
                onClick={onStartLesson}
                className="flex flex-col items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
              >
                <Play className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Start Lesson</span>
              </button>
            </div>
          </div>
          
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Navigation</h3>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="px-4 mt-auto">
            <div className="bg-indigo-800 rounded-lg p-3 mb-4 shadow-inner">
              <div className="text-xs text-indigo-300 mb-1">{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
              <div className="text-sm font-medium text-white">{currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <button
              onClick={() => handleTabClick('help')}
              className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors duration-150"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </button>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 z-10 bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-indigo-800 to-indigo-900 shadow-xl" ref={sidebarRef}>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-7 w-7 text-indigo-300" />
                  <h1 className="text-xl font-bold text-white">Smart Learning</h1>
                </div>
              </div>
              
              <div className="px-4 mb-6">
                <div className="bg-indigo-700 rounded-xl p-4 shadow-inner">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-white p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Student</p>
                      <p className="text-xs text-indigo-300 truncate">{currentTime.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onEditProfile}
                      className="flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    >
                      <User className="h-3.5 w-3.5 mr-1.5" />
                      Profile
                    </button>
                    <button
                      onClick={onSignOut}
                      className="flex items-center justify-center py-2 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-md transition-colors duration-150"
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active & Upcoming Sessions Section */}
              <div className={`px-4 mb-6 transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button 
                  onClick={toggleSessionsExpanded}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2 hover:text-white transition-colors duration-150"
                >
                  <span>Your Sessions</span>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expandedSessions ? 'rotate-90' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSessions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {/* Active Sessions */}
                  {activeSessions.length > 0 && (
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-3 shadow-md">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                          <Video className="h-4 w-4 mr-2" />
                          Live Now
                        </h3>
                        <div className="space-y-2">
                          {activeSessions.map((session) => (
                            <div 
                              key={session.id} 
                              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-md p-2 hover:bg-opacity-20 transition-all duration-150 relative overflow-hidden"
                            >
                              {/* Animated pulse effect */}
                              <div className="absolute top-0 right-0 h-12 w-12 -mr-4 -mt-4">
                                <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                                <div className="absolute inset-0 rounded-full bg-green-500 opacity-30"></div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="text-white">
                                  <p className="text-xs font-medium">{session.subject}</p>
                                  <p className="text-xs text-green-100">With {session.tutor_profiles?.name || 'Tutor'}</p>
                                </div>
                                <button
                                  onClick={() => handleJoinSession(session)}
                                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-green-600 hover:bg-green-50 transition-colors duration-150 animate-pulse"
                                >
                                  <Video className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming Sessions */}
                  {upcomingSessions.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-indigo-300 mb-2 px-2">Upcoming</h3>
                      <div className="space-y-2">
                        {upcomingSessions.map((session) => {
                          const startTime = new Date(session.start_time);
                          const now = new Date();
                          const isToday = startTime.toDateString() === now.toDateString();
                          const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === startTime.toDateString();
                          const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : startTime.toLocaleDateString(undefined, { weekday: 'short' });
                          
                          return (
                            <div key={session.id} className="bg-indigo-700 rounded-md p-2 hover:bg-indigo-600 transition-colors duration-150">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-white">{session.subject}</p>
                                  <div className="flex items-center text-xs text-indigo-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{dayLabel}, {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-indigo-300">
                                  <Calendar className="h-3 w-3" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="px-4 mb-6">
                <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onFindTutor}
                    className="flex flex-col items-center justify-center bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
                  >
                    <div className="p-2 rounded-full bg-indigo-600 group-hover:bg-indigo-500 transition-colors duration-150 mb-2">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Find Tutor</span>
                  </button>
                  <button
                    onClick={handleStartClassroomSession}
                    className="flex flex-col items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow group"
                  >
                    <div className="p-2 rounded-full bg-purple-600 group-hover:bg-purple-500 transition-colors duration-150 mb-2">
                      <Play className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Start Classroom Session</span>
                  </button>
                </div>
              </div>
              
              <div className="px-4 mb-6">
                <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Navigation</h3>
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-150 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'text-indigo-100 hover:bg-indigo-700'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="flex-1">{tab.label}</span>
                        {tab.badge && (
                          <span className="flex items-center justify-center h-5 w-5 bg-green-500 text-white text-xs font-medium rounded-full animate-pulse">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="px-4 mt-auto mb-6">
                <div className="bg-indigo-800 rounded-lg p-3 mb-4 shadow-inner">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                    <span className="text-xs font-medium text-indigo-300">Learning Streak</span>
                  </div>
                  <div className="mt-2 h-2 bg-indigo-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 w-3/4"></div>
                  </div>
                  <div className="mt-1 text-xs text-right text-indigo-300">3 days in a row</div>
                </div>
                <button
                  onClick={() => handleTabClick('help')}
                  className="flex items-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors duration-150"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="fixed inset-0 z-50">
          <VideoCall
            sessionId={activeSession ? activeSession.id : "direct-session"}
            roomName={activeSession ? `smart-learning-session-${activeSession.id}` : "smart-learning-direct-session"}
            displayName={studentName}
            onClose={handleCloseVideoCall}
          />
        </div>
      )}
    </>
  );
}
