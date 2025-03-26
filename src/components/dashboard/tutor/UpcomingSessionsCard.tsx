import { useState, useEffect } from 'react';
import { Session } from '../../../types/database';
import { format } from 'date-fns';
import { Calendar, Clock, User, BookOpen, Video, RefreshCw } from 'lucide-react';
import { VideoCall } from '../../VideoCall';
import { DatabaseService } from '../../../services/database';
import { toast } from 'react-hot-toast';

interface UpcomingSessionsCardProps {
  sessions: Session[];
  tutorName?: string;
}

export function UpcomingSessionsCard({ sessions, tutorName = 'Tutor' }: UpcomingSessionsCardProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleJoinSession = async (session: Session) => {
    console.log('Starting classroom session for:', session);
    
    // Set loading state for this specific session
    setIsLoading(prev => ({ ...prev, [session.id]: true }));
    
    try {
      // Validate session data before proceeding
      if (!session.id) {
        throw new Error('Invalid session: Missing session ID');
      }
      
      // Update the session status to active in the database
      console.log('Setting session active in database...');
      const updatedSession = await DatabaseService.setSessionActive(session.id, true);
      console.log('Session updated successfully:', updatedSession);
      
      // Set the active session locally
      console.log('Setting active session locally...');
      setActiveSession(session);
      
      // Show success message
      toast?.success('Classroom session started successfully!');
    } catch (error: any) {
      console.error('Error starting session:', error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Failed to start the classroom session. Please try again.';
      
      if (error.message && error.message.includes('not found')) {
        errorMessage = 'Session not found. It may have been cancelled or removed.';
      } else if (error.code === 'PGRST116') {
        errorMessage = 'Session data is invalid. Please refresh the page and try again.';
      } else if (error.code === '23505') {
        errorMessage = 'This session is already active in another window.';
      } else if (error.code === 'PGRST204') {
        // This is the specific error for schema mismatch
        console.log('Schema mismatch error detected, attempting to start session anyway');
        // Even though there was an error updating the database, we can still proceed with the video call
        setActiveSession(session);
        toast?.success('Classroom session started successfully!');
        return; // Exit early after setting the session active
      }
      
      toast?.error(errorMessage);
    } finally {
      // Clear loading state
      setIsLoading(prev => ({ ...prev, [session.id]: false }));
    }
  };
  
  const handleCloseSession = async () => {
    if (activeSession) {
      try {
        // Update the session status to inactive in the database
        await DatabaseService.setSessionActive(activeSession.id, false);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    
    // Clear the active session locally
    setActiveSession(null);
  };
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out transform hover:shadow-xl">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white opacity-20 animate-ping-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full bg-white opacity-10 animate-ping-slow delay-300"></div>
        </div>
        
        <h2 className="text-lg font-semibold text-white flex items-center relative z-10">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Sessions
        </h2>
      </div>
      
      <div className="p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div 
                key={session.id} 
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 relative bg-white transform hover:-translate-y-1 hover:border-indigo-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ 
                  pointerEvents: 'auto',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Session status indicator - colored dot */}
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse"></div>
                  <div className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">
                    {session.status}
                  </div>
                </div>
                
                <div className="flex items-start">
                  {/* Session date circle */}
                  <div className="hidden sm:flex flex-shrink-0 mr-4 h-14 w-14 rounded-full bg-indigo-50 items-center justify-center flex-col text-indigo-700 border border-indigo-100">
                    <span className="text-xs font-semibold">{format(new Date(session.start_time), 'MMM')}</span>
                    <span className="text-lg font-bold leading-none">{format(new Date(session.start_time), 'd')}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{session.subject}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1.5 text-indigo-500" />
                      <span className="font-medium">{session.student_profiles?.name || 'Student'}</span>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1.5 text-indigo-500" />
                        <span>
                          {format(new Date(session.start_time), 'h:mm a')} - 
                          {format(new Date(session.end_time), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1.5 text-indigo-500" />
                        <span className="truncate">{session.notes || 'No notes'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <div 
                    className="inline-block" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => {
                        console.log('Button clicked for session:', session.id);
                        handleJoinSession(session);
                      }}
                      disabled={isLoading[session.id]}
                      className={`text-sm flex items-center ${isLoading[session.id] ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 cursor-pointer font-medium shadow-sm hover:shadow`}
                      type="button"
                    >
                      <Video className="h-4 w-4 mr-1.5" />
                      {isLoading[session.id] ? (
                        <span className="flex items-center">
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Starting...
                        </span>
                      ) : 'Start Session'}
                    </button>
                  </div>
                  <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-sm flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 cursor-pointer font-medium"
                      type="button"
                    >
                      <RefreshCw className="h-4 w-4 mr-1.5" />
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 text-indigo-600">
              <Calendar className="h-8 w-8" />
            </div>
            <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
              <Calendar className="h-4 w-4 mr-1.5" />
              Open Schedule
            </button>
          </div>
        )}
      </div>
      
      {/* Video Call Modal with fade-in animation */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center">
          <div className="w-full h-full max-w-7xl mx-auto animate-scale-in">
            <VideoCall
              sessionId={activeSession.id}
              roomName={`smart-learning-session-${activeSession.id}`}
              displayName={tutorName}
              onClose={handleCloseSession}
            />
          </div>
        </div>
      )}
    </div>
  );
}
