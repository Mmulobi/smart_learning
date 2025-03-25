import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Beaker, Calculator, Music, Globe, Paintbrush, Brain } from 'lucide-react';

interface Subject {
  name: string;
  icon: JSX.Element;
  color: string;
  description: string;
}

export function SubjectsShowcase() {
  const [activeSubject, setActiveSubject] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [orbitRotation, setOrbitRotation] = useState(0);

  const subjects: Subject[] = [
    {
      name: "Mathematics",
      icon: <Calculator className="h-8 w-8" />,
      color: "bg-blue-500",
      description: "From algebra to calculus, master mathematical concepts with interactive problem-solving."
    },
    {
      name: "Computer Science",
      icon: <Code className="h-8 w-8" />,
      color: "bg-purple-500",
      description: "Learn programming, algorithms, and computational thinking through hands-on coding projects."
    },
    {
      name: "Science",
      icon: <Beaker className="h-8 w-8" />,
      color: "bg-green-500",
      description: "Explore physics, chemistry, and biology with virtual experiments and simulations."
    },
    {
      name: "Literature",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-yellow-500",
      description: "Analyze classic and contemporary texts while developing critical reading and writing skills."
    },
    {
      name: "Languages",
      icon: <Globe className="h-8 w-8" />,
      color: "bg-red-500",
      description: "Master new languages with conversation practice, grammar exercises, and cultural insights."
    },
    {
      name: "Music",
      icon: <Music className="h-8 w-8" />,
      color: "bg-pink-500",
      description: "Develop musical skills from theory to performance with personalized instruction."
    },
    {
      name: "Art",
      icon: <Paintbrush className="h-8 w-8" />,
      color: "bg-indigo-500",
      description: "Explore various art forms and techniques while developing your creative expression."
    },
    {
      name: "Psychology",
      icon: <Brain className="h-8 w-8" />,
      color: "bg-teal-500",
      description: "Understand human behavior, cognition, and mental processes through engaging case studies."
    }
  ];

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveSubject(prev => {
        if (prev === null) return 0;
        return (prev + 1) % subjects.length;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoplay, subjects.length]);

  // Orbit rotation animation
  useEffect(() => {
    const orbitInterval = setInterval(() => {
      setOrbitRotation(prev => (prev + 0.5) % 360);
    }, 50);
    
    return () => clearInterval(orbitInterval);
  }, []);

  // Pause autoplay when user interacts
  const handleSubjectClick = (index: number) => {
    setActiveSubject(index);
    setAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Interactive Subjects</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Dive into our diverse range of subjects taught by expert tutors using cutting-edge learning technology
          </p>
        </div>

        {/* 3D Rotating Subject Wheel */}
        <div className="relative h-[600px] mb-16 perspective-1000">
          {/* Central spotlight */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl"></div>
          
          {/* 3D Orbit Container */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] preserve-3d"
            style={{ transform: `rotateY(${orbitRotation}deg)` }}
          >
            {/* Subject Orbit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-2 border-dashed border-gray-200 preserve-3d"></div>
            
            {/* Subjects */}
            {subjects.map((subject, index) => {
              // Calculate position on the 3D orbit
              const angle = (index / subjects.length) * 2 * Math.PI;
              const radius = 225; // Orbit radius
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              
              const isActive = activeSubject === index;
              
              return (
                <motion.div
                  key={subject.name}
                  className="absolute top-1/2 left-1/2 cursor-pointer preserve-3d"
                  style={{ 
                    transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px)`,
                    zIndex: z < 0 ? 0 : 10
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleSubjectClick(index)}
                >
                  <div 
                    className={`flex items-center justify-center w-16 h-16 rounded-full ${subject.color} text-white shadow-lg transform transition-all duration-300`}
                    style={{ 
                      transform: `rotateY(${-orbitRotation}deg)`,
                      opacity: z < 0 ? 0.6 : 1,
                      scale: z < 0 ? 0.8 : 1
                    }}
                  >
                    {subject.icon}
                  </div>
                  {isActive && (
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white rounded-xl shadow-xl p-4 w-64 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      style={{ transform: `translateX(-50%) rotateY(${-orbitRotation}deg)` }}
                    >
                      <h3 className="font-bold text-lg text-gray-900">{subject.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{subject.description}</p>
                      <motion.button
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
            
            {/* Center piece */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl z-20"
              style={{ transform: `translate(-50%, -50%) rotateY(${-orbitRotation}deg)` }}
            >
              <span className="font-bold">Subjects</span>
            </div>
          </div>
        </div>
        
        {/* Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Our platform combines AI-powered learning tools with expert human tutors to create an engaging, interactive experience.
              </p>
              <div className="mt-4 flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-yellow-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * star }}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
                  </motion.svg>
                ))}
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Curriculum</h3>
              <p className="text-gray-600">
                Our AI analyzes your learning style and goals to create a customized curriculum that adapts as you progress.
              </p>
              <div className="mt-4 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <span className="ml-2 text-sm text-gray-600">85%</span>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
