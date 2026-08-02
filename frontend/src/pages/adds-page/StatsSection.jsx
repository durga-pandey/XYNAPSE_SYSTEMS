import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const statsData = [
  {
    value: 50,
    suffix: 'K+',
    title: 'Active Students',
    desc: 'Learning and building across 20+ countries worldwide.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    value: 150,
    suffix: '+',
    title: 'Industrial Projects',
    desc: 'Real-world applications deployed on cloud infrastructures.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    value: 98,
    suffix: '%',
    title: 'Success Rate',
    desc: 'Students who successfully transitioned to high-paying tech roles.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    value: 12,
    suffix: 'M+',
    title: 'Lines of Code',
    desc: 'Commits made by our community in open-source and internal labs.',
    color: 'from-green-500 to-emerald-500',
  },
];

const StatsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* --- Left Side: Big Content (Screen Filler) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Numbers that <span className="text-blue-600">Define</span> Our Impact.
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              We don't just teach coding; we engineer careers. Our metrics reflect the dedication 
              of thousands of students who are currently reshaping the digital landscape of India 
              and beyond. Every number here is a story of a successful transition.
            </p>
            <div className="mt-8 hidden lg:block">
               <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
            </div>
          </motion.div>

          {/* --- Right Side: Stats Grid (The "Tagra" Part) --- */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Background Accent Blur (Unique Factor) */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                <h3 className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {inView ? (
                    <CountUp end={stat.value} duration={3} />
                  ) : '0'}
                  {stat.suffix}
                </h3>
                
                <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">
                  {stat.title}
                </p>
                
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {stat.desc}
                </p>

                {/* Bottom Deco Line */}
                <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${stat.color} transition-all duration-500 rounded-full`} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;