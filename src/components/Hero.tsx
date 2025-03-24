import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

type ImageSlide = {
  src: string;
  alt: string;
  position: 'left' | 'right';
  delay: number;
};

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images: ImageSlide[] = [
    { src: '/tutor.jpg', alt: 'Professional tutor', position: 'right', delay: 5000 },
    { src: '/student1.jpg', alt: 'Student learning', position: 'left', delay: 5000 },
    { src: '/tutor2.jpg', alt: 'Online tutoring', position: 'right', delay: 5000 },
    { src: '/student3.jpg', alt: 'Student success', position: 'left', delay: 5000 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, images[activeIndex].delay);
    return () => clearInterval(interval);
  }, [activeIndex, images]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero content */}
      <div className="relative px-6 py-24 md:py-32 lg:py-40 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        {/* Text content */}
        <div className="lg:w-1/2 text-center lg:text-left lg:pr-12 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Smart Learning</span>
            <br />
            <span className="mt-2 block">Anytime, Anywhere</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Connect with expert tutors for personalized learning experiences. Track your progress, schedule sessions, and achieve your academic goals with our AI-powered platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/auth/student"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start as Student
            </Link>
            <Link
              to="/auth/tutor"
              className="w-full sm:w-auto rounded-full bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-indigo-200"
            >
              Join as Tutor
            </Link>
          </div>
        </div>

        {/* Image carousel */}
        <div className="lg:w-1/2 relative h-[400px] md:h-[500px] w-full max-w-lg mx-auto">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-white">
            {images.map((image, index) => (
              <div 
                key={image.src}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <div className={`transform transition-all duration-1000 delay-300 ${index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <h3 className="text-xl font-bold text-white">{image.alt}</h3>
                    <p className="text-gray-200 mt-2">Experience personalized learning with Smart Learning</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-12 h-12 bg-yellow-400 rounded-full opacity-70 animate-float"></div>
      <div className="absolute bottom-1/3 right-10 w-8 h-8 bg-indigo-400 rounded-full opacity-70 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-pink-400 rounded-full opacity-70 animate-float animation-delay-4000"></div>
    </div>
  );
}