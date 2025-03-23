import { useState } from 'react';
import { TutorProfile, Session } from '../../../types/database';
import { Calendar } from 'lucide-react';

interface TutorDetailsProps {
  tutor: TutorProfile;
  onBookSession: (tutorId: string, session: Partial<Session>) => Promise<Session>;
}

export function TutorDetails({ tutor, onBookSession }: TutorDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const startTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();

      await onBookSession(tutor.id, {
        start_time: startTime,
        duration: 60, // 1 hour
        subject: tutor.subjects[0] || '',
        status: 'pending',
        notes: '',
        rating: 0,
        feedback: '',
      });

      setSelectedDate('');
      setSelectedTime('');
      setError('Session booked successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Book a Session</h2>
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900">{tutor.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{tutor.bio}</p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">Rate:</span>
            <span className="ml-1 text-sm font-medium text-indigo-600">${tutor.hourly_rate}/hr</span>
          </div>
        </div>

        <form onSubmit={handleBookSession} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Choose a time</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              className={`p-4 rounded-md ${
                error === 'Session booked successfully!'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Book Session
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
