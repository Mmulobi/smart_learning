import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';

export function Auth() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome to Smart Learning
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose how you want to continue
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Student</h2>
              <p className="text-gray-600 text-center mb-8">
                Connect with expert tutors, track your progress, and achieve your academic goals.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/auth/student"
                  className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Continue as Student
                </Link>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Access personalized learning paths and AI-powered study assistance
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Tutor</h2>
              <p className="text-gray-600 text-center mb-8">
                Share your expertise, build your profile, and connect with students worldwide.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/auth/tutor"
                  className="w-full flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Continue as Tutor
                </Link>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Set your own schedule and rates while helping students succeed
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Already have an account? Choose your role above to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
