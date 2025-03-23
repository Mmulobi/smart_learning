import { Book, CheckCircle, Circle } from 'lucide-react';
import type { Milestone } from '../../types/dashboard';

interface LearningPathProps {
  milestones: Milestone[];
  darkMode: boolean;
}

export function LearningPath({ milestones, darkMode }: LearningPathProps) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Learning Path</h2>
        <Book className="text-indigo-500" size={24} />
      </div>
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {index !== milestones.length - 1 && (
              <div
                className={`absolute left-[15px] top-[30px] w-0.5 h-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            )}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {milestone.completed ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Circle className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{milestone.title}</h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {milestone.description}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {milestone.subject}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
