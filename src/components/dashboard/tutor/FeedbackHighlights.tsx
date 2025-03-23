import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import type { Review } from '../../../types/database';

interface FeedbackHighlightsProps {
  reviews: Review[];
  darkMode: boolean;
}

export function FeedbackHighlights({ reviews, darkMode }: FeedbackHighlightsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === sortedReviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sortedReviews.length - 1 : prev - 1
    );
  };

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Student Feedback</h2>
        <MessageCircle className="text-indigo-500" size={24} />
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Star className="text-yellow-500" size={32} />
            <span className="text-3xl font-bold">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {reviews.length} reviews
          </p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div
                    className={`${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } rounded-lg p-6 relative`}
                  >
                    <div className="flex items-center space-x-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } shadow-lg`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex justify-center mt-4 space-x-2">
            {sortedReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-indigo-500'
                    : darkMode
                    ? 'bg-gray-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No reviews yet</p>
      )}
    </div>
  );
}
