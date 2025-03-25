import { useNavigate } from 'react-router-dom';
import { TutorProfile } from '../../../types/database';
import { Users, Star, GraduationCap } from 'lucide-react';

interface TutorRecommendationsProps {
  tutors: TutorProfile[];
}

export function TutorRecommendations({ tutors }: TutorRecommendationsProps) {
  const navigate = useNavigate();
  
  const handleViewProfile = (tutorId: string) => {
    navigate(`/tutors/${tutorId}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Recommended Tutors
        </h2>
      </div>
      
      <div className="p-6">
        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div 
                key={tutor.id} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewProfile(tutor.id)}
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                  {tutor.image_url ? (
                    <img 
                      src={tutor.image_url} 
                      alt={tutor.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {tutor.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium">{tutor.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                  
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    <span>{tutor.subjects.join(', ')}</span>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-600">${tutor.hourly_rate}/hr</span>
                    <button className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tutor recommendations available</p>
            <button 
              onClick={() => navigate('/tutors')}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse All Tutors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
