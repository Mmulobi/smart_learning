import { useState, useEffect, useRef } from 'react';
import { VideoCall } from '../../VideoCall';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  GraduationCap,
  Clock,
  Calendar,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Session } from '../../../types/database';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onSignOut: () => void;
  onEditProfile: () => void;
  onFindTutor?: () => void;

  sessions?: Session[];
  studentName?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ 
  activeTab, 
  onChangeTab, 
  onSignOut, 
  onEditProfile, 
  onFindTutor, 

  sessions = [],
  studentName = 'Student',
  collapsed = false,
  onToggleCollapse
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
            <div className="flex justify-center">
              <button
                onClick={onFindTutor}
                className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg p-3 w-full transition-all duration-150 shadow-sm hover:shadow group"
              >
                <Sparkles className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Find Perfect Mentor</span>
              </button>
            </div>
          </div>
          
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-4 px-2">Navigation</h3>
            <nav className="space-y-2.5">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isLiveSession = tab.id === 'sessions';
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700'
                    }`}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    aria-label={tab.label}
                  >
                    {/* Background glow effect for active tab */}
                    {isActive && (
                      <motion.div 
                        className="absolute inset-0 rounded-lg bg-indigo-500 opacity-30 -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        layoutId="activeTabBackgroundDesktop"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="relative">
                          {isLiveSession && tab.badge && (
                            <div className="absolute -top-1 -right-1 flex items-center justify-center">
                              <span className="absolute h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75"></span>
                              <span className="relative h-2.5 w-2.5 rounded-full bg-red-600"></span>
                            </div>
                          )}
                          <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white transition-colors duration-200'}`} />
                        </div>
                        <span className={`flex-1 ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
                      </div>
                      
                      {isLiveSession && tab.badge && (
                        <motion.div 
                          className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-red-500 text-white'}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.span 
                            animate={{ y: [0, -2, 0] }}
                            transition={{ 
                              repeat: Infinity,
                              repeatType: "reverse",
                              duration: 1.5,
                              ease: "easeInOut"
                            }}
                          >
                            LIVE
                          </motion.span>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
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
        <div className={`flex flex-col ${collapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out`}>
          <div className="flex flex-col h-0 flex-1 bg-gradient-to-b from-indigo-800 to-indigo-900 shadow-xl relative" ref={sidebarRef}>
            {/* Collapse toggle button */}
            <button 
              onClick={onToggleCollapse}
              className="absolute -right-3 top-20 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors z-20"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight className={`h-4 w-4 text-indigo-600 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800">
              <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'}`}>
                  <GraduationCap className="h-7 w-7 text-indigo-300" />
                  {!collapsed && <h1 className="text-xl font-bold text-white">Smart Learning</h1>}
                </div>
              </div>
              
              <div className="px-4 mb-6">
                <div className="bg-indigo-700 rounded-xl p-4 shadow-inner">
                  {collapsed ? (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-white p-0.5 shadow-md mb-3">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <User className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 w-full">
                        <button
                          onClick={onEditProfile}
                          className="flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors duration-150"
                          aria-label="Edit Profile"
                        >
                          <User className="h-4 w-4" />
                        </button>
                        <button
                          onClick={onSignOut}
                          className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors duration-150"
                          aria-label="Sign Out"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
              
              {/* Active & Upcoming Sessions Section */}
              <motion.div 
                className="px-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <motion.button 
                  onClick={toggleSessionsExpanded}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2 hover:text-white transition-colors duration-150 group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {!collapsed && (
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Zap className="h-3.5 w-3.5 mr-1.5 text-indigo-400 group-hover:text-indigo-200" />
                      <span>Live Sessions</span>
                    </motion.div>
                  )}
                  {collapsed ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <motion.div
                      animate={{ rotate: expandedSessions ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-4 w-4 group-hover:text-white" />
                    </motion.div>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {expandedSessions && (
                    <motion.div 
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      {/* Active Sessions */}
                      {activeSessions.length > 0 && (
                        <motion.div 
                          className="mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-xl p-3 shadow-lg relative overflow-hidden">
                            {/* Background animated elements */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div className="absolute h-16 w-16 rounded-full bg-white opacity-10 -top-8 -right-8"></div>
                              <div className="absolute h-24 w-24 rounded-full bg-white opacity-5 -bottom-10 -left-10"></div>
                              <motion.div 
                                className="absolute h-4 w-4 rounded-full bg-white opacity-20"
                                animate={{ 
                                  x: [0, 30, 10, 40, 0],
                                  y: [0, 20, 40, 10, 0] 
                                }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 10,
                                  ease: "linear" 
                                }}
                                style={{ top: '30%', left: '60%' }}
                              />
                            </div>
                            
                            <motion.h3 
                              className="text-sm font-semibold text-white mb-3 flex items-center"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-red-500 mr-2 relative">
                                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60"></div>
                                <Video className="h-3 w-3 text-white" />
                              </div>
                              <span>Live Now</span>
                            </motion.h3>
                            
                            <div className="space-y-2">
                              {activeSessions.map((session, index) => (
                                <motion.div 
                                  key={session.id} 
                                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-2.5 hover:bg-opacity-20 transition-all duration-150 border border-white border-opacity-10 relative overflow-hidden group"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                >
                                  {/* Animated glow effect */}
                                  <motion.div 
                                    className="absolute top-0 right-0 h-12 w-12 -mr-4 -mt-4 opacity-60"
                                    animate={{ 
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 0.7, 0.5] 
                                    }}
                                    transition={{ 
                                      repeat: Infinity, 
                                      duration: 2,
                                      ease: "easeInOut" 
                                    }}
                                  >
                                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-20"></div>
                                  </motion.div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-white">
                                      <p className="text-xs font-medium">{session.subject}</p>
                                      <p className="text-xs text-green-100 opacity-90">With {session.tutor_profiles?.name || 'Tutor'}</p>
                                    </div>
                                    <motion.button
                                      onClick={() => handleJoinSession(session)}
                                      className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-green-600 hover:bg-green-50 transition-colors duration-150 shadow-md relative overflow-hidden"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <motion.div 
                                        className="absolute inset-0 bg-green-100 opacity-30"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ 
                                          repeat: Infinity, 
                                          duration: 2,
                                          ease: "easeInOut" 
                                        }}
                                      />
                                      <Video className="h-4 w-4 relative z-10" />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Upcoming Sessions */}
                      {upcomingSessions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <h3 className="text-xs font-medium text-indigo-300 mb-2 px-2 flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                            <span>Upcoming</span>
                          </h3>
                          <div className="space-y-2">
                            {upcomingSessions.map((session, index) => {
                              const startTime = new Date(session.start_time);
                              const now = new Date();
                              const isToday = startTime.toDateString() === now.toDateString();
                              const isTomorrow = new Date(new Date().setDate(now.getDate() + 1)).toDateString() === startTime.toDateString();
                              const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : startTime.toLocaleDateString(undefined, { weekday: 'short' });
                              
                              return (
                                <motion.div 
                                  key={session.id} 
                                  className="bg-gradient-to-r from-indigo-800 to-indigo-700 rounded-lg p-2.5 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 border border-indigo-600 shadow-sm relative group"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                                  whileHover={{ y: -2, scale: 1.01 }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-xs font-medium text-white">{session.subject}</p>
                                      <div className="flex items-center text-xs text-indigo-300">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{dayLabel}, {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      </div>
                                    </div>
                                    <motion.div 
                                      className="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-600 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200"
                                      whileHover={{ rotate: 15 }}
                                    >
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </motion.div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Quick Actions */}
              <div className="px-4 mb-6">
                {!collapsed && <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-3 px-2">Quick Actions</h3>}
                <div className="flex justify-center">
                  <button
                    onClick={onFindTutor}
                    className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg p-3 transition-all duration-150 shadow-sm hover:shadow-md group w-full"
                    aria-label="Find Perfect Mentor"
                  >
                    {collapsed ? (
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    ) : (
                      <>
                        <div className="p-2 rounded-full bg-indigo-600 group-hover:bg-indigo-500 transition-colors duration-150 mb-2 relative">
                          <Sparkles className="h-5 w-5" />
                          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-ping"></div>
                        </div>
                        <span className="text-xs font-medium">Find Perfect Mentor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="px-4 mb-6">
                {!collapsed && <h3 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-4 px-2">Navigation</h3>}
                <nav className="space-y-2.5">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isLiveSession = tab.id === 'sessions';
                    
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 relative group ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'text-indigo-100 hover:bg-indigo-700'
                        }`}
                        whileHover={{ scale: 1.02, x: collapsed ? 0 : 3 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        aria-label={tab.label}
                      >
                        {/* Background glow effect for active tab */}
                        {isActive && (
                          <motion.div 
                            className="absolute inset-0 rounded-lg bg-indigo-500 opacity-30 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            layoutId="activeTabBackground"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} w-full`}>
                          <div className="flex items-center">
                            <div className="relative">
                              {isLiveSession && tab.badge && (
                                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                                  <span className="absolute h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75"></span>
                                  <span className="relative h-2.5 w-2.5 rounded-full bg-red-600"></span>
                                </div>
                              )}
                              <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white transition-colors duration-200'}`} />
                            </div>
                            {!collapsed && <span className={`flex-1 ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>}
                          </div>
                          
                          {!collapsed && isLiveSession && tab.badge && (
                            <motion.div 
                              className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isActive ? 'bg-white bg-opacity-20 text-white' : 'bg-red-500 text-white'}`}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.span 
                                animate={{ y: [0, -2, 0] }}
                                transition={{ 
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                              >
                                LIVE
                              </motion.span>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="px-4 mt-auto mb-6">
                {collapsed ? (
                  <div className="bg-indigo-800 rounded-lg p-2 mb-4 shadow-inner flex justify-center">
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </div>
                ) : (
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
                )}
                <button
                  onClick={() => handleTabClick('help')}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded-md transition-colors duration-150"
                >
                  <HelpCircle className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && 'Help & Support'}
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
