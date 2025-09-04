import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Code, Calculator, BookOpen, Microscope, Globe, Music, Palette } from 'lucide-react';

const subjects = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Computer Science",
    description: "Learn programming, algorithms, and software development",
    color: "from-blue-500 to-indigo-600",
    image: "/tutor.jpg"
  },
  {
    icon: <Calculator className="w-8 h-8" />,
    title: "Mathematics",
    description: "Master calculus, algebra, and mathematical concepts",
    color: "from-purple-500 to-pink-600",
    image: "/student1.jpg"
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Languages",
    description: "Improve your language skills with native speakers",
    color: "from-amber-500 to-orange-600",
    image: "/tutor2.jpg"
  },
  {
    icon: <Microscope className="w-8 h-8" />,
    title: "Sciences",
    description: "Explore physics, chemistry, and biology",
    color: "from-emerald-500 to-teal-600",
    image: "/student3.jpg"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Social Studies",
    description: "Understand history, geography, and culture",
    color: "from-red-500 to-rose-600",
    image: "/tutor3.jpg"
  },
  {
    icon: <Music className="w-8 h-8" />,
    title: "Music",
    description: "Learn instruments and music theory",
    color: "from-violet-500 to-purple-600",
    image: "/student.jpg"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Art",
    description: "Develop your artistic skills and creativity",
    color: "from-pink-500 to-rose-600",
    image: "/tutor4.jpg"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    description: "Build modern web applications and websites",
    color: "from-cyan-500 to-blue-600",
    image: "/student1.jpg"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function SubjectsShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Subjects</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose from a wide range of subjects taught by expert tutors. Our comprehensive curriculum ensures you get the best learning experience.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {subjects.map((subject, index) => (
                <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/10"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={subject.image}
                  alt={subject.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${subject.color} text-white mb-2`}>
                    {subject.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{subject.title}</h3>
                  <p className="text-sm text-gray-200 mt-1">{subject.description}</p>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 [mask-image:linear-gradient(to_right,transparent,black,transparent)]"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
            View All Subjects
          </button>
        </motion.div>
      </div>
    </section>
  );
}
