import { StudentProfile } from '../../../types/database';
import { Users, MessageSquare, Calendar, Search, UserPlus, ChevronRight, MoreHorizontal, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentsListProps {
  students: StudentProfile[];
  activeStudentCount: number;
  onMessageStudent: (studentId: string) => void;
}

export function StudentsList({ students, activeStudentCount, onMessageStudent }: StudentsListProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    // Trigger items animation with a slight delay
    const itemsTimer = setTimeout(() => setAnimateItems(true), 600);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(itemsTimer);
    };
  }, []);
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade_level.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Take only the first 5 students to display
  const displayStudents = searchQuery ? filteredStudents : students.slice(0, 5);
  
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 ease-in-out transform hover:shadow-xl ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 -right-6 w-16 h-16 rounded-full bg-white opacity-20 animate-ping-slow"></div>
          <div className="absolute -bottom-2 left-1/3 w-8 h-8 rounded-full bg-white opacity-10 animate-ping-slow delay-300"></div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Students
          </h2>
          <button className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300">
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Active Students</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {activeStudentCount} active
          </span>
        </div>
        
        {displayStudents.length > 0 ? (
          <div className="space-y-3">
            {displayStudents.map((student, index) => (
              <div 
                key={student.id} 
                className={`flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-blue-50/30 transition-all duration-300 transform ${animateItems ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      {index % 3 === 0 && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500">{student.grade_level}</p>
                      <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300"></span>
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {Math.floor(Math.random() * 10) + 1} sessions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => onMessageStudent(student.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors duration-200">
                    <Calendar className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6">
            <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600">
              <Users className="h-8 w-8" />
            </div>
            <p className="text-gray-500 mb-4">{searchQuery ? 'No students match your search' : 'No students yet'}</p>
            {searchQuery && (
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                onClick={() => setSearchQuery('')}
              >
                <Search className="h-4 w-4 mr-1.5" />
                Clear Search
              </button>
            )}
          </div>
        )}
        
        {students.length > 5 && !searchQuery && (
          <div className="mt-6 text-center">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
              View all students
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
