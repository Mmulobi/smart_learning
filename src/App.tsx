import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { NavBar } from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import { ScheduledSessions } from './components/dashboard/student/ScheduledSessions';

function App() {
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserRole(session?.user?.user_metadata?.role || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserRole(session?.user?.user_metadata?.role || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthRoute = location.pathname.startsWith('/auth');
      const isDashboardRoute = location.pathname.includes('/dashboard');

      if (session) {
        // If logged in and trying to access auth routes, redirect to dashboard
        if (isAuthRoute) {
          navigate(userRole === 'tutor' ? '/dashboard/tutor' : '/dashboard/student');
        }
      } else {
        // If not logged in and trying to access protected routes, redirect to auth
        if (isDashboardRoute) {
          navigate('/auth');
        }
      }
    }
  }, [session, userRole, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if we're on a dashboard page
  const isDashboardPage = location.pathname.includes('/dashboard');

  return (
    <>
      {!isDashboardPage && <NavBar />}
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
