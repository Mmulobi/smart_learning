import { Hero } from './Hero';
import { Features } from './Features';
import { Stats } from './Stats';
import { AIDemo } from './AIDemo';
import { GameSection } from './GameSection';
import { TutorMatch } from './TutorMatch';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Hero />
      <Features />
      <AIDemo />
      <GameSection />
      <TutorMatch />
      <Stats />
    </div>
  );
}
