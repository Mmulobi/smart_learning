import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Star, Clock, GraduationCap } from 'lucide-react';

const tutors = [
  {
    name: "Dr. Sarah Chen",
    subject: "Mathematics",
    rating: 4.9,
    experience: "8 years",
    education: "Ph.D. in Applied Mathematics",
    image: "/tutor.jpg"
  },
  {
    name: "Prof. James Wilson",
    subject: "Computer Science",
    rating: 4.8,
    experience: "6 years",
    education: "M.S. in Computer Science",
    image: "/tutor2.jpg"
  },
  {
    name: "Dr. Emily Rodriguez",
    subject: "Physics",
    rating: 4.9,
    experience: "10 years",
    education: "Ph.D. in Physics",
    image: "/tutor3.jpg"
  },
  {
    name: "Prof. Michael Chang",
    subject: "Chemistry",
    rating: 4.7,
    experience: "5 years",
    education: "M.S. in Chemistry",
    image: "/tutor4.jpg"
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

export function TutorMatch() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 right-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Tutor</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Connect with expert tutors who match your learning style and goals. Our AI-powered matching system ensures you find the perfect fit.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for tutors by subject or name..."
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Tutor Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {tutors.map((tutor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-start p-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{tutor.name}</h3>
                  <p className="text-indigo-400 mb-4">{tutor.subject}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white">{tutor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-indigo-400 mr-1" />
                      <span className="text-gray-300">{tutor.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-gray-300">{tutor.education}</span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
                    Connect with Tutor
                  </button>
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
            View All Tutors
          </button>
        </motion.div>
      </div>
    </section>
  );
}