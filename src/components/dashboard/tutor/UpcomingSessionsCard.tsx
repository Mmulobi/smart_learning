import { Session } from '../../../types/database';
import { format } from 'date-fns';
import { Calendar, Clock, User, BookOpen } from 'lucide-react';

interface UpcomingSessionsCardProps {
  sessions: Session[];
}

export function UpcomingSessionsCard({ sessions }: UpcomingSessionsCardProps) {
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
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                  <button className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100">
                    Join Session
                  </button>
                  <button className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                    Reschedule
                  </button>
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
    </div>
  );
}
