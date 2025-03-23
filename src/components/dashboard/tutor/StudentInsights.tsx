import { useState } from 'react';
import { MessageSquare, Users, X } from 'lucide-react';
import type { Session, StudentProfile } from '../../../types/database';

interface StudentInsight {
  student: StudentProfile;
  sessions: Session[];
  strengths: string[];
  weaknesses: string[];
}

interface StudentInsightsProps {
  insights: StudentInsight[];
  darkMode: boolean;
  onMessageStudent: (studentId: string, message: string) => void;
}

const MESSAGE_TEMPLATES = [
  'How are you progressing with {{subject}}?',
  'Great work on your recent {{subject}} session!',
  'Would you like to schedule another {{subject}} session?',
  'I noticed you might need more practice with {{topic}}. Let\'s work on it together.',
];

export function StudentInsights({ insights, darkMode, onMessageStudent }: StudentInsightsProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (selectedStudent && message.trim()) {
      onMessageStudent(selectedStudent.id, message);
      setSelectedStudent(null);
      setMessage('');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Student Insights</h2>
        <Users className="text-indigo-500" size={24} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map(({ student, sessions, strengths, weaknesses }) => (
          <div
            key={student.id}
            className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } rounded-lg p-4 space-y-3`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{student.full_name}</h3>
              <button
                onClick={() => setSelectedStudent(student)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Sessions: {sessions.length}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Learning Style: {student.learning_style}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Strengths:</h4>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((strength) => (
                    <span
                      key={strength}
                      className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Areas for Improvement:</h4>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.map((weakness) => (
                    <span
                      key={weakness}
                      className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg max-w-lg w-full p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Message {selectedStudent.full_name}</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {MESSAGE_TEMPLATES.map((template) => (
                  <button
                    key={template}
                    onClick={() => setMessage(template)}
                    className={`text-sm px-3 py-1 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {template.length > 30 ? template.slice(0, 30) + '...' : template}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full h-32 p-3 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white border border-gray-300'
                }`}
                placeholder="Type your message..."
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
