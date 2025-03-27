import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './components/Home';
import { TutorDashboard } from './components/dashboard/TutorDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { CombinedAuth } from './components/auth/CombinedAuth';
import { TutorList } from './components/tutors/TutorList';
import { TutorProfile } from './components/tutors/TutorProfile';

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
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        element: <CombinedAuth />,
      },
      {
        path: 'auth/tutor',
        element: <CombinedAuth />,
      },
      {
        path: 'auth/student',
        element: <CombinedAuth />,
      },
      {
        path: 'dashboard/tutor',
        element: <TutorDashboard />,
      },
      {
        path: 'dashboard/student',
        element: <StudentDashboard />,
      },
      {
        path: 'tutors',
        element: <TutorList />,
      },
      {
        path: 'tutors/:tutorId',
        element: <TutorProfile />,
      },
    ],
  },
]);
