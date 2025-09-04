import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Smart Learning connected my daughter with an amazing math tutor. Her grades improved within weeks!",
    name: "Aisha M.",
    role: "Parent of Grade 9 Student",
  },
  {
    quote: "The AI assistant helped me understand physics concepts faster than ever.",
    name: "Daniel K.",
    role: "Student, Year 12",
  },
  {
    quote: "As a tutor, the platform makes scheduling and feedback effortless.",
    name: "Prof. Anita R.",
    role: "Tutor, Chemistry",
  },
  {
    quote: "Beautiful interface and real-time progress tracking keeps us informed.",
    name: "Joseph & Mary",
    role: "Parents",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Loved by Students, Parents, and Tutors
          </h2>
        </div>

        <div className="relative">
          <div className="[mask-image:linear-gradient(to_right,transparent,black,transparent)] overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              className="flex gap-6 w-[200%]"
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="flex-1 min-w-[280px] max-w-sm bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-gray-200">“{t.quote}”</p>
                  <div className="mt-4 text-white font-semibold">{t.name}</div>
                  <div className="text-gray-400 text-sm">{t.role}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


