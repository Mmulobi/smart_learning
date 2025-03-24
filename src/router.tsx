import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { TutorDashboard } from './components/dashboard/TutorDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TutorAuth } from './components/auth/TutorAuth';
import { StudentAuth } from './components/auth/StudentAuth';
import { CombinedAuth } from './components/auth/CombinedAuth';

function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/auth',
        element: <CombinedAuth />,
      },
      {
        path: '/auth/tutor',
        element: (
          <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Join as a Tutor
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Start teaching students worldwide
                </p>
                <div className="mt-8">
                  <TutorAuth />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        path: '/auth/student',
        element: (
          <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Start Learning Today
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Connect with expert tutors and begin your learning journey
                </p>
                <div className="mt-8">
                  <StudentAuth />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        path: '/tutor/dashboard',
        element: <TutorDashboard />,
      },
      {
        path: '/student/dashboard',
        element: <StudentDashboard />,
      },
    ],
  },
]);
