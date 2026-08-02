import React from 'react';
import { 
  ArrowRight, 
  Orbit, 
  Sparkles, 
  Zap, 
  Compass,
  MoveUpRight
} from "lucide-react";

const FinalMission = () => {
  return (
    <section className="relative bg-[#030712] py-40 overflow-hidden border-t border-white/5">
      
      {/* UNIQUE BACKGROUND: THE WARP EFFECT */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full animate-ping-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-ping-slower" />
      </div>

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* FLOATING ICON BOX */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
            <div className="relative p-6 bg-white/5 border border-white/10 rounded-full text-white">
              <Orbit size={40} className="animate-spin-slow" />
            </div>
          </div>

          {/* MAIN MESSAGE: HEAVY & BOLD */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-cyan-500 uppercase tracking-[0.8em]">Final Protocol</h2>
            <h3 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
              READY TO <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/10">
                ASCEND?
              </span>
            </h3>
          </div>

          {/* MISSION TEXT: DETAILED & PERSUASIVE */}
          <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Xynapse isn't just a destination; it's a catalyst. Whether you are an enterprise seeking 
            unrivaled <span className="text-white">technical architecture</span> or a visionary student 
            aiming for <span className="text-white">elite engineering mastery</span>, the path starts 
            here. We are building the next generation of the digital world. Join the mission.
          </p>

          {/* UNIQUE DUAL INTERACTIVE CTA */}
          <div className="flex flex-col sm:flex-row gap-8 w-full justify-center pt-8">
            
            {/* Enterprise CTA */}
            <div className="group relative p-px rounded-3xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
               <button className="relative px-10 py-6 bg-[#030712] rounded-[23px] w-full flex items-center justify-between gap-6 hover:bg-transparent transition-colors duration-500">
                  <div className="text-left">
                    <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-1">Corporate</p>
                    <p className="text-white font-black text-lg uppercase">Hire Systems</p>
                  </div>
                  <MoveUpRight size={24} className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>

            {/* Academy CTA */}
            <div className="group relative p-px rounded-3xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 group-hover:scale-110 transition-transform duration-500" />
               <button className="relative px-10 py-6 bg-[#030712] rounded-[23px] w-full flex items-center justify-between gap-6 hover:bg-transparent transition-colors duration-500">
                  <div className="text-left">
                    <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-1">Education</p>
                    <p className="text-white font-black text-lg uppercase">Enroll Now</p>
                  </div>
                  <ArrowRight size={24} className="text-white group-hover:translate-x-2 transition-transform" />
               </button>
            </div>

          </div>

          {/* SYSTEM SPECS (BHARA-BHARA LOOK) */}
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 w-full max-w-5xl">
            {[
              { label: "Uptime", val: "99.99%", icon: Zap },
              { label: "Latency", val: "<20ms", icon: Compass },
              { label: "Support", val: "24/7/365", icon: Sparkles },
              { label: "Community", val: "Elite", icon: Orbit }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group cursor-default">
                <stat.icon size={16} className="text-slate-700 group-hover:text-cyan-500 transition-colors mx-auto lg:mx-0" />
                <p className="text-2xl font-black text-white italic">{stat.val}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.05; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 6s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </section>
  );
};

export default FinalMission;