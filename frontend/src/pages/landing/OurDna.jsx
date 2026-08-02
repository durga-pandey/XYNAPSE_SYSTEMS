import React from 'react';
import { 
  Cpu, 
  Layers, 
  Fingerprint, 
  Workflow, 
  Binary, 
  ShieldAlert,
  Infinity,
  Sparkles,
  Zap 
} from "lucide-react";

const OurDna = () => {
  const dnaCards = [
    {
      title: "Performance First",
      desc: "Every line of code is optimized for low-latency and high-throughput. We don't believe in 'good enough'; we believe in peak architecture.",
      icon: Zap,
      size: "md:col-span-2",
      bg: "bg-cyan-500/5",
      border: "hover:border-cyan-500/50",
      accent: "text-cyan-400"
    },
    {
      title: "Core Integrity",
      desc: "Our system's DNA is built on unshakeable reliability and uptime.",
      icon: Fingerprint,
      size: "md:col-span-1",
      bg: "bg-orange-500/5",
      border: "hover:border-orange-500/50",
      accent: "text-orange-400"
    },
    {
      title: "Zero-Trust Security",
      desc: "Security isn't a feature; it's our foundational layer. We implement end-to-end encryption and multi-layered authentication protocols.",
      icon: ShieldAlert,
      size: "md:col-span-1",
      bg: "bg-red-500/5",
      border: "hover:border-red-500/50",
      accent: "text-red-400"
    },
    {
      title: "Multi-Layered Stack",
      desc: "From hardware abstraction to high-level UI, we master the entire vertical stack for seamless integration.",
      icon: Layers,
      size: "md:col-span-1",
      bg: "bg-emerald-500/5",
      border: "hover:border-emerald-500/50",
      accent: "text-emerald-400"
    },
    {
      title: "Hardware Agnostic",
      desc: "Our solutions run everywhere. We optimize for the metal, whether it's ARM, x86, or custom silicon architectures.",
      icon: Cpu,
      size: "md:col-span-1",
      bg: "bg-blue-500/5",
      border: "hover:border-blue-500/50",
      accent: "text-blue-400"
    },
    {
      title: "The Tech Ecosystem",
      desc: "We master the stack we teach. From React/Node to Rust and GoLang, our DNA is encoded with modern industrial standards. Our laboratory is always running production experiments with high-concurrency engines.",
      icon: Binary,
      size: "md:col-span-2",
      bg: "bg-purple-500/5",
      border: "hover:border-purple-500/50",
      accent: "text-purple-400"
    },
    {
      title: "Scalability Architectures",
      desc: "Building for 100 users is easy. Building for 100 million is what we do. Our systems use auto-scaling kubernetes clusters and global CDN nodes.",
      icon: Infinity,
      size: "md:col-span-1",
      bg: "bg-indigo-500/5",
      border: "hover:border-indigo-500/50",
      accent: "text-indigo-400"
    }
  ];

  return (
    <section className="relative bg-[#030712] py-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" />

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-sm font-black text-cyan-500 uppercase tracking-[0.5em] mb-4">Core Philosophy</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            THE XYNAPSE <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 text-stroke">DNA.</span>
          </h3>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dnaCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`group relative p-8 rounded-[32px] border border-white/5 transition-all duration-700 overflow-hidden ${card.size} ${card.bg} ${card.border} hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Animated Corner Background Gradient */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/[0.03] blur-3xl group-hover:bg-white/[0.08] transition-all duration-700 rounded-full" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-black/50 border border-white/10 ${card.accent} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <card.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic">{card.title}</h4>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                    {card.desc}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-current ${card.accent} animate-pulse`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Protocol</span>
                  </div>
                  <Sparkles size={14} className={card.accent} />
                </div>
              </div>

              {/* Hover Bottom Line Reveal */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-transparent via-current to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          ))}

          {/* Special Wide Tech Footer Card */}
          <div className="md:col-span-3 mt-4 p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[40px] overflow-hidden group relative">
             {/* Background Glow */}
             <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  <Workflow size={12} /> Adaptive Engineering
                </div>
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">
                  One Core <span className="text-cyan-500">Unlimited Stacks.</span>
                </h4>
                <p className="text-slate-500 font-bold leading-relaxed">
                  We don't get married to tools; we commit to excellence. Whether it's legacy modernization or greenfield serverless architectures, we deploy the tech that fits the mission.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center max-w-md">
                {["Rust", "GoLang", "React", "AWS", "K8s", "Docker", "Python", "Node", "Redis", "Solidity"].map((tech) => (
                  <span key={tech} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white/50 uppercase tracking-tighter hover:bg-white hover:text-black hover:scale-110 transition-all cursor-pointer">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
        .group:hover .text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.6);
          transition: 0.5s;
        }
      `}</style>
    </section>
  );
};

export default OurDna;