import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Session } from '../types/database';

export function useLoadDashboardData<T>(
  role: 'tutor' | 'student',
  getProfile: (userId: string) => Promise<T>,
  getSessions: (userId: string) => Promise<Session[]>
) {
  const [profile, setProfile] = useState<T | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate(`/auth/${role}`);
          return;
        }

        // Load profile and sessions in parallel
        const [profileData, sessionsData] = await Promise.all([
          getProfile(user.id),
          getSessions(user.id)
        ]);

        if (!profileData) {
          throw new Error('Failed to load profile data');
        }

        setProfile(profileData);
        setSessions(sessionsData || []);
      } catch (error) {
        console.error(`Error loading ${role} dashboard data:`, error);
        setError(`Failed to load ${role} dashboard data. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, role, getProfile, getSessions]);

  return { profile, sessions, loading, error };
}
