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
  const [activeTab, setActiveTab] = useState<'profile' | 'booking'>('profile');

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

  // Get image for tutor with proper error handling
  const getTutorImage = () => {
    // Check if tutor has a valid image URL (either http URL or data URL)
    if (tutor.image_url) {
      if (tutor.image_url.startsWith('http') || tutor.image_url.startsWith('data:')) {
        return tutor.image_url;
      }
    }
    // Fallback to local images if no valid URL is provided
    return `/tutor${Math.floor(Math.random() * 5) + 1}.jpg`;
  };
  
  const tutorImage = getTutorImage();

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {/* Tutor Header with Image */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
        <img 
          src={tutorImage} 
          alt={tutor.name} 
          className="absolute bottom-0 right-6 w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transform translate-y-1/2"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-6 text-white">
          <h2 className="text-2xl font-bold">{tutor.name}</h2>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(Math.floor(tutor.rating || 0))].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              {tutor.rating % 1 >= 0.5 && (
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              )}
            </div>
            <span className="ml-1 text-sm">{tutor.rating?.toFixed(1) || 'No ratings'}</span>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b pt-16">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'profile' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-indigo-500'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'booking' 
            ? 'text-indigo-600 border-b-2 border-indigo-600' 
            : 'text-gray-500 hover:text-indigo-500'}`}
        >
          Book Session
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'profile' ? (
          <div className="space-y-6">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{tutor.bio || 'No bio available.'}</p>
            </div>

            {/* Subjects Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {(tutor.subjects || []).map((subject) => (
                  <span key={subject} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
                {(!tutor.subjects || tutor.subjects.length === 0) && (
                  <span className="text-gray-500">No subjects listed</span>
                )}
              </div>
            </div>

            {/* Qualifications Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
              <div className="space-y-2">
                {(tutor.qualifications || []).map((qualification: string) => (
                  <div key={qualification} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{qualification}</span>
                  </div>
                ))}
                {(!tutor.qualifications || tutor.qualifications.length === 0) && (
                  <span className="text-gray-500">No qualifications listed</span>
                )}
              </div>
            </div>

            {/* Rate Section */}
            <div className="bg-indigo-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hourly Rate</h3>
                <p className="text-gray-600">Book a session with this tutor</p>
              </div>
              <div className="text-2xl font-bold text-indigo-600">${tutor.hourly_rate}/hr</div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setActiveTab('booking')}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Book a Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookSession} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Session</h3>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Select Time
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className={`p-4 rounded-lg ${
                  error === 'Session booked successfully!'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Session
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
