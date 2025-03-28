import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Link, Send, Copy, Check } from 'lucide-react';
import { JitsiService } from '../../../services/jitsi';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

interface VideoConferenceProps {
  profile: any;
  students: any[];
}

export const VideoConference: React.FC<VideoConferenceProps> = ({ profile, students }) => {
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const createMeeting = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }

    try {
      // Create a new session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([
          {
            tutor_id: profile.id,
            student_id: selectedStudent,
            status: 'scheduled',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create Jitsi room
      const { data: roomData, error: roomError } = await JitsiService.createRoom(session.id);
      if (roomError) throw roomError;
      if (!roomData) throw new Error('Failed to create room');

      const roomUrl = JitsiService.getRoomUrl(roomData.room_id);
      setMeetingLink(roomUrl);
      toast.success('Meeting created successfully!');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    }
  };

  const copyToClipboard = async () => {
    if (meetingLink) {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendToStudent = async () => {
    if (!selectedStudent || !meetingLink) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedStudent,
            type: 'meeting_invite',
            content: `You have been invited to a video meeting by ${profile.full_name}`,
            metadata: { meeting_link: meetingLink }
          }
        ]);

      if (error) throw error;
      toast.success('Meeting link sent to student!');
    } catch (error) {
      console.error('Error sending meeting link:', error);
      toast.error('Failed to send meeting link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Video Conference</h2>
      
      <div className="space-y-6">
        {/* Student Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Student
          </label>
          <select
            value={selectedStudent || ''}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create Meeting Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createMeeting}
          disabled={!selectedStudent}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="w-5 h-5" />
          <span>Start Video Call</span>
        </motion.button>

        {/* Meeting Link Section */}
        <AnimatePresence>
          {meetingLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Link className="w-4 h-4" />
                  <span>Meeting Link</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={meetingLink}
                    readOnly
                    className="flex-1 p-2 border rounded-lg bg-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Send to Student Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendToStudent}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Meeting Link</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 