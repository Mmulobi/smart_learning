import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function NavBar() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="TutorMatch" />
              <span className="ml-2 text-xl font-bold text-indigo-600">TutorMatch</span>
            </Link>
          </div>
          <div className="flex items-center">
            {!isAuthPage && !isDashboardPage && (
              <>
                <Link
                  to="/auth/student"
                  className="ml-8 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Sign In as Student
                </Link>
                <Link
                  to="/auth/tutor"
                  className="ml-4 inline-flex items-center justify-center rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Sign In as Tutor
                </Link>
              </>
            )}
            {isDashboardPage && (
              <button
                onClick={handleSignOut}
                className="ml-4 inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}