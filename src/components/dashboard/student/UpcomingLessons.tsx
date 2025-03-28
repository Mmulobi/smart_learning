import { useState, useEffect } from 'react';
import { Session } from '../../../types/database';
import { Calendar, Clock, Video, Bell, ChevronRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { VideoCall } from '../../VideoCall';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface UpcomingLessonsProps {
  sessions: Session[];
  studentName?: string;
}

export function UpcomingLessons({ sessions, studentName = 'Student' }: UpcomingLessonsProps) {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [joinedSession, setJoinedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [animateIn, setAnimateIn] = useState(false);
  
  // Check for active sessions every 30 seconds
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    
    // Initial check for active sessions
    checkForActiveSessions();
    
    // Set up polling for active sessions
    const interval = setInterval(() => {
      checkForActiveSessions();
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [sessions]);
  
  // Function to check for active sessions
  const checkForActiveSessions = async () => {
    try {
      // Filter for sessions that should be active (status is 'in-progress')
      const activeSessionsFound = sessions.filter(session => session.status === 'in-progress');
      
      // If we found active sessions that weren't in our state before, show a notification
      const newActiveSessions = activeSessionsFound.filter(
        activeSession => !activeSessions.some(s => s.id === activeSession.id)
      );
      
      if (newActiveSessions.length > 0) {
        // Show notifications for new active sessions
        newActiveSessions.forEach(session => {
          toast(
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-500" />
              <span>
                Your session on <strong>{session.subject}</strong> has started!
              </span>
            </div>,
            { duration: 10000 } // Show for 10 seconds
          );
        });
      }
      
      // Update active sessions state
      setActiveSessions(activeSessionsFound);
    } catch (error) {
      console.error('Error checking for active sessions:', error);
    }
  };
  
  // Function to join a session
  const handleJoinSession = (session: Session) => {
    // Set loading state for this specific session
    setIsLoading(prev => ({ ...prev, [session.id]: true }));
    
    // Set a small delay to show the loading state
    setTimeout(() => {
      setJoinedSession(session);
      setIsLoading(prev => ({ ...prev, [session.id]: false }));
      toast.success('Joining classroom session...');
    }, 500);
  };
  
  // Function to leave a session
  const handleLeaveSession = async () => {
    setJoinedSession(null);
  };
  // If a session is joined, show the video call interface
  if (joinedSession) {
    return (
      <VideoCall
        sessionId={joinedSession.id}
        roomName={`smart-learning-session-${joinedSession.id}`}
        displayName={studentName}
        onClose={handleLeaveSession}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Lessons</h2>
              <p className="text-sm text-gray-500">
                {sessions.length} scheduled session{sessions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.subject} Session
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(session.start_time), 'MMM d, h:mm a')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(session.start_time), 'EEEE')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
            <p className="text-gray-500 mb-4">
              Schedule a session with your tutor to start learning
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Find a Tutor
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
