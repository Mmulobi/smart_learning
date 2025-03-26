import { useState, useEffect } from 'react';
import { Session } from '../../../types/database';
import { Video, Calendar, Clock, Users, BookOpen, ChevronRight } from 'lucide-react';
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
  
  // Check if any session is currently active (within the scheduled time)
  const now = new Date();
  
  useEffect(() => {
    // Trigger entrance animations after component mounts
    setTimeout(() => setAnimateIn(true), 100);
    
    // Auto-expand the first active session if any
    if (activeSessions.length > 0) {
      setExpandedSession(activeSessions[0].id);
    }
  }, [activeSessions]);
  
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
    <div className="space-y-6">
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
        <>
          {/* Active Sessions */}
          <AnimatePresence>
            {activeSessions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Active Sessions
                  </h2>
                  <div className="animate-pulse flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-xs font-medium text-white">LIVE</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {activeSessions.map((session) => {
                    const isExpanded = expandedSession === session.id;
                    const startTime = new Date(session.start_time);
                    const tutorName = session.tutor_profiles?.name || 'Tutor';
                    
                    return (
                      <motion.div 
                        key={session.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden relative"
                      >
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => toggleExpandSession(session.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-white flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {session.subject}
                              </h3>
                              <p className="text-sm text-green-100 mt-1 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1.5" />
                                With {tutorName}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  joinSession(session);
                                }}
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-green-600 hover:bg-green-50 transition-colors duration-150 mr-2 shadow-md animate-pulse"
                              >
                                <Video className="h-5 w-5" />
                              </button>
                              <ChevronRight className={`h-5 w-5 text-white transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4 border-t border-white border-opacity-10"
                            >
                              <div className="pt-3 text-white">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="text-sm">
                                      Started at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                                
                                {session.notes && (
                                  <div className="mt-2 p-3 bg-white bg-opacity-10 rounded-md">
                                    <p className="text-sm">{session.notes}</p>
                                  </div>
                                )}
                                
                                <div className="mt-4 flex justify-center">
                                  <button
                                    onClick={() => joinSession(session)}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-md font-medium hover:bg-green-50 transition-colors duration-150 shadow-md"
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Session Now
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Animated pulse effect */}
                        <div className="absolute top-0 right-0 h-16 w-16 -mr-8 -mt-8 pointer-events-none">
                          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                          <div className="absolute inset-0 rounded-full bg-green-500 opacity-30"></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Today's Sessions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Today's Sessions
              </h2>
            </div>
            
            <div className="p-6">
              {todaySessions.length > 0 ? (
                <div className="space-y-3">
                  {todaySessions.map((session) => {
                    const startTime = new Date(session.start_time);
                    const endTime = new Date(session.end_time);
                    const canJoin = now >= new Date(startTime.getTime() - 5 * 60000); // Can join 5 minutes before
                    const isActive = now >= startTime && now <= endTime;
                    const isUpcoming = startTime > now;
                    const tutorName = session.tutor_profiles?.name || 'Tutor';
                    
                    return (
                      <motion.div 
                        key={session.id}
                        whileHover={{ scale: 1.01 }}
                        className={`border rounded-lg overflow-hidden transition-all duration-200 ${isActive ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                {session.subject}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1.5" />
                                With {tutorName}
                              </p>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                <span>
                                  {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              {isUpcoming && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Upcoming
                                </span>
                              )}
                              
                              {canJoin && (
                                <button
                                  onClick={() => joinSession(session)}
                                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                                    isActive 
                                      ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                                  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150`}
                                >
                                  <Video className="h-3.5 w-3.5 mr-1" />
                                  {isActive ? 'Join Now' : 'Join Soon'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-1">No sessions scheduled for today</p>
                  <p className="text-sm text-gray-400">Schedule a session with a tutor</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Sessions
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {upcomingSessions.map((session) => {
                    const tutorName = session.tutor_profiles?.name || 'Tutor';
                    
                    return (
                      <motion.div 
                        key={session.id}
                        whileHover={{ scale: 1.01 }}
                        className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                                {session.subject}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500 flex items-center">
                                <Users className="h-3.5 w-3.5 mr-1.5" />
                                With {tutorName}
                              </p>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                <span>
                                  {formatSessionTime(session.start_time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Schedule button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={onScheduleSession}
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 transform hover:scale-105"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule New Session
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
