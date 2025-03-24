import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, BookOpen, Award, Sparkles } from 'lucide-react';

type ImageSlide = {
  src: string;
  alt: string;
  position: 'left' | 'right';
  delay: number;
};

type Stat = {
  value: string;
  label: string;
  icon: JSX.Element;
  color: string;
};

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const images: ImageSlide[] = [
    { src: '/tutor.jpg', alt: 'Professional tutor', position: 'right', delay: 5000 },
    { src: '/student1.jpg', alt: 'Student learning', position: 'left', delay: 5000 },
    { src: '/tutor2.jpg', alt: 'Online tutoring', position: 'right', delay: 5000 },
    { src: '/student3.jpg', alt: 'Student success', position: 'left', delay: 5000 },
  ];

  const stats: Stat[] = [
    { value: "10,000+", label: "Active Students", icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-indigo-600" },
    { value: "500+", label: "Expert Tutors", icon: <Award className="h-5 w-5" />, color: "from-purple-500 to-pink-600" },
    { value: "50+", label: "Subjects", icon: <BookOpen className="h-5 w-5" />, color: "from-amber-500 to-orange-600" },
    { value: "24/7", label: "AI Support", icon: <Sparkles className="h-5 w-5" />, color: "from-emerald-500 to-teal-600" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, images[activeIndex].delay);
    return () => clearInterval(interval);
  }, [activeIndex, images]);

  useEffect(() => {
    // Show stats banner after a short delay
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Floating statistics banner */}
      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
        <div className="bg-white rounded-xl shadow-2xl p-2 flex space-x-2 md:space-x-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center px-3 py-2 md:px-5 md:py-3">
              <div className={`flex items-center justify-center p-2 rounded-full bg-gradient-to-r ${stat.color} text-white mb-2`}>
                {stat.icon}
              </div>
              <span className="text-lg md:text-xl font-bold">{stat.value}</span>
              <span className="text-xs md:text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="relative px-6 py-24 md:py-32 lg:py-40 max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        {/* Text content */}
        <div className="lg:w-1/2 text-center lg:text-left lg:pr-12 mb-12 lg:mb-0">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-yellow-300 opacity-50 animate-pulse-slow"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Smart Learning</span>
              <br />
              <span className="mt-2 block">Anytime, Anywhere</span>
            </h1>
          </div>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Connect with expert tutors for personalized learning experiences. Track your progress, schedule sessions, and achieve your academic goals with our AI-powered platform.
          </p>
          
          {/* Animated feature highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center space-x-2 opacity-0 animate-float" style={{animationDelay: '0.3s', animationDuration: '0.8s'}}>
              <span className="text-xl">🎓</span>
              <span className="text-sm text-gray-700">Personalized Learning Paths</span>
            </div>
            <div className="flex items-center space-x-2 opacity-0 animate-float" style={{animationDelay: '0.4s', animationDuration: '0.8s'}}>
              <span className="text-xl">🧠</span>
              <span className="text-sm text-gray-700">AI-Powered Study Assistant</span>
            </div>
            <div className="flex items-center space-x-2 opacity-0 animate-float" style={{animationDelay: '0.5s', animationDuration: '0.8s'}}>
              <span className="text-xl">📊</span>
              <span className="text-sm text-gray-700">Real-time Progress Tracking</span>
            </div>
            <div className="flex items-center space-x-2 opacity-0 animate-float" style={{animationDelay: '0.6s', animationDuration: '0.8s'}}>
              <span className="text-xl">🏆</span>
              <span className="text-sm text-gray-700">Gamified Learning Experience</span>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 relative">
            {/* Animated arrow */}
            <div className="absolute -top-12 right-0 sm:right-40 hidden md:block">
              <div className="relative">
                <svg width="60" height="60" viewBox="0 0 60 60" className="animate-bounce">
                  <path d="M30 5 L55 30 L45 30 L45 55 L15 55 L15 30 L5 30 Z" fill="rgba(99, 102, 241, 0.2)" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="2" />
                </svg>
                <div className="absolute top-16 right-0 text-xs text-indigo-600 font-medium whitespace-nowrap">Get Started!</div>
              </div>
            </div>
            
            <Link
              to="/auth"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
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