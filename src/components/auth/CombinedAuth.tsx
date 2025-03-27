import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { BookOpen, GraduationCap, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export function CombinedAuth() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>(searchParams.get('mode') as 'signin' | 'signup' || 'signin');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signin' || modeParam === 'signup') {
      setMode(modeParam);
    }
  }, [searchParams]);

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
              role: role
            }
          },
        });

        if (error) throw error;

        // Create profile after successful signup
        if (user) {
          if (role === 'student') {
            const { error: profileError } = await supabase
              .from('student_profiles')
              .insert([
                {
                  user_id: user.id,
                  name: email.split('@')[0],
                  email: email,
                  grade_level: 'Not specified',
                  subjects: [],
                }
              ]);
            
            if (profileError) throw profileError;
          } else {
            const { error: profileError } = await supabase
              .from('tutor_profiles')
              .insert([
                {
                  user_id: user.id,
                  name: email.split('@')[0],
                  email: email,
                  bio: 'New tutor',
                  subjects: [],
                  hourly_rate: 0,
                }
              ]);
            
            if (profileError) throw profileError;
          }
        }

        alert('Check your email for the confirmation link!');
      } else {
        // Sign in
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (user) {
          const { data: userData } = await supabase.auth.getUser();
          const userRole = userData?.user?.user_metadata?.role || role;
          
          if (userRole === 'student') {
            navigate('/dashboard/student');
          } else {
            navigate('/dashboard/tutor');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            role: role
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred with social login');
    }
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    setDirection(newMode === 'signup' ? 1 : -1);
    setMode(newMode);
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          {mode === 'signin' ? 'Welcome back!' : 'Create your account'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          {mode === 'signin' 
            ? 'Sign in to continue your learning journey' 
            : 'Join our platform and start learning or teaching'}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl shadow-indigo-50 rounded-2xl sm:px-10">
          {/* Role Selection */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <label className="block text-sm font-medium text-gray-700 mb-4">I want to join as:</label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'student' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100' 
                    : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                }`}
              >
                <BookOpen className={`h-6 w-6 mb-2 ${role === 'student' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Student</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setRole('tutor')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'tutor' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg shadow-purple-100' 
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
              >
                <GraduationCap className={`h-6 w-6 mb-2 ${role === 'tutor' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Tutor</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Social Auth */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="inline-flex justify-center items-center py-2.5 px-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <FaGoogle className="w-5 h-5 text-red-500" />
                <span className="sr-only">Sign in with Google</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSocialAuth('facebook')}
                className="inline-flex justify-center items-center py-2.5 px-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
                <span className="sr-only">Sign in with Facebook</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleSocialAuth('github')}
                className="inline-flex justify-center items-center py-2.5 px-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <FaGithub className="w-5 h-5 text-gray-900" />
                <span className="sr-only">Sign in with GitHub</span>
              </motion.button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </motion.div>

          {/* Auth Form */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.form
              key={mode}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="space-y-6 mt-6"
              onSubmit={handleSubmit}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-red-50 p-4 border border-red-200"
                >
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                    role === 'student' 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800' 
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : mode === 'signin' ? (
                    'Sign in'
                  ) : (
                    'Sign up'
                  )}
                </motion.button>
              </div>
            </motion.form>
          </AnimatePresence>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <button
              type="button"
              onClick={() => handleModeChange(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
