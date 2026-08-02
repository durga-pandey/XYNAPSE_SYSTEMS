import React from 'react';
import { Cpu, GraduationCap, ChevronRight, MousePointer2 } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="relative min-h-[90vh] w-full bg-[#030712] flex items-center justify-center overflow-hidden pt-40 pb-10">
      
      {/* BACKGROUND ELEMENTS: Futuristic Grids & Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        {/* Simple CSS Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1350px] mx-auto px-6 md:px-10 text-center">
        
        {/* TOP BADGE: Floating Micro-Interaction */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce-slow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
            Global Tech Infrastructure & Education
          </span>
        </div>

        {/* MAIN HEADING: The Big Statement */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
          WE ARCHITECT <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            DIGITAL DESTINIES.
          </span>
        </h1>

        {/* DETAILED DESCRIPTION: Bhara-bhara Text */}
        <p className="max-w-4xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
          Xynapse stands at the intersection of <span className="text-white">Industrial Execution</span> and <span className="text-white">Academic Mastery</span>. 
          As a dual-core powerhouse, we operate as a high-scale technology firm delivering production-ready 
          software architectures to global enterprises, while simultaneously functioning as a premier elite 
          institution. We don't just teach technology; we build it. Our mission is to bridge the massive 
          void between theoretical computer science and the ruthless demands of the modern tech economy.
        </p>

        {/* INTERACTIVE CALL-TO-ACTION BLOCKS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          
          {/* Company Side Button */}
          <button className="group relative px-8 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3">
            <Cpu size={18} className="text-cyan-600" />
            Explore Systems
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Institute Side Button */}
          <button className="group relative px-8 py-5 bg-[#0a0f1d] text-white border border-white/10 font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 hover:bg-white/5 hover:border-purple-500/50 flex items-center gap-3">
            <GraduationCap size={18} className="text-purple-500" />
            Join the Academy
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* MOUSE SCROLL INDICATOR */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-cyan-500 to-transparent" />
          <MousePointer2 size={20} className="animate-bounce" />
        </div>

      </div>

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutHero;