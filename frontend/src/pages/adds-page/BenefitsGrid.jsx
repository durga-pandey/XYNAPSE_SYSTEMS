import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiTarget, FiShield, FiCpu, FiGlobe, FiUsers } from 'react-icons/fi';

const benefits = [
  {
    title: "Industry-Standard Curriculum",
    desc: "Directly mapped with top tech giants' requirements. No fluff, only core engineering.",
    icon: <FiCpu />,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
    color: "blue"
  },
  {
    title: "Live Cloud Labs",
    desc: "Get hands-on experience with real servers. Deploy your apps as you learn.",
    icon: <FiZap />,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop",
    color: "purple"
  },
  {
    title: "Global Certification",
    desc: "Recognized worldwide. Stand out in the crowd with a certificate that actually matters.",
    icon: <FiGlobe />,
    image: "https://images.unsplash.com/photo-1523240715630-971c9e11a8c2?q=80&w=500&auto=format&fit=crop",
    color: "emerald"
  },
  {
    title: "Placement Ecosystem",
    desc: "Our dedicated cell works 24/7 to bridge the gap between you and your dream job.",
    icon: <FiTarget />,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=500&auto=format&fit=crop",
    color: "orange"
  },
  {
    title: "Mentorship by Architects",
    desc: "Learn from people who have built systems for millions of users.",
    icon: <FiUsers />,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
    color: "pink"
  },
  {
    title: "Enterprise Grade Security",
    desc: "Deep dive into DevSecOps and secure coding practices right from day one.",
    icon: <FiShield />,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
    color: "cyan"
  }
];

const BenefitsGrid = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="container mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-600 font-bold tracking-widest uppercase text-sm"
          >
            Why Choose Xynapse?
          </motion.span>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black mt-4 text-slate-900 dark:text-white"
          >
            Built for the <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Next Generation</span> of Engineers.
          </motion.h2>
        </div>

        {/* --- Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15 }}
              className="group relative flex flex-col h-[500px] rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* --- Card Image Container --- */}
              <div className="h-1/2 w-full overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent opacity-60" />
                
                {/* Floating Icon */}
                <div className="absolute bottom-4 right-6 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-slate-100 dark:border-slate-700 text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
              </div>

              {/* --- Card Content --- */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Link/Arrow */}
                <div className="flex items-center gap-2 mt-6 font-bold text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  LEARN MORE <span className="text-lg">→</span>
                </div>
              </div>

              {/* Unique Bottom Glow Border */}
              <div className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BenefitsGrid;