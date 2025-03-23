import { useState } from 'react';
import { Trophy, Star, Award } from 'lucide-react';

export function GameSection() {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleCompleteChallenge = () => {
    setPoints(prev => prev + 100);
    setStreak(prev => prev + 1);
  };

  return (
    <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Learning Made Fun
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Complete challenges, earn points, and climb the leaderboard
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{points} pts</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your Score</h3>
                <p className="mt-2 text-gray-500">Keep learning to earn more points!</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Star className="h-8 w-8 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-900">{streak} days</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Learning Streak</h3>
                <p className="mt-2 text-gray-500">Don't break your streak!</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900">Silver</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Current Rank</h3>
                <p className="mt-2 text-gray-500">Keep going to reach Gold!</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleCompleteChallenge}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Complete Daily Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}