import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiArrowRight, FiZap } from 'react-icons/fi';

const faqs = [
  {
    question: "Is this course suitable for beginners?",
    answer: "Absolutely! We start from zero and take you all the way to industrial-grade engineering. All you need is a bit of passion and the willingness to put in the work."
  },
  {
    question: "How does the placement process work?",
    answer: "Our dedicated placement cell provides you with mock interviews, resume building workshops, and direct access to hiring portals of top tech giants."
  },
  {
    question: "What is the refund policy?",
    answer: "We are 100% confident in our content. However, if you're not satisfied within 14 days, we offer a no-questions-asked refund."
  },
  {
    question: "What are the timings for working professionals?",
    answer: "All classes are available as recordings, and our live doubt-clearing sessions are held on weekends to ensure your work schedule isn't disrupted."
  }
];

const FinalSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        
        {/* --- PART 1: URGENT CTA BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-slate-900 dark:bg-blue-600 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl mb-24"
        >
          {/* Background Animated Glow */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent blur-3xl"
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Don't Miss the <br /> <span className="text-blue-400 dark:text-blue-200">Next Cohort.</span>
              </h2>
              <p className="mt-6 text-slate-300 dark:text-blue-100 text-lg">
                Limited seats available for the 2026 Batch. <br /> Enroll now and get early-bird bonuses worth $299.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 dark:text-blue-600 px-10 py-5 rounded-full font-black text-xl shadow-xl flex items-center gap-3 group"
              >
                SECURE MY SEAT <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <FiZap className="text-yellow-400 animate-pulse" /> 12 people looking at this right now
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- PART 2: FAQ ACCORDION --- */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
              Still Have <span className="text-blue-600 underline decoration-wavy">Questions?</span>
            </h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400">Everything you need to know before you start.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
              >
                <button 
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full transition-all ${activeIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {activeIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FinalSection;