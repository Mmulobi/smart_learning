// import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
// import { Canvas } from '@react-three/fiber';
import { Users, BookOpen, Award, Sparkles } from 'lucide-react';
// import { Scene3D } from './Scene3D';

type Stat = {
  value: string;
  label: string;
  icon: JSX.Element;
  color: string;
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth parallax effect
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "50%"]),
    { stiffness: 100, damping: 30 }
  );
  
  // Fade out effect
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [1, 0]),
    { stiffness: 100, damping: 30 }
  );

  // Scale effect for background elements
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [1, 1.2]),
    { stiffness: 100, damping: 30 }
  );

  const stats: Stat[] = [
    { value: "10,000+", label: "Active Students", icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-indigo-600" },
    { value: "500+", label: "Expert Tutors", icon: <Award className="h-5 w-5" />, color: "from-purple-500 to-pink-600" },
    { value: "50+", label: "Subjects", icon: <BookOpen className="h-5 w-5" />, color: "from-amber-500 to-orange-600" },
    { value: "24/7", label: "AI Support", icon: <Sparkles className="h-5 w-5" />, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 overflow-hidden">
      {/* 3D Background with Parallax */}
      {/* Temporarily remove heavy 3D canvas to resolve three/drei version import errors */}
      <motion.div className="absolute inset-0" style={{ scale }} />

      {/* Decorative grid + glows */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-indigo-600/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-purple-600/20 blur-3xl rounded-full"></div>
      </div>

      {/* Main Content with Parallax */}
      <motion.div 
        className="relative z-10 px-6 py-24 md:py-32 lg:py-40 max-w-7xl mx-auto"
        style={{ y, opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left lg:pr-12 mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Smart Learning
              </span>
              <br />
              <span className="mt-2 block text-white">Anytime, Anywhere</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Connect with expert tutors for personalized learning experiences. Track your progress, schedule sessions, and achieve your academic goals with our AI-powered platform.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <a
                href="/auth"
                className="relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
              >
                Get Started
                <span className="inline-block h-2 w-2 rounded-full bg-white/80 animate-pulse"></span>
              </a>
              <a
                href="#tutors"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-[10px] border border-white/15 text-white/90 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Browse Tutors
                <svg className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* Animated Feature Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
              {[
                { icon: "🎓", text: "Personalized Learning Paths" },
                { icon: "🧠", text: "AI-Powered Study Assistant" },
                { icon: "📊", text: "Real-time Progress Tracking" },
                { icon: "🏆", text: "Gamified Learning Experience" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover-smooth hover:bg-white/20"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm text-gray-200">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Grid with Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative h-[400px] md:h-[500px] w-full max-w-lg mx-auto"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden hover-smooth hover:shadow-xl hover:shadow-indigo-500/20 ring-1 ring-white/10"
              >
                <img
                  src="/tutor.jpg"
                  alt="Professional tutor"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs bg-white/10 backdrop-blur-md text-white">Top Rated</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl overflow-hidden hover-smooth hover:shadow-xl hover:shadow-purple-500/20 ring-1 ring-white/10"
              >
                <img
                  src="/student1.jpg"
                  alt="Student learning"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs bg-white/10 backdrop-blur-md text-white">Live Session</div>
              </motion.div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 -right-4 rounded-2xl bg-white/10 backdrop-blur-md px-3 py-2 text-xs text-white border border-white/15 shadow-lg"
            >
              24/7 AI Support
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Banner with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover-smooth hover:bg-white/20 border border-white/10"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center p-4 hover-smooth hover:scale-105"
              >
                <div className={`flex items-center justify-center p-2 rounded-full bg-gradient-to-r ${stat.color} text-white mb-2`}>
                  {stat.icon}
                </div>
                <span className="text-lg md:text-xl font-bold text-white">{stat.value}</span>
                <span className="text-xs md:text-sm text-gray-300">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}