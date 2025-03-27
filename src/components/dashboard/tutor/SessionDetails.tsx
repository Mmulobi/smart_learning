import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Session, StudentProfile } from '../../../types/database';
import { toast } from 'react-hot-toast';
import { JitsiService } from '../../../services/jitsi';
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  FileText,
  ArrowLeft,
  Edit,
  Upload,
  Play,
  X,
  Check,
  Video as VideoIcon,
} from 'lucide-react';
import { format } from 'date-fns';

export const SessionDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showVideoRoom, setShowVideoRoom] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          student_profiles (*),
          tutor_profiles (*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to load session: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No session found with ID: ${sessionId}`);
      }

      if (!data.student_profiles) {
        throw new Error('Student profile not found');
      }

      setSession(data);
      setStudent(data.student_profiles);
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error loading session:', error);
      setError(error instanceof Error ? error.message : 'Failed to load session details');
      toast.error('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async () => {
    try {
      if (!session) return;

      const { data, error } = await JitsiService.createRoom(session.id);
      if (error) throw error;

      if (data) {
        setShowVideoRoom(true);
        toast.success('Lesson started successfully');
      }
    } catch (error) {
      console.error('Error starting lesson:', error);
      toast.error('Failed to start lesson');
    }
  };

  const handleLeaveSession = async () => {
    try {
      if (!session) return;

      const { error } = await supabase
        .from('sessions')
        .update({ status: 'completed' })
        .eq('id', session.id);

      if (error) throw error;

      setShowVideoRoom(false);
      toast.success('Session completed');
      navigate('/tutor/dashboard');
    } catch (error) {
      console.error('Error leaving session:', error);
      toast.error('Failed to complete session');
    }
  };

  const handleReschedule = async () => {
    if (!session || !newDate || !newTime) return;

    try {
      const newStartTime = new Date(`${newDate}T${newTime}`);
      const { error } = await supabase
        .from('sessions')
        .update({
          start_time: newStartTime.toISOString(),
          status: 'scheduled'
        })
        .eq('id', session.id);

      if (error) throw error;
      toast.success('Session rescheduled successfully');
      setIsRescheduling(false);
      setNewDate('');
      setNewTime('');
    } catch (err) {
      console.error('Error rescheduling session:', err);
      toast.error('Failed to reschedule session');
    }
  };

  const handleUploadNotes = async () => {
    if (!session || !notes) return;

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ notes })
        .eq('id', session.id);

      if (error) throw error;
      toast.success('Notes updated successfully');
      setIsUploading(false);
    } catch (err) {
      console.error('Error uploading notes:', err);
      toast.error('Failed to upload notes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !session || !student) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Session not found'}</p>
        </div>
      </div>
    );
  }

  if (showVideoRoom && session.room_id) {
    return (
      <div className="relative w-full h-screen">
        <iframe
          src={JitsiService.getRoomUrl(session.room_id)}
          className="absolute inset-0 w-full h-full border-0"
          allow="camera; microphone; display-capture"
        />
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleLeaveSession}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="relative max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </motion.button>

        {/* Session Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {session.subject}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(session.start_time), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(session.start_time), 'h:mm a')}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {student.name}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              session.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : session.status === 'scheduled'
                ? 'bg-blue-100 text-blue-800'
                : session.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {session.status === 'scheduled' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartLesson}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <VideoIcon className="w-5 h-5 mr-2" />
                Start Lesson
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRescheduling(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-5 h-5 mr-2" />
              Reschedule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploading(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Notes
            </motion.button>
          </div>
        </motion.div>

        {/* Reschedule Modal */}
        {isRescheduling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">Reschedule Session</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsRescheduling(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Upload Notes Modal */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">Upload Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your notes here..."
              />
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">Student Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Grade Level</p>
                  <p className="font-medium">{student.grade_level}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Video className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Subjects</p>
                  <p className="font-medium">{student.subjects.join(', ')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Session Notes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">Session Notes</h2>
            {session.notes ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{session.notes}</p>
              </div>
            ) : (
              <p className="text-gray-500">No notes available for this session.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 