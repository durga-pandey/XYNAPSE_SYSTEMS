import React from 'react';
import { 
  Cloud, 
  Database, 
  Shield, 
  Cpu, 
  Globe, 
  Code2, 
  ExternalLink,
  Activity,
  Terminal
} from "lucide-react";

const TechEcosystem = () => {
  const stackCategories = [
    {
      name: "Cloud Infrastructure",
      techs: ["AWS", "GCP", "Azure", "Kubernetes", "Docker", "Terraform"],
      icon: Cloud,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      name: "Backend Engines",
      techs: ["GoLang", "Rust", "Python", "Node.js", "C++", "Java"],
      icon: Terminal,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      name: "Data Architecture",
      techs: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"],
      icon: Database,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    }
  ];

  return (
    <section className="relative bg-[#030712] py-32 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: CONTENT & FOCUS (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-cyan-500 font-black text-xs uppercase tracking-[0.6em] mb-4 flex items-center gap-3">
                <Activity size={14} className="animate-pulse" /> Our Ecosystem
              </h2>
              <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                THE STACK THAT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
                  POWERS GIANTS.
                </span>
              </h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                At Xynapse, we don't just use tools; we master their internal mechanics. Our ecosystem is built on 
                highly resilient, scalable, and secure technologies that form the backbone of modern digital 
                economies. Whether it's <span className="text-white">Low-Latency Backend Engines</span> or 
                <span className="text-white"> Cloud-Native Orchestration</span>, we architect for the next decade.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cyan-500/50 transition-all cursor-default">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">Enterprise Validated</p>
                  <p className="text-slate-500 text-xs mt-1">Battle-tested in high-concurrency production environments.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-purple-500/50 transition-all cursor-default">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">Native Optimization</p>
                  <p className="text-slate-500 text-xs mt-1">Hardware-level tuning for maximum efficiency and speed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: TECH GRID (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stackCategories.map((cat, i) => (
              <div 
                key={i} 
                className={`p-8 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent group transition-all duration-500 hover:border-white/20 ${i === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                    <cat.icon size={28} strokeWidth={1.5} />
                  </div>
                  <ExternalLink size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                </div>
                
                <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-4 italic">{cat.name}</h4>
                
                <div className="flex flex-wrap gap-2">
                  {cat.techs.map((t) => (
                    <span key={t} className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white group-hover:border-white/20 transition-all">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Special Callout Card */}
            <div className="p-8 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 group hover:bg-white/5 transition-all">
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/20 group-hover:text-cyan-500 group-hover:border-cyan-500/50 transition-all">
                <Code2 size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">And 20+ more niche protocols</p>
            </div>
          </div>

        </div>

        {/* BOTTOM MARQUEE: SCROLLING TEXT */}
        <div className="mt-24 pt-12 border-t border-white/5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-20">
            {[1, 2, 3].map((_n) => (
              <div key={_n} className="flex gap-20 items-center">
                <span className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic hover:text-cyan-500/20 transition-colors cursor-default">Modernization</span>
                <span className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic hover:text-purple-500/20 transition-colors cursor-default">Scalability</span>
                <span className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic hover:text-emerald-500/20 transition-colors cursor-default">Performance</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TechEcosystem;