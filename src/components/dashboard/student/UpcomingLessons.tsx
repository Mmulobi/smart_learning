import { Session } from '../../../types/database';
import { Calendar, Clock, Video } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface UpcomingLessonsProps {
  sessions: Session[];
}

export function UpcomingLessons({ sessions }: UpcomingLessonsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Lessons
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            const startTime = new Date(session.start_time);
            const endTime = new Date(session.end_time);
            const timeUntil = formatDistanceToNow(startTime, { addSuffix: true });
            
            return (
              <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{session.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {session.student_profiles?.name || 'Loading...'}
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
                  {new Date() >= new Date(startTime.getTime() - 5 * 60000) && (
                    <button
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
