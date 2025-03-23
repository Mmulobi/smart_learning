import { useState } from 'react';
import { Calendar } from 'lucide-react';
import type { Session } from '../../types/dashboard';

interface ScheduleCalendarProps {
  sessions: Session[];
  darkMode: boolean;
  onSessionSelect: (session: Session) => void;
}

export function ScheduleCalendar({ sessions, darkMode, onSessionSelect }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const sessionsMap = new Map(
    sessions.map(session => [
      new Date(session.start_time).getDate(),
      session
    ])
  );

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Schedule</h2>
        <Calendar className="text-indigo-500" size={24} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          ←
        </button>
        <h3 className="text-lg font-medium">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={nextMonth}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className={`text-center text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const session = sessionsMap.get(day);
          return (
            <button
              key={day}
              onClick={() => session && onSessionSelect(session)}
              className={`aspect-square p-2 rounded-lg relative ${
                session
                  ? darkMode
                    ? 'bg-indigo-900/50 hover:bg-indigo-900/70'
                    : 'bg-indigo-100 hover:bg-indigo-200'
                  : darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="absolute top-1 left-1 text-sm">{day}</span>
              {session && (
                <div
                  className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                    darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
