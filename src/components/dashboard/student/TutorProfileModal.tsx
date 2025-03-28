import { motion, AnimatePresence } from 'framer-motion';
import { TutorProfile } from '../../../types/database';
import { Star, Award, Clock, Calendar, BookOpen, MessageCircle, Briefcase, X, GraduationCap, MapPin, Mail } from 'lucide-react';

interface TutorProfileModalProps {
  tutor: TutorProfile | null;
  onClose: () => void;
  onBookSession: () => void;
}

export function TutorProfileModal({ tutor, onClose, onBookSession }: TutorProfileModalProps) {
  if (!tutor) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Tutor Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Avatar and Basic Info */}
              <div className="md:w-1/3">
                <div className="relative">
                  <motion.div 
                    className="h-40 w-40 rounded-full bg-white p-2 shadow-lg mx-auto"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                      <span className="text-4xl font-bold">{tutor.name.charAt(0)}</span>
                    </div>
                  </motion.div>
                  {tutor.rating >= 4.5 && (
                    <motion.div 
                      className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-2 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Award className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center">
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
                  </div>

                  <div className="text-center">
                    <span className="text-3xl font-bold text-indigo-600">${tutor.hourly_rate}</span>
                    <span className="text-gray-500">/hour</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-2 text-indigo-400" />
                      <span>Available {tutor.availability.total_hours} hrs/week</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Briefcase className="h-4 w-4 mr-2 text-indigo-400" />
                      <span>{tutor.total_sessions || 0} sessions completed</span>
                    </div>
                  </div>

                  <button
                    onClick={onBookSession}
                    className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Book a Session
                  </button>
                </div>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tutor.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 whitespace-pre-line">{tutor.bio}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Qualifications</h4>
                    <ul className="space-y-2">
                      {tutor.qualifications?.map((qualification, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4 mr-2 text-indigo-400" />
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Info</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                        {tutor.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Availability</h4>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="space-y-2">
                      {Object.entries(tutor.availability.schedule || {}).map(([day, slots]) => (
                        <div key={day} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-900">{day}</span>
                          <span className="text-gray-600">
                            {slots.map((slot, index) => (
                              <span key={index}>
                                {slot.start} - {slot.end}
                                {index < slots.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 