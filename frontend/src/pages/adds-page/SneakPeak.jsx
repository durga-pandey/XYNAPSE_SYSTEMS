import React from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiCheckCircle, FiLayers, FiZap } from 'react-icons/fi';

const SneakPeek = () => {
  return (
    <section className="relative py-28 px-6 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- Left Side: MacBook Mockup --- */}
          <motion.div 
            initial={{ opacity: 0, x: -100, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative lg:w-3/5 perspective-1000"
          >
            {/* The MacBook Frame */}
            <div className="relative mx-auto bg-gray-800 rounded-t-[2rem] border-[8px] border-gray-800 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[16/10] w-full max-w-4xl">
              
              {/* Camera Hole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full z-20" />
              
              {/* Inner Screen Content */}
              <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                <motion.img 
                  animate={{ y: ["0%", "-50%", "0%"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop" // Dashboard screenshot jaisi image
                  alt="Platform Sneak Peek"
                  className="w-full object-top"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer">
                    <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="text-white text-7xl opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                        <FiPlayCircle />
                    </motion.div>
                </div>
              </div>
            </div>

            {/* MacBook Bottom Base */}
            <div className="relative mx-auto bg-gray-700 dark:bg-slate-800 h-4 w-[110%] -ml-[5%] rounded-b-xl shadow-xl">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-b-lg" />
            </div>

            {/* --- Floating "Live" Element --- */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 md:right-0 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-30"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 bg-red-500 rounded-full animate-ping" />
                <p className="text-sm font-bold dark:text-white">LIVE SESSION STARTING</p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- Right Side: Description --- */}
          <div className="lg:w-2/5 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Experience the <span className="text-blue-600">Power</span> of Real-Time Learning.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Humne interface ko itna simple banaya hai ki aapka focus sirf "Engineering" par ho, "Navigation" par nahi. Dark mode, interactive code editor, aur real-time collaboration tools sab ek hi jagah.
              </p>

              {/* Feature Points */}
              <ul className="space-y-4 pt-4">
                {[
                  { icon: <FiZap />, text: "Instant Compiler & Runner" },
                  { icon: <FiLayers />, text: "Architecture Visualization Tool" },
                  { icon: <FiCheckCircle />, text: "Automated Project Testing" }
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 text-slate-800 dark:text-slate-200 font-semibold"
                  >
                    <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                      {item.icon}
                    </span>
                    {item.text}
                  </motion.li>
                ))}
              </ul>

              <button className="mt-8 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:shadow-2xl hover:scale-105 transition-all">
                WATCH FULL DEMO
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SneakPeek;