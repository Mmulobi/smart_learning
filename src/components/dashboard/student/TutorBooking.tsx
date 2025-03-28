import { TutorProfile } from '../../../types/database';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, MapPin, GraduationCap, Briefcase, BookOpen, MessageCircle, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface TutorBookingProps {
  tutor: TutorProfile;
  onClose: () => void;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export function TutorBooking({ tutor, onClose }: TutorBookingProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  // Generate time slots based on tutor's availability
  const generateTimeSlots = (date: string) => {
    const slots = Array.from({ length: tutor.availability.total_hours }, (_, i) => {
      const hour = i + 9; // Start from 9 AM
      const time = `${hour.toString().padStart(2, '0')}:00`;
      return {
        date,
        time,
        available: true // Will be updated after fetching existing bookings
      };
    });
    return slots;
  };

  // Fetch available time slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) return;

      setIsLoading(true);
      setBookingError(null);

      try {
        // First, generate all possible time slots
        const allSlots = generateTimeSlots(selectedDate);

        // Then fetch existing bookings
        const { data: existingBookings, error } = await supabase
          .from('bookings')
          .select('time')
          .eq('tutor_id', tutor.id)
          .eq('date', selectedDate)
          .eq('status', 'confirmed');

        if (error) {
          if (error.code === '42P01') {
            // Table doesn't exist - this is expected if the migration hasn't been run
            setBookingError('Booking system is being set up. Please try again in a few minutes.');
            return;
          }
          throw error;
        }

        // Update slots based on existing bookings
        const updatedSlots = allSlots.map(slot => ({
          ...slot,
          available: !existingBookings?.some(booking => booking.time === slot.time)
        }));

        setTimeSlots(updatedSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setBookingError('Failed to load available time slots. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, tutor.id, tutor.availability.total_hours]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Create a new booking
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            tutor_id: tutor.id,
            student_id: user.id,
            date: selectedDate,
            time: selectedTime,
            status: 'pending',
            hourly_rate: tutor.hourly_rate
          }
        ]);

      if (error) throw error;

      // Navigate to the Scheduled Sessions page
      navigate('/dashboard/scheduled-sessions');
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Book a Session</h2>
            <p className="text-gray-500">Schedule a tutoring session with {tutor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Error Message */}
        {bookingError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-red-700">{bookingError}</p>
          </div>
        )}

        {/* Tutor Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {tutor.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1.5">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(tutor.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">{tutor.rating}/5</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-indigo-600 font-medium">${tutor.hourly_rate}/hr</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-indigo-400" />
                  <span>Available {tutor.availability.total_hours} hrs/week</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-indigo-400" />
                  <span>Flexible scheduling</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1 text-indigo-400" />
                  <span>Instant messaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDate === date
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(date).getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
              {isLoading ? (
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedTime === slot.time
                          ? 'bg-indigo-600 text-white'
                          : slot.available
                          ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Book Button */}
          <div className="flex justify-end">
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                selectedDate && selectedTime && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Book Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 