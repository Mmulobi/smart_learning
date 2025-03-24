import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, BookOpen, Lightbulb, Target, Clock, CheckCircle } from 'lucide-react';

export function AIDemo() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('beginner');
  const [showRecommendation, setShowRecommendation] = useState(false);
  // Used in the placeholder animation effect
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const placeholderSubjects = [
    'Python Programming',
    'Calculus',
    'Machine Learning',
    'World History',
    'Organic Chemistry'
  ];

  // Typewriter effect for placeholder
  useEffect(() => {
    let currentPlaceholder = '';
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    const typeWriter = () => {
      const placeholder = placeholderSubjects[currentIndex];
      
      if (isDeleting) {
        currentPlaceholder = placeholder.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 60;
      } else {
        currentPlaceholder = placeholder.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120;
      }

      setTypedText(currentPlaceholder);
      setIsTyping(true);

      if (!isDeleting && charIndex === placeholder.length) {
        // Pause at the end
        isDeleting = true;
        typingSpeed = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholderSubjects.length;
        typingSpeed = 500;
      }

      setTimeout(typeWriter, typingSpeed);
    };

    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRecommendation(false);
    // Simulate AI thinking
    setTimeout(() => {
      setShowRecommendation(true);
      // Start the step animation
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < 3) return prev + 1;
          clearInterval(stepInterval);
          return prev;
        });
      }, 800);
    }, 1500);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-100 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4 bg-indigo-100 px-3 py-1 rounded-full">
            <BrainCircuit className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-800">Powered by AI</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Experience AI-Powered Learning
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Our intelligent assistant analyzes your needs and creates a personalized learning journey just for you
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  What would you like to learn?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder={typedText || "Type a subject..."}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Your current level
                </label>
                <div className="relative">
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Target className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Lightbulb className="h-5 w-5 mr-2" />Get Personalized Plan
              </button>
            </form>
          </div>

          <div className="md:col-span-3">
            {!showRecommendation ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                  <Clock className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
                  <p className="text-gray-600">Enter your learning preferences to get a personalized study plan</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-500 animate-fade-in">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-indigo-100 animate-pulse"></div>
                    <Sparkles className="h-10 w-10 text-indigo-600 relative" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 text-center mb-6">
                  Your Personalized Learning Path
                </h3>
                
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-indigo-700 font-medium">
                    Based on your interest in <span className="font-bold">{subject || "your selected subject"}</span> at a <span className="font-bold">{level}</span> level, we've created a customized learning journey:
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { 
                      title: "Foundation Building", 
                      description: `Interactive ${subject || "subject"} fundamentals course tailored for ${level}s`,
                      icon: <BookOpen className="h-5 w-5 text-white" />,
                      visible: currentStep >= 0
                    },
                    { 
                      title: "Practical Application", 
                      description: `Hands-on projects to build real-world ${subject || "subject"} skills`,
                      icon: <Target className="h-5 w-5 text-white" />,
                      visible: currentStep >= 1
                    },
                    { 
                      title: "Progress Tracking", 
                      description: "Weekly assessments and personalized feedback",
                      icon: <CheckCircle className="h-5 w-5 text-white" />,
                      visible: currentStep >= 2
                    },
                    { 
                      title: "AI-Enhanced Practice", 
                      description: "Adaptive exercises that evolve with your progress",
                      icon: <BrainCircuit className="h-5 w-5 text-white" />,
                      visible: currentStep >= 3
                    }
                  ].map((step, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start space-x-4 transition-all duration-500 ${step.visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
                          {step.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                        <p className="mt-1 text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button 
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                    onClick={() => setShowRecommendation(false)}
                  >
                    Modify Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}