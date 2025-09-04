import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AuthLayout } from './AuthLayout';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

export function TutorAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              role: 'tutor'
            }
          },
        });

        if (error) throw error;

        // Create tutor profile after successful signup
        if (user) {
          const { error: profileError } = await supabase
            .from('tutor_profiles')
            .insert([
              {
                user_id: user.id,
                name: email.split('@')[0], // Temporary name from email
                email: email,
                bio: 'New tutor', // Default bio
                subjects: [], // Empty subjects array
                hourly_rate: 0, // Default hourly rate
              }
            ]);
        
          if (profileError) throw profileError;
        }

        setMode('signin');
      } else {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Update user metadata with role if not set
        if (user && !user.user_metadata?.role) {
          await supabase.auth.updateUser({
            data: { role: 'tutor' }
          });
        }

        // Verify tutor profile exists
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('tutor_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profileError || !profile) {
            throw new Error('Tutor profile not found. Please contact support.');
          }
        }

        navigate('/dashboard/tutor');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/dashboard/tutor',
          queryParams: {
            role: 'tutor',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout
      title={mode === 'signin' ? 'Sign in to your tutor account' : 'Create a tutor account'}
      subtitle={
        mode === 'signin'
          ? "Don't have an account? Sign up as a tutor"
          : 'Already have an account? Sign in'
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            className="inline-flex justify-center items-center py-2.5 px-3 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
            <span className="sr-only">Sign in with Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('facebook')}
            className="inline-flex justify-center items-center py-2.5 px-3 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
            <span className="sr-only">Sign in with Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('github')}
            className="inline-flex justify-center items-center py-2.5 px-3 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaGithub className="w-5 h-5 text-gray-900" />
            <span className="sr-only">Sign in with GitHub</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            {mode === 'signin' && (
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}