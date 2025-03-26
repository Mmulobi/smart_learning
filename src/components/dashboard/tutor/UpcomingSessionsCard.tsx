import { useState } from 'react';
import { Session } from '../../../types/database';
import { format } from 'date-fns';
import { Calendar, Clock, User, BookOpen } from 'lucide-react';
import { VideoCall } from '../../VideoCall';
import { DatabaseService } from '../../../services/database';

interface UpcomingSessionsCardProps {
  sessions: Session[];
  tutorName?: string;
}

export function UpcomingSessionsCard({ sessions, tutorName = 'Tutor' }: UpcomingSessionsCardProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  
  const handleJoinSession = async (session: Session) => {
    console.log('Starting classroom session for:', session);
    
    // Set loading state for this specific session
    setIsLoading(prev => ({ ...prev, [session.id]: true }));
    
    try {
      // Update the session status to active in the database
      console.log('Setting session active in database...');
      const updatedSession = await DatabaseService.setSessionActive(session.id, true);
      console.log('Session updated successfully:', updatedSession);
      
      // Set the active session locally
      console.log('Setting active session locally...');
      setActiveSession(session);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start the classroom session. Please try again.');
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Sessions
        </h2>
      </div>
      
      <div className="p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{session.subject}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{session.student_profiles?.name || 'Student'}</span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {session.status}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {format(new Date(session.start_time), 'MMM d, h:mm a')} - 
                      {format(new Date(session.end_time), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{session.notes || 'No notes'}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  {/* Separate the button from the card for better click handling */}
                  <div 
                    className="inline-block" 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <button 
                      onClick={() => {
                        console.log('Button clicked for session:', session.id);
                        handleJoinSession(session);
                      }}
                      disabled={isLoading[session.id]}
                      className={`text-xs ${isLoading[session.id] ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer font-medium`}
                      type="button"
                    >
                      {isLoading[session.id] ? 'Starting...' : 'Start Classroom Session'}
                    </button>
                  </div>
                  <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
                      type="button"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming sessions scheduled</p>
            <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Open Schedule
            </button>
          </div>
        )}
      </div>
      
      {/* Video Call Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50">
          <VideoCall
            sessionId={activeSession.id}
            roomName={`smart-learning-session-${activeSession.id}`}
            displayName={tutorName}
            onClose={handleCloseSession}
          />
        </div>
      )}
    </div>
  );
}
