import { useState } from 'react';
import { TutorProfile, Session } from '../../../types/database';
import { Calendar, Clock, Plus, X } from 'lucide-react';

interface ScheduleProps {
  profile: TutorProfile;
  sessions: Session[];
  onUpdateAvailability?: (availability: any) => void;
}

export function Schedule({ profile, sessions, onUpdateAvailability }: ScheduleProps) {
  const [editMode, setEditMode] = useState(false);
  const [availability, setAvailability] = useState(profile.availability || {
    total_hours: 0,
    schedule: {}
  });
  
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];
  
  // Get upcoming sessions (scheduled sessions in the future)
  const now = new Date();
  const upcomingSessions = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate > now && session.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const handleAddTimeSlot = (day: string) => {
    const newSchedule = { ...availability.schedule };
    if (!newSchedule[day]) {
      newSchedule[day] = [];
    }
    
    newSchedule[day].push({ start: '09:00', end: '12:00' });
    
    const newAvailability = {
      ...availability,
      schedule: newSchedule
    };
    
    setAvailability(newAvailability);
  };
  
  const handleRemoveTimeSlot = (day: string, index: number) => {
    const newSchedule = { ...availability.schedule };
    newSchedule[day].splice(index, 1);
    
    if (newSchedule[day].length === 0) {
      delete newSchedule[day];
    }
    
    const newAvailability = {
      ...availability,
      schedule: newSchedule
    };
    
    setAvailability(newAvailability);
  };
  
  const handleTimeChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const newSchedule = { ...availability.schedule };
    newSchedule[day][index][field] = value;
    
    const newAvailability = {
      ...availability,
      schedule: newSchedule
    };
    
    setAvailability(newAvailability);
  };
  
  const handleSaveAvailability = () => {
    // Calculate total hours
    let totalHours = 0;
    Object.keys(availability.schedule).forEach(day => {
      availability.schedule[day].forEach(slot => {
        const startHour = parseInt(slot.start.split(':')[0]);
        const startMinute = parseInt(slot.start.split(':')[1]);
        const endHour = parseInt(slot.end.split(':')[0]);
        const endMinute = parseInt(slot.end.split(':')[1]);
        
        const hours = (endHour - startHour) + (endMinute - startMinute) / 60;
        totalHours += hours;
      });
    });
    
    const updatedAvailability = {
      ...availability,
      total_hours: totalHours
    };
    
    onUpdateAvailability?.(updatedAvailability);
    setEditMode(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Schedule
          </h2>
          <button 
            onClick={() => setEditMode(!editMode)}
            className="text-xs bg-white text-indigo-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            {editMode ? 'Cancel' : 'Edit Schedule'}
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Weekly Hours</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {availability.total_hours} hours
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Set your weekly availability to let students know when you're available for sessions.
            </p>
          </div>
          
          <div className="space-y-6">
            {daysOfWeek.map(day => (
              <div key={day} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{day}</h4>
                  {editMode && (
                    <button 
                      onClick={() => handleAddTimeSlot(day)}
                      className="text-xs flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Time Slot
                    </button>
                  )}
                </div>
                
                {availability.schedule[day] && availability.schedule[day].length > 0 ? (
                  <div className="space-y-2">
                    {availability.schedule[day].map((slot, index) => (
                      <div key={index} className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        
                        {editMode ? (
                          <>
                            <select
                              value={slot.start}
                              onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                              className="text-sm border-gray-300 rounded-md mr-2"
                            >
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-gray-500 mx-1">to</span>
                            <select
                              value={slot.end}
                              onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                              className="text-sm border-gray-300 rounded-md mr-2"
                            >
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            
                            <button 
                              onClick={() => handleRemoveTimeSlot(day, index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {slot.start} - {slot.end}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Not available</p>
                )}
              </div>
            ))}
          </div>
          
          {editMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAvailability}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Schedule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
