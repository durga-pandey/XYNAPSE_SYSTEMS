import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiCode } from 'react-icons/fi';
import { MdOutlineSecurity } from 'react-icons/md';

// Text animation variants
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Her akshar ke beech ka gap
      delayChildren: 0.3,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

// Floating Icon Variants
const floatingVariants = (delay) => ({
  animate: {
    y: [0, -20, 0], // Upar niche ghumega
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay: delay,
    },
  },
});

const HeroSection = () => {
  const headline = 'Level Up Master Tech.';

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* --- 1. Background UNIQUE Elements --- */}
      {/* Mesh Gradient Blur - Smooth Movement */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-3xl"
      />

      {/* Unique Clip-Path Shape (Light Mode Only subtle hint) */}
      <div className="absolute -top-32 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full opacity-60 blur-2xl" />
      <div className="absolute -bottom-32 -right-40 w-96 h-96 bg-pink-100 dark:bg-pink-900/10 rounded-full opacity-60 blur-2xl" />

      {/* --- 2. Main Content Wrapper --- */}
      <div className="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* --- Left Side: Animated Text --- */}
        <div className="text-center md:text-left">
          {/* Headline - Letter by Letter Animation */}
          <motion.h1
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-6xl font-extrabold tracking-tighter leading-[0.9] text-slate-900 dark:text-white"
          >
            {headline.split('').map((letter, index) => (
              <motion.span key={index} variants={letterVariants} className="inline-block">
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-8 text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto md:mx-0 leading-relaxed"
          >
            Xynapse Academy offers a revolutionary engineering-first curriculum.
            Stop memorizing. Start building industrial-grade applications today.
          </motion.p>

          {/* CTA Buttons - Pulse Effect on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-5 justify-center md:justify-start items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 0px 30px rgba(59, 130, 246, 0.7)", 
              }}
              className="flex items-center gap-3 px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold text-lg rounded-full shadow-lg shadow-blue-500/30 group"
            >
              Start for Free
              <FiArrowRight className="text-xl group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
            
            <button className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200 group">
              View Syllabus
              <span className="block h-0.5 max-w-0 group-hover:max-w-full transition-all duration-500 bg-slate-800 dark:bg-slate-200"></span>
            </button>
          </motion.div>
        </div>

        {/* --- Right Side: Unique Image Mockup + Floating Icons --- */}
        <div className="relative flex justify-center items-center mt-16 md:mt-0">
          
          {/* Main Image - Masked with a Unique Shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8, type: 'spring' }}
            className="relative w-full max-w-lg aspect-square bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-100 dark:border-slate-800"
            // Yeh style tag Unique "Clip Path" add karega
            style={{ 
              clipPath: "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)"
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop" // Random Coding Image
              alt="Developer building tech"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
            />
          </motion.div>

          {/* --- Floating Icons - The "Unique" Factor --- */}
          {/* Icon 1: Code */}
          <motion.div
            variants={floatingVariants(0)}
            animate="animate"
            className="absolute -top-10 -left-10 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <FiCode className="text-4xl text-blue-500" />
          </motion.div>

          {/* Icon 2: Security */}
          <motion.div
            variants={floatingVariants(2)} // 2s delay
            animate="animate"
            className="absolute bottom-10 -right-12 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <MdOutlineSecurity className="text-4xl text-pink-500" />
          </motion.div>
          
          {/* Icon 3: Books */}
          <motion.div
            variants={floatingVariants(1)} // 1s delay
            animate="animate"
            className="absolute -bottom-8 left-20 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <FiBookOpen className="text-4xl text-green-500" />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;