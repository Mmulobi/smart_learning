import { Hero } from './Hero';
import { SubjectsShowcase } from './SubjectsShowcase';
import { Features } from './Features';
import { AIDemo } from './AIDemo';
import { TutorMatch } from './TutorMatch';
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />
      
      {/* Main Content */}
      <div className="relative">
        <Hero />
        <SubjectsShowcase />
        <Features />
        <AIDemo />
        <TutorMatch />
      </div>
    </div>
  );
}
