import { TutorProfile } from '../../../types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Clock, Calendar, BookOpen, MessageCircle, Search, Filter, MapPin, GraduationCap, Briefcase, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TutorProfileModal } from './TutorProfileModal';
import { TutorBooking } from './TutorBooking';
import { useNavigate } from 'react-router-dom';

interface TutorListProps {
  tutors: TutorProfile[];
  onSelectTutor: (tutor: TutorProfile) => void;
  selectedTutorId?: string;
}

const ITEMS_PER_PAGE = 6;

export function TutorFinder({ tutors, onSelectTutor, selectedTutorId }: TutorListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  // Animation variants
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
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  // Filter and sort tutors
  const filteredTutors = tutors
    .filter(tutor => {
      const nameMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const subjectMatch = subjectFilter === '' || tutor.subjects.includes(subjectFilter);
      const priceMatch = tutor.hourly_rate >= priceRange[0] && tutor.hourly_rate <= priceRange[1];
      return nameMatch && subjectMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      } else if (sortBy === 'price') {
        return sortOrder === 'desc' ? b.hourly_rate - a.hourly_rate : a.hourly_rate - b.hourly_rate;
      } else {
        return sortOrder === 'desc' 
          ? (b.total_sessions || 0) - (a.total_sessions || 0)
          : (a.total_sessions || 0) - (b.total_sessions || 0);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique subjects for filter
  const subjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))].sort();

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, subjectFilter, priceRange, sortBy, sortOrder]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex flex-col md:flex-row bg-white rounded-xl p-6 border border-gray-100">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="h-28 w-28 rounded-full bg-gray-200" />
            </div>
            <div className="w-full md:w-3/4 mt-4 md:mt-0">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
              <div className="h-4 w-full bg-gray-200 rounded mt-4" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleViewProfile = (tutor: TutorProfile) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
  };

  const handleBookSession = () => {
    if (selectedTutor) {
      setIsModalOpen(false);
      setShowBooking(true);
    }
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    setSelectedTutor(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-indigo-100">
        {/* Compact Header Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Find a Tutor</h2>
              <p className="text-sm text-gray-500">Browse and connect with expert tutors</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredTutors.length} tutors found
              </span>
            </div>
          </div>
        </div>
        
        {/* Search and Filters Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[300px]">
              <input 
                type="text" 
                placeholder="Search by name, subject, or expertise..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 min-w-[180px]"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 min-w-[180px]"
              >
                <option value="rating">Sort by Rating</option>
                <option value="price">Sort by Price</option>
                <option value="experience">Sort by Experience</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Price Range */}
            <div className="flex-1 min-w-[300px] bg-gray-50 p-3 rounded-xl">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Price Range</span>
                <span className="text-sm font-medium text-indigo-600">${priceRange[0]} - ${priceRange[1]}</span>
              </div>
              <div className="relative h-1.5 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-indigo-600 rounded-full"
                  style={{ 
                    left: `${(priceRange[0] / 1000) * 100}%`,
                    right: `${100 - (priceRange[1] / 1000) * 100}%`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count and Pagination */}
        <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page</span>
            <span className="text-sm font-medium text-indigo-600">{currentPage}</span>
            <span className="text-sm text-gray-600">of</span>
            <span className="text-sm font-medium text-indigo-600">{totalPages}</span>
          </div>
        </div>

        {/* Tutor List */}
        <div className="p-6">
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                paginatedTutors.map((tutor) => (
                  <motion.div
                    key={tutor.id}
                    variants={item}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    layout
                  >
                    <button
                      onClick={() => handleViewProfile(tutor)}
                      className={`w-full text-left p-0 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedTutorId === tutor.id
                          ? 'ring-2 ring-indigo-600 shadow-lg'
                          : 'hover:shadow-md border border-gray-100'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Tutor image/avatar section */}
                        <div className="w-full md:w-1/4 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex items-center justify-center">
                          <div className="relative">
                            <motion.div 
                              className="h-28 w-28 rounded-full bg-white p-1 shadow-lg"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                                <span className="text-2xl font-bold">{tutor.name.charAt(0)}</span>
                              </div>
                            </motion.div>
                            {tutor.rating >= 4.5 && (
                              <motion.div 
                                className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1.5 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Award className="h-4 w-4" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        {/* Tutor info section */}
                        <div className="w-full md:w-3/4 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                              <div className="flex items-center mt-2 mb-3">
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
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {tutor.subjects.map((subject) => (
                                  <motion.span
                                    key={subject}
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    {subject}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
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
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1 text-indigo-400" />
                              <span>{tutor.total_sessions || 0} sessions completed</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-end">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                selectedTutorId === tutor.id 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                              }`}
                            >
                              View Profile
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {filteredTutors.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-medium text-gray-900">No tutors found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tutor Profile Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTutor && (
          <TutorProfileModal
            tutor={selectedTutor}
            onClose={handleCloseModal}
            onBookSession={handleBookSession}
          />
        )}
      </AnimatePresence>

      {/* Tutor Booking Page */}
      <AnimatePresence>
        {showBooking && selectedTutor && (
          <TutorBooking
            tutor={selectedTutor}
            onClose={handleCloseBooking}
          />
        )}
      </AnimatePresence>
    </>
  );
}
