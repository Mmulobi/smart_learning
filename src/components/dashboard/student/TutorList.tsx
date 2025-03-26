import { TutorProfile } from '../../../types/database';
import { motion } from 'framer-motion';
import { Star, Award, Clock, Calendar, BookOpen, MessageCircle } from 'lucide-react';

interface TutorListProps {
  tutors: TutorProfile[];
  onSelectTutor: (tutor: TutorProfile) => void;
  selectedTutorId?: string;
}

export function TutorFinder({ tutors, onSelectTutor, selectedTutorId }: TutorListProps) {
  // Animation variants for staggered list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Mentor</h2>
        <p className="text-indigo-100 text-sm">Connect with expert tutors who can help you excel in your studies</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by subject, name, or expertise..." 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tutors.map((tutor) => (
            <motion.div
              key={tutor.id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <button
                onClick={() => onSelectTutor(tutor)}
                className={`w-full text-left p-0 rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedTutorId === tutor.id
                    ? 'ring-2 ring-indigo-600 shadow-md'
                    : 'hover:shadow-md border border-gray-100'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Tutor image/avatar section */}
                  <div className="w-full md:w-1/4 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                          <span className="text-xl font-bold">{tutor.name.charAt(0)}</span>
                        </div>
                      </div>
                      {tutor.rating >= 4.5 && (
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1 shadow-md">
                          <Award className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tutor info section */}
                  <div className="w-full md:w-3/4 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                        <div className="flex items-center mt-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} 
                                className={`h-4 w-4 ${i < Math.floor(tutor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-600">{tutor.rating}/5</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-sm text-indigo-600 font-medium">${tutor.hourly_rate}/hr</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutor.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tutor.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-indigo-400" />
                        <span>Available 24/7</span>
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
                    
                    <div className="mt-4 flex justify-end">
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTutorId === tutor.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {selectedTutorId === tutor.id ? 'Selected' : 'View Profile'}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
