import React from "react";
import {
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Target,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const CareerEvolution = () => {
  const steps = [
    {
      stage: "Step 01",
      title: "The Raw Talent",
      status: "Entry Level Developer",
      desc: "Junior engineers with strong fundamentals but lacking industrial-scale architectural knowledge and high-concurrency experience.",
      icon: Target,
      salary: "$12k - $18k Avg.",
      color: "border-slate-800 text-slate-500",
    },
    {
      stage: "Step 02",
      title: "The Xynapse Forge",
      status: "Intensive Architecture Training",
      desc: "Immersion into low-level systems, distributed computing, and cloud-native orchestration. Real-world stress testing on production-grade stacks.",
      icon: ShieldCheck,
      salary: "Skill Multiplier: 5x",
      color:
        "border-emerald-500/50 text-emerald-400 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    },
    {
      stage: "Step 03",
      title: "The Global Architect",
      status: "Senior Engineer @ Tier-1 Tech",
      desc: "Placement into Fortune 500 companies or high-growth Silicon Valley startups. Leading teams and designing systems for millions of users.",
      icon: Rocket,
      salary: "$85k - $150k+ Avg.",
      color:
        "border-cyan-500/50 text-white bg-cyan-500/10 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    },
  ];

  return (
    <section className="relative bg-[#030712] py-32 overflow-hidden border-t border-white/5">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[25vw] font-black text-white italic tracking-tighter uppercase">
          EVOLVE
        </h2>
      </div>

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-emerald-500 font-black text-xs uppercase tracking-[0.8em] mb-6">
            Career Trajectory
          </h2>
          <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
            THE EVOLUTION OF <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-cyan-500">
              AN ENGINEER.
            </span>
          </h3>
        </div>

        {/* EVOLUTION PATHWAY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block -translate-y-12" />

          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`relative group p-10 rounded-[40px] border transition-all duration-700 hover:-translate-y-4 ${item.color}`}
            >
              {/* Step Badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black border border-white/10 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <item.icon size={28} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
                    {item.stage}
                  </span>
                  {idx < 2 && (
                    <ArrowRight className="text-slate-700 group-hover:translate-x-2 transition-transform lg:hidden md:block" />
                  )}
                </div>

                <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">
                  {item.title}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  {item.status}
                </p>

                <p className="text-slate-500 text-sm font-bold leading-relaxed pt-2">
                  {item.desc}
                </p>

                {/* Performance Metric */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      Market Value
                    </span>
                    <span className="text-lg font-black text-white italic">
                      {item.salary}
                    </span>
                  </div>
                  <TrendingUp
                    size={20}
                    className="text-emerald-500/30 group-hover:text-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Arrow Connector for Desktop */}
              {idx < 2 && (
                <div className="absolute top-1/2 -right-6 -translate-y-12 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-[#030712] border border-white/10 z-20">
                  <ChevronRight
                    size={20}
                    className="text-white animate-pulse"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Insight */}
        <div className="mt-20 p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <p className="text-slate-400 text-sm font-bold leading-tight">
              Average Alumni of Xynapse experience a{" "}
              <span className="text-white">300% increase</span> in technical
              complexity handling within 12 months.
            </p>
          </div>
          <button className="px-8 py-4 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all whitespace-nowrap">
            Analyze Your Growth
          </button>
        </div>
      </div>
    </section>
  );
};

export default CareerEvolution;
