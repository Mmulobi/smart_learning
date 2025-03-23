import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DatabaseService } from '../../services/database';
import type { StudentProfile, TutorProfile, Session } from '../../types/database';
import { LogOut } from 'lucide-react';
import { TutorList } from './student/TutorList';
import { TutorDetails } from './student/TutorDetails';

export function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/student');
        return;
      }

      // Load student profile
      const profile = await DatabaseService.getStudentProfile(user.id);
      if (!profile) {
        // Create student profile if it doesn't exist
        const newProfile = await DatabaseService.createStudentProfile({
          user_id: user.id,
          name: '',
          email: user.email || '',
          grade_level: '',
          subjects: [],
        });
        setProfile(newProfile);
      } else {
        setProfile(profile);
      }

      // Load tutors
      const tutors = await DatabaseService.getAllTutors();
      setTutors(tutors);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (tutorId: string, session: Partial<Session>): Promise<Session> => {
    if (!profile) throw new Error('No student profile found');

    try {
      const newSession = await DatabaseService.createSession({
        ...session,
        tutor_id: tutorId,
        student_id: profile.id,
      });

      return newSession;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/student');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
            {profile && (
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {profile.name}
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <TutorList
              tutors={tutors}
              onSelectTutor={setSelectedTutor}
              selectedTutorId={selectedTutor?.id}
            />
          </div>
          {selectedTutor && (
            <div>
              <TutorDetails
                tutor={selectedTutor}
                onBookSession={handleBookSession}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
