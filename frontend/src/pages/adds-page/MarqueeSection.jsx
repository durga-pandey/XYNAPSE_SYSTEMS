import React from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaAmazon, FaMicrosoft, FaApple, FaFacebook } from 'react-icons/fa';
import { RiDoubleQuotesL } from 'react-icons/ri';

const logos = [
  { icon: <FaGoogle />, name: "Google" },
  { icon: <FaAmazon />, name: "Amazon" },
  { icon: <FaMicrosoft />, name: "Microsoft" },
  { icon: <FaApple />, name: "Apple" },
  { icon: <FaFacebook />, name: "Meta" },
];

const reviews = [
  { name: "Rahul Sharma", role: "SDE at Google", text: "Xynapse's cloud labs are a game changer. I built my first scalable app here.", img: "https://i.pravatar.cc/150?u=rahul" },
  { name: "Priya Das", role: "Product Manager", text: "The curriculum is so updated. It's not just coding; it's about engineering mindset.", img: "https://i.pravatar.cc/150?u=priya" },
  { name: "Ankit Verma", role: "DevOps Lead", text: "Best decision for my career. The mentors actually come from top tech giants.", img: "https://i.pravatar.cc/150?u=ankit" },
  { name: "Sneha Kapoor", role: "Frontend Dev", text: "The UI/UX modules are world-class. Loved the hands-on approach.", img: "https://i.pravatar.cc/150?u=sneha" },
];

const MarqueeSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
      
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          Trusted by <span className="text-blue-600">Global Pioneers.</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
          Our alumni work at the world's most innovative companies.
        </p>
      </div>

      {/* --- Row 1: Logo Marquee (Right to Left) --- */}
      <div className="relative flex overflow-x-hidden group mb-12">
        <div className="flex animate-marquee whitespace-nowrap py-8 items-center">
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="mx-12 flex items-center gap-3 text-4xl text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer grayscale hover:grayscale-0">
              {logo.icon} <span className="text-xl font-bold uppercase tracking-widest">{logo.name}</span>
            </div>
          ))}
        </div>
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
      </div>

      {/* --- Row 2: Reviews Marquee (Left to Right) --- */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee-reverse whitespace-nowrap py-10">
          {[...reviews, ...reviews].map((review, index) => (
            <div 
              key={index} 
              className="mx-6 w-[350px] p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:scale-105 transition-transform duration-300"
            >
              <RiDoubleQuotesL className="text-4xl text-blue-500/20 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 italic whitespace-normal leading-relaxed">
                "{review.text}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold">{review.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
      </div>

      {/* CSS For Animations (Add this in your Tailwind Config or global CSS) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default MarqueeSection;