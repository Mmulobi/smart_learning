import { Hero } from './Hero';
import { SubjectsShowcase } from './SubjectsShowcase';
import { Features } from './Features';
import { AIDemo } from './AIDemo';
import { TutorMatch } from './TutorMatch';
import { Testimonials } from './Testimonials';
// import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Footer } from './Footer';

export function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white content-auto">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />
      
      {/* Main Content */}
      <div className="relative gpu">
        <Hero />
        <SubjectsShowcase />
        <Features />
        <AIDemo />
        <Testimonials />
        <TutorMatch />
        <Footer />
      </div>
    </div>
  );
}
