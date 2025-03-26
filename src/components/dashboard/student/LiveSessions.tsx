import { useState, useEffect } from 'react';
import { Session } from '../../../types/database';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  Play,
  Plus,
  Zap
} from 'lucide-react';
import { VideoCall } from '../../VideoCall';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveSessionsProps {
  sessions: Session[];
  onScheduleSession: () => void;
}

export function LiveSessions({ sessions, onScheduleSession }: LiveSessionsProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'today' | 'upcoming'>('active');

  // Get active sessions (status is 'in-progress')
  const activeSessions = sessions.filter(session => session.status === 'in-progress')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  // Get upcoming sessions for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= today && sessionDate < tomorrow && session.status === 'scheduled';
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  // Get upcoming sessions for the next 7 days
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate > tomorrow && sessionDate < nextWeek && session.status === 'scheduled';
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  useEffect(() => {
    // Trigger entrance animations after component mounts
    setTimeout(() => setAnimateIn(true), 100);
    
    // Auto-expand the first active session if any
    if (activeSessions.length > 0) {
      setExpandedSession(activeSessions[0].id);
    }
    
    // Set active tab based on available sessions
    if (activeSessions.length > 0) {
      setActiveTab('active');
    } else if (todaySessions.length > 0) {
      setActiveTab('today');
    } else if (upcomingSessions.length > 0) {
      setActiveTab('upcoming');
    }
  }, [activeSessions, todaySessions, upcomingSessions]);
  
  const joinSession = (session: Session) => {
    setActiveSession(session);
  };
  
  const endSession = () => {
    setActiveSession(null);
  };
  
  const toggleExpandSession = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };
  
  const formatSessionTime = (startTime: string) => {
    const date = new Date(startTime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    } else {
      return `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at ${timeString}`;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {activeSession ? (
        <div className="fixed inset-0 z-50">
          <VideoCall
            sessionId={activeSession.id}
            roomName={`smart-learning-session-${activeSession.id}`}
            displayName="Student"
            onClose={endSession}
          />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          {/* Active Sessions */}
          <AnimatePresence>
            {activeSessions.length > 0 && (
              <motion.div
                key="active-sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-200">
                      LIVE
                    </span>
                  </div>
                </div>
                
                <div className="px-4 pb-4 space-y-3">
                  {activeSessions.map((session, index) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                    >
                      <button 
                        onClick={() => toggleExpandSession(session.id)}
                        className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-red-50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Video className="h-5 w-5 text-red-500 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{session.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{session.subject}</p>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSession === session.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedSession === session.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                              <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{formatSessionTime(session.start_time)}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{session.duration} minutes</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Tutor: {session.tutor_name || 'Assigned Tutor'}</span>
                                </div>
                                
                                {session.description && (
                                  <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                    <BookOpen className="h-4 w-4 mr-2 mt-0.5" />
                                    <span>{session.description}</span>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => joinSession(session)}
                                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                                >
                                  <Play className="h-4 w-4" />
                                  <span>Join Session Now</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Today's Sessions */}
          <AnimatePresence>
            {todaySessions.length > 0 && (
              <motion.div
                key="today-sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Sessions</h2>
                  </div>
                </div>
                
                <div className="px-4 pb-4 space-y-3">
                  {todaySessions.map((session, index) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                    >
                      <button 
                        onClick={() => toggleExpandSession(session.id)}
                        className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{session.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{session.subject}</p>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSession === session.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedSession === session.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                              <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{formatSessionTime(session.start_time)}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{session.duration} minutes</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Tutor: {session.tutor_name || 'Assigned Tutor'}</span>
                                </div>
                                
                                {session.description && (
                                  <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                    <BookOpen className="h-4 w-4 mr-2 mt-0.5" />
                                    <span>{session.description}</span>
                                  </div>
                                )}
                                
                                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                                  Session will start at {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Upcoming Sessions */}
          <AnimatePresence>
            {upcomingSessions.length > 0 && (
              <motion.div
                key="upcoming-sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-5 w-5 text-green-500" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h2>
                  </div>
                </div>
                
                <div className="px-4 pb-4 space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                    >
                      <button 
                        onClick={() => toggleExpandSession(session.id)}
                        className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-50 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{session.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatSessionTime(session.start_time)}</p>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSession === session.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedSession === session.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                              <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{formatSessionTime(session.start_time)}</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{session.duration} minutes</span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Tutor: {session.tutor_name || 'Assigned Tutor'}</span>
                                </div>
                                
                                {session.description && (
                                  <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                    <BookOpen className="h-4 w-4 mr-2 mt-0.5" />
                                    <span>{session.description}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* No Sessions */}
          <AnimatePresence>
            {activeSessions.length === 0 && todaySessions.length === 0 && upcomingSessions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Sessions Scheduled</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">You don't have any upcoming sessions scheduled. Click the button below to schedule a new session.</p>
                
                <motion.button
                  onClick={onScheduleSession}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule a Session
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Schedule Button */}
          {(activeSessions.length > 0 || todaySessions.length > 0 || upcomingSessions.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-center"
            >
              <motion.button
                onClick={onScheduleSession}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Another Session
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
