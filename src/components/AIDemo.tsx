import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function AIDemo() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('beginner');
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRecommendation(true);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Experience AI-Powered Learning
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Try our AI learning assistant to get personalized study recommendations
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                What would you like to learn?
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Python Programming, Mathematics, Physics"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Your current level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Personalized Plan
            </button>
          </form>

          {showRecommendation && (
            <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-indigo-900 text-center">
                Your Personalized Learning Path
              </h3>
              <p className="mt-2 text-indigo-700">
                Based on your interest in {subject} at a {level} level, here's your customized learning journey:
              </p>
              <ul className="mt-4 space-y-2 text-indigo-700">
                <li>• Interactive {subject} fundamentals course</li>
                <li>• Hands-on projects tailored to {level} skills</li>
                <li>• Weekly progress assessments</li>
                <li>• AI-powered practice exercises</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}