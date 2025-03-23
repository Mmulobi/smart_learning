import { useState } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import type { TutorProfile } from '../../../types/dashboard';

interface AvailabilityEditorProps {
  profile: TutorProfile;
  darkMode: boolean;
  onUpdateAvailability: (availability: TutorProfile['availability']) => void;
  onSyncCalendar: () => void;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export function AvailabilityEditor({
  profile,
  darkMode,
  onUpdateAvailability,
  onSyncCalendar,
}: AvailabilityEditorProps) {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    start: '09:00',
    end: '17:00',
  });

  const addTimeSlot = () => {
    const dayIndex = DAYS.indexOf(selectedDay);
    const updatedAvailability = { ...profile.availability };

    if (!updatedAvailability[dayIndex]) {
      updatedAvailability[dayIndex] = [];
    }

    // Check for conflicts
    const hasConflict = updatedAvailability[dayIndex].some(
      (slot) =>
        (newTimeSlot.start >= slot.start && newTimeSlot.start < slot.end) ||
        (newTimeSlot.end > slot.start && newTimeSlot.end <= slot.end) ||
        (newTimeSlot.start <= slot.start && newTimeSlot.end >= slot.end)
    );

    if (!hasConflict) {
      updatedAvailability[dayIndex].push(newTimeSlot);
      updatedAvailability[dayIndex].sort((a, b) => (a.start > b.start ? 1 : -1));
      onUpdateAvailability(updatedAvailability);
    }
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updatedAvailability = { ...profile.availability };
    updatedAvailability[dayIndex] = updatedAvailability[dayIndex].filter(
      (_, index) => index !== slotIndex
    );
    onUpdateAvailability(updatedAvailability);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Availability Schedule</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSyncCalendar}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Calendar size={20} />
            <span>Sync Calendar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium">Add Time Slot</h3>
          <div className="space-y-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className={`w-full p-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">Start Time</label>
                <select
                  value={newTimeSlot.start}
                  onChange={(e) =>
                    setNewTimeSlot({ ...newTimeSlot, start: e.target.value })
                  }
                  className={`w-full p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-1">End Time</label>
                <select
                  value={newTimeSlot.end}
                  onChange={(e) =>
                    setNewTimeSlot({ ...newTimeSlot, end: e.target.value })
                  }
                  className={`w-full p-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addTimeSlot}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Time Slot
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium">Weekly Schedule</h3>
          <div
            className={`grid gap-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } rounded-lg p-4`}
          >
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="space-y-2">
                <h4 className="font-medium">{day}</h4>
                {profile.availability[dayIndex]?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.availability[dayIndex].map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                          darkMode ? 'bg-gray-600' : 'bg-white'
                        }`}
                      >
                        <Clock size={16} className="text-indigo-500" />
                        <span className="text-sm">
                          {slot.start} - {slot.end}
                        </span>
                        <button
                          onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          className={`p-1 rounded-full ${
                            darkMode
                              ? 'hover:bg-gray-500'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No time slots added</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
