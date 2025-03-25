import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../services/database';
import { TutorProfile } from '../../types/database';
import { Briefcase, GraduationCap, Star, MapPin, Clock } from 'lucide-react';

export function TutorList() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTutors();
  }, []);

  async function fetchTutors() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real tutors from Supabase
      const tutorProfiles = await DatabaseService.getAllTutors();
      
      if (tutorProfiles && tutorProfiles.length > 0) {
        console.log('Fetched tutors from database:', tutorProfiles);
        setTutors(tutorProfiles);
      } else {
        console.log('No tutors found in database');
        setTutors([]);
        setError('No tutors found. Please check back later as we add more tutors to our platform.');
      }
    } catch (error: any) {
      console.error('Error fetching tutors:', error.message);
      setError('Failed to load tutors. Please try again later.');
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter tutors based on search term and subject
  const filteredTutors = tutors.filter(tutor => {
    const nameMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = subjectFilter === '' || tutor.subjects.includes(subjectFilter);
    return nameMatch && subjectMatch;
  });

  // Get unique subjects for filter dropdown
  const subjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))].sort();

  function handleTutorClick(tutorId: string) {
    navigate(`/tutors/${tutorId}`);
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find Your Perfect Tutor
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our selection of qualified tutors and find the perfect match for your learning needs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <div className="relative rounded-md shadow-sm flex-1 max-w-lg">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-4 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm h-12"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tutor Grid */}
        {loading ? (
          <div className="flex justify-center items-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                  onClick={() => handleTutorClick(tutor.id)}
                >
                  <div className="h-48 bg-indigo-100 relative">
                    {tutor.image_url ? (
                      <img
                        src={tutor.image_url}
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
                        <span className="text-4xl font-bold text-white">
                          {tutor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center">
                        <div className="flex items-center bg-yellow-400 rounded-full px-2 py-1">
                          <Star className="h-4 w-4 text-white" />
                          <span className="ml-1 text-sm font-medium text-white">{tutor.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      <span>{tutor.subjects.join(', ')}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{tutor.total_sessions || 0} sessions completed</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Online</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{tutor.availability.total_hours} hours/week</span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-600">${tutor.hourly_rate}/hr</span>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-900">No tutors found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
