import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';

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
      const isAuthRoute = location.pathname.startsWith('/auth/');
      const isDashboardRoute = location.pathname.includes('/dashboard');

      if (session) {
        // If logged in and trying to access auth routes, redirect to dashboard
        if (isAuthRoute) {
          navigate(userRole === 'tutor' ? '/dashboard/tutor' : '/dashboard/student');
        }
      } else {
        // If not logged in and trying to access protected routes, redirect to auth
        if (isDashboardRoute) {
          const role = location.pathname.includes('/tutor') ? 'tutor' : 'student';
          navigate(`/auth/${role}`);
        }
      }
    }
  }, [session, userRole, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>
        {location.pathname === '/' ? <Home /> : <Outlet />}
      </main>
    </div>
  );
}

export default App;