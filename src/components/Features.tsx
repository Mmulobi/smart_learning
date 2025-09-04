import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Target, Clock, Users, BarChart3, Shield, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Learning",
    description: "Our advanced AI adapts to your learning style and pace, providing personalized recommendations and feedback.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Goal-Oriented Learning",
    description: "Set clear learning objectives and track your progress with detailed analytics and milestone tracking.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Flexible Scheduling",
    description: "Learn at your own pace with 24/7 access to resources and the ability to schedule sessions at your convenience.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Tutors",
    description: "Connect with experienced tutors who are passionate about teaching and helping you succeed.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Analytics",
    description: "Get detailed insights into your learning journey with comprehensive analytics and performance metrics.",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Platform",
    description: "Your data is protected with enterprise-grade security and privacy measures.",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Interactive Content",
    description: "Engage with dynamic, interactive learning materials that make complex concepts easy to understand.",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Real-time Feedback",
    description: "Receive instant feedback on your work and get personalized suggestions for improvement.",
    color: "from-cyan-500 to-blue-600"
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

export function Features() {
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
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Smart Learning</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the future of education with our cutting-edge features designed to enhance your learning journey.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/10"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 [mask-image:linear-gradient(to_right,transparent,black,transparent)]"></div>
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
            Start Learning Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}