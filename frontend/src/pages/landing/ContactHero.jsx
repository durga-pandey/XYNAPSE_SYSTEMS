import React from 'react';
import { Terminal, Cpu, Radio, Activity } from "lucide-react";

const ContactHero = () => {
  return (
    <section className="relative min-h-[70vh] w-full bg-[#030712] flex items-center overflow-hidden pt-32 pb-20">
      
      {/* BINARY BACKGROUND EFFECT (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none flex flex-wrap gap-4 p-4 font-mono text-xs text-white leading-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i}>01011010 11001010 00110011 11110000 10101010 01010101 11111111</span>
        ))}
      </div>

      {/* RADIAL GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full z-0 animate-pulse" />

      <div className="max-w-[1350px] mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: MAIN TITLES (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Radio size={16} className="text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-blue-400">
                Connection Status: Established
              </span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase">
              ESTABLISH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white/80 to-blue-900 italic">
                A DIRECT UPLINK.
              </span>
            </h1>

            <p className="max-w-xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Don't just send a message. Initiate a protocol. Whether you're architecting a 
              <span className="text-white italic"> Digital Enterprise</span> or launching your 
              <span className="text-white italic"> Engineering Career</span>, our core team is on standby.
            </p>

            <div className="flex items-center gap-6 pt-6">
               <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-slate-800 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Support" />
                    </div>
                  ))}
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                  Core Architects <br /> <span className="text-blue-500">Currently Active</span>
               </p>
            </div>
          </div>

          {/* RIGHT: SYSTEM METADATA BOX (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-md relative group overflow-hidden">
              
              {/* Corner Trace Animation */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-blue-500/30 rounded-tr-[40px]" />
              
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                         <Terminal size={18} />
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-widest italic">System Meta</span>
                   </div>
                   <Activity size={18} className="text-slate-700" />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-blue-500/30 transition-colors">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Response Latency</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">{"<"} 120ms</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-blue-500/30 transition-colors">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime Protocol</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">99.9% LIVE</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-blue-500/30 transition-colors">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Nodes</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">GLOBAL REDIRECT</span>
                   </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-blue-500/60 uppercase tracking-widest animate-pulse">
                   <Cpu size={14} /> Encrypted Communication Channel Active
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM DECORATIVE ELEMENT */}
        <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 bg-[#030712] text-[10px] font-black text-slate-700 uppercase tracking-[0.6em]">
              Scanning Infrastructure
           </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;