import { BookOpen } from 'lucide-react';

interface EnrolledCoursesProps {
  subjects: string[];
}

export function EnrolledCourses({ subjects }: EnrolledCoursesProps) {
  // Mock data for course progress
  const getRandomProgress = () => Math.floor(Math.random() * 100);
  
  const subjectsWithProgress = subjects.map(subject => ({
    name: subject,
    progress: getRandomProgress(),
    lessonsCompleted: Math.floor(Math.random() * 10),
    totalLessons: 10 + Math.floor(Math.random() * 10)
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Enrolled Courses
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {subjectsWithProgress.length > 0 ? (
          subjectsWithProgress.map((subject, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{subject.name}</h3>
                <span className="text-sm text-gray-500">
                  {subject.lessonsCompleted}/{subject.totalLessons} lessons
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Continue Learning
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">You haven't enrolled in any courses yet</p>
            <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
