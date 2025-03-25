import { useState } from 'react';
import { Session } from '../../../types/database';
import { Video, Calendar, Clock, X, Users, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

interface LiveSessionsProps {
  sessions: Session[];
  onScheduleSession: () => void;
}

export function LiveSessions({ sessions, onScheduleSession }: LiveSessionsProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
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
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">
              {activeSession.subject} Session
            </h3>
            <button 
              onClick={endSession}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              End Session
            </button>
          </div>
          
          {/* Video conference area */}
          <div className="bg-gray-900 rounded-lg overflow-hidden relative aspect-video mb-4">
            {videoEnabled ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* This would be replaced with actual video conferencing component */}
                <img 
                  src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Video call" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <Users className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Camera is turned off</p>
                </div>
              </div>
            )}
            
            {/* Self view */}
            {videoEnabled && (
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded overflow-hidden border-2 border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                  alt="Self view" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4 py-2">
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            
            <button 
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
            >
              {videoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
            </button>
            
            <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            
            <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
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
