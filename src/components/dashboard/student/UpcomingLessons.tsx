import { useState, useEffect } from 'react';
import { Session } from '../../../types/database';
import { Calendar, Clock, Video, Bell } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { VideoCall } from '../../VideoCall';
import { toast } from 'react-hot-toast';

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
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Lessons
        </h2>
      </div>
      
      {/* Active Sessions Section */}
      {activeSessions.length > 0 && (
        <div className="bg-green-50 p-4 border-b border-green-100">
          <h3 className="text-green-800 font-medium flex items-center mb-2">
            <Bell className="h-4 w-4 mr-1" />
            Active Sessions Now
          </h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg p-3 shadow-sm border border-green-200 relative overflow-hidden">
                {/* Animated pulse effect */}
                <div className="absolute top-0 right-0 h-16 w-16 -mr-6 -mt-6">
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-30"></div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{session.subject}</h4>
                    <p className="text-xs text-gray-500">
                      With {session.tutor_profiles?.name || 'Tutor'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Live Now
                  </span>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleJoinSession(session)}
                    disabled={isLoading[session.id]}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 animate-pulse"
                  >
                    {isLoading[session.id] ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </>
                    ) : (
                      <>
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Join Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upcoming Sessions Section */}
      <div className="divide-y divide-gray-100">
        {sessions.filter(session => session.status !== 'in-progress').length > 0 ? (
          sessions
            .filter(session => session.status !== 'in-progress')
            .map((session) => {
              const startTime = new Date(session.start_time);
              const endTime = new Date(session.end_time);
              const timeUntil = formatDistanceToNow(startTime, { addSuffix: true });
              const canJoin = new Date() >= new Date(startTime.getTime() - 5 * 60000);
              
              return (
                <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{session.subject}</h3>
                      <p className="text-sm text-gray-500">
                        With {session.tutor_profiles?.name || 'Tutor'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {timeUntil}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {format(startTime, 'MMM d, h:mm a')} - {format(endTime, 'h:mm a')}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    {canJoin && (
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Video className="h-3.5 w-3.5 mr-1" />
                        Join Session
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No upcoming lessons scheduled</p>
            <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Schedule a Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
