import { StudentProfile } from '../../../types/database';
import { Users, MessageSquare, Calendar } from 'lucide-react';

interface StudentsListProps {
  students: StudentProfile[];
  activeStudentCount: number;
  onMessageStudent: (studentId: string) => void;
}

export function StudentsList({ students, activeStudentCount, onMessageStudent }: StudentsListProps) {
  // Take only the first 5 students to display
  const displayStudents = students.slice(0, 5);
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Students
        </h2>
      </div>
      
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activeStudentCount} active
          </span>
        </div>
        
        {displayStudents.length > 0 ? (
          <div className="space-y-3">
            {displayStudents.map((student) => (
              <div 
                key={student.id} 
                className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.grade_level}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => onMessageStudent(student.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-200">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No students yet</p>
          </div>
        )}
        
        {students.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all students
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
