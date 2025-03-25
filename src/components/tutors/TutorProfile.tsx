import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import { TutorProfile as TutorProfileType, Review } from '../../types/database';
import { Calendar, MapPin, Star, Briefcase, Mail, MessageSquare, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export function TutorProfile() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const [tutor, setTutor] = useState<TutorProfileType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    fetchTutor();
  }, [tutorId]);

  async function fetchTutor() {
    try {
      setLoading(true);
      setError(null);
      
      if (!tutorId) return;
      
      // Fetch tutor from Supabase
      const tutorProfile = await DatabaseService.getTutorProfile(tutorId);
      
      if (tutorProfile) {
        console.log('Fetched tutor from database:', tutorProfile);
        setTutor(tutorProfile);
        
        // Fetch reviews for this tutor
        const tutorReviews = await DatabaseService.getReviewsByTutor(tutorId);
        if (tutorReviews) {
          setReviews(tutorReviews);
        }
      } else {
        setError('Tutor not found. The tutor you are looking for may not exist or has been removed.');
        setTutor(null);
      }
    } catch (error: any) {
      console.error('Error fetching tutor:', error.message);
      setError('Failed to load tutor information. Please try again later.');
      setTutor(null);
    } finally {
      setLoading(false);
    }
  }

  const handleContactClick = () => {
    if (!session) {
      // Redirect to auth page if not logged in
      navigate('/auth/student');
    } else {
      // Handle contact logic if logged in
      console.log('Contact tutor logic');
      // This could navigate to a chat page or open a modal
    }
  };

  const handleBookingClick = () => {
    if (!session) {
      // Redirect to auth page if not logged in
      navigate('/auth/student');
    } else {
      // Handle booking logic if logged in
      console.log('Book session logic');
      navigate(`/book-session/${tutorId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/tutors')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Tutors
          </button>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tutor not found</h2>
          <p className="mt-2 text-gray-600">The tutor you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/tutors')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Tutors
          </button>
        </div>
      </div>
    );
  }

  // Format the availability schedule for display
  const availabilityDisplay = Object.entries(tutor.availability.schedule || {}).map(([day, slots]) => (
    <div key={day} className="mb-2">
      <span className="font-medium">{day}: </span>
      {slots.map((slot, index) => (
        <span key={index} className="ml-1">
          {slot.start} - {slot.end}{index < slots.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  ));

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with background and avatar */}
          <div className="h-60 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                {tutor.image_url ? (
                  <img
                    src={tutor.image_url}
                    alt={tutor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100">
                    <span className="text-3xl font-bold text-indigo-600">
                      {tutor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-8 flex space-x-2">
              <div className="bg-white/90 rounded-full px-3 py-1 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="mt-16 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                <div className="mt-2 flex items-center text-gray-600">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span className="text-lg">{tutor.subjects.join(', ')} Tutor</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-y-2 gap-x-4">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{tutor.total_sessions || 0} sessions completed</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Online</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{tutor.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleContactClick}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact
                </button>
                <button
                  onClick={handleBookingClick}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Session
                </button>
              </div>
            </div>
            
            {/* Price and rating */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-gray-500 text-sm">Hourly Rate</span>
                <span className="text-3xl font-bold text-indigo-600">${tutor.hourly_rate}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-gray-500 text-sm">Rating</span>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-indigo-600 mr-2">{tutor.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(tutor.rating)
                            ? 'text-yellow-500'
                            : i < Math.ceil(tutor.rating)
                            ? 'text-yellow-300'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                <span className="text-gray-500 text-sm">Availability</span>
                <span className="text-3xl font-bold text-indigo-600">{tutor.availability.total_hours} hrs/week</span>
              </div>
            </div>
            
            {/* Bio and details */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {tutor.name}</h2>
                <p className="text-gray-700 whitespace-pre-line">{tutor.bio}</p>
                
                {/* Subjects */}
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                
                {/* Qualifications if available */}
                {tutor.qualifications && tutor.qualifications.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Qualifications</h2>
                    <ul className="list-disc pl-5 text-gray-700">
                      {tutor.qualifications.map((qualification, index) => (
                        <li key={index} className="mb-2">{qualification}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {/* Reviews */}
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Student Reviews</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {review.student_profiles?.name || 'Anonymous Student'}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {format(new Date(review.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
                  <div className="text-gray-700">
                    {availabilityDisplay.length > 0 ? (
                      availabilityDisplay
                    ) : (
                      <p>No specific schedule available.</p>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleBookingClick}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book a Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
