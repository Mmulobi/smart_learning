import { useState } from 'react';
import { Session } from '../../../types/database';
import { Video, Calendar, Clock } from 'lucide-react';
import { VideoCall } from '../../VideoCall';

interface LiveSessionsProps {
  sessions: Session[];
  onScheduleSession: () => void;
}

export function LiveSessions({ sessions, onScheduleSession }: LiveSessionsProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  
  // Get upcoming sessions for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= today && sessionDate < tomorrow && session.status === 'scheduled';
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  // Check if any session is currently active (within the scheduled time)
  const now = new Date();
  
  const joinSession = (session: Session) => {
    setActiveSession(session);
  };
  
  const endSession = () => {
    setActiveSession(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Video className="h-5 w-5 mr-2" />
          Live & Scheduled Sessions
        </h2>
      </div>
      
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
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Today's Sessions</h3>
            
            {todaySessions.length > 0 ? (
              <div className="space-y-3">
                {todaySessions.map((session) => {
                  const startTime = new Date(session.start_time);
                  const endTime = new Date(session.end_time);
                  const canJoin = now >= new Date(startTime.getTime() - 5 * 60000); // Can join 5 minutes before
                  const isActive = now >= startTime && now <= endTime;
                  
                  return (
                    <div 
                      key={session.id} 
                      className={`border rounded-lg p-4 ${isActive ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{session.subject}</h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        {canJoin && (
                          <button
                            onClick={() => joinSession(session)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                              isActive 
                                ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          >
                            <Video className="h-3.5 w-3.5 mr-1" />
                            {isActive ? 'Join Now' : 'Join Soon'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No sessions scheduled for today</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onScheduleSession}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
