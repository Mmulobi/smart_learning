import { useState } from 'react';
import { Calendar, Clock, Edit3, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Session } from '../../../types/database';

interface SessionManagerProps {
  sessions: Session[];
  darkMode: boolean;
  onUpdateSession: (session: Session) => void;
}

export function SessionManager({ sessions, darkMode, onUpdateSession }: SessionManagerProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [prepNotes, setPrepNotes] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const previousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const handleUpdatePrepNotes = () => {
    if (!selectedSession) return;

    const updatedSession = {
      ...selectedSession,
      prep_notes: prepNotes,
    };

    onUpdateSession(updatedSession);
    setSelectedSession(null);
    setPrepNotes('');
  };

  const todaySessions = sessions.filter(
    (session) =>
      new Date(session.start_time).toDateString() === currentDate.toDateString()
  );

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Session Timeline</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousDay}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <button
            onClick={nextDay}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todaySessions.length === 0 ? (
          <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No sessions scheduled for this day
          </p>
        ) : (
          todaySessions.map((session) => (
            <div
              key={session.id}
              className={`${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } rounded-lg p-4 flex items-center justify-between`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    session.status === 'completed'
                      ? 'bg-green-500'
                      : session.status === 'scheduled'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <div>
                  <h3 className="font-semibold">{session.subject}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock size={14} />
                    <span>
                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span>{session.duration} minutes</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSession(session);
                  setPrepNotes(session.prep_notes || '');
                }}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                <Edit3 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Prep Notes Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg max-w-lg w-full p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Session Prep Notes</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={prepNotes}
                  onChange={(e) => setPrepNotes(e.target.value)}
                  className={`w-full h-40 p-3 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                  placeholder="Add your session preparation notes here..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleUpdatePrepNotes}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
