import React from 'react';
import { 
  BarChart3, 
  Globe2, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  MoveRight 
} from "lucide-react";

const AlumniStats = () => {
  const metrics = [
    {
      label: "Average CTC Hike",
      value: "180%",
      sub: "Post-Xynapse Transformation",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Global Placements",
      value: "22+",
      sub: "Tier-1 Tech Hubs Worldwide",
      icon: Globe2,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Top Tier Roles",
      value: "94%",
      sub: "Senior & Architect Level Roles",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <section className="relative bg-[#030712] py-32 overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND GRID & GLOW */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full z-0" />

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: CONTENT (5 Cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.8em] mb-4 flex items-center gap-3">
                <PieChart size={14} /> Industrial Metrics
              </h2>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                THE DATA <br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">
                  OF SUCCESS.
                </span>
              </h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                We track every career trajectory meticulously. Xynapse isn't just an institute; it's a 
                high-performance incubator that delivers <span className="text-white">measurable ROI</span> for your career.
              </p>
            </div>

            <button className="group flex items-center gap-4 text-white font-black text-xs uppercase tracking-widest border border-white/10 px-8 py-5 rounded-2xl hover:bg-white hover:text-black transition-all duration-500">
              Download Placement Report <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          {/* RIGHT: DASHBOARD CARDS (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BIG METRIC CARD */}
            <div className="md:col-span-2 p-10 bg-white/[0.03] border border-white/10 rounded-[40px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <TrendingUp size={120} />
               </div>
               <div className="relative z-10">
                  <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Highest CTC Transformation</p>
                  <h4 className="text-7xl font-black text-white italic tracking-tighter mb-4">₹48.5 <span className="text-2xl not-italic text-slate-600">LPA</span></h4>
                  <p className="text-slate-500 font-bold max-w-sm">
                    Achieved by our 2024 Alumni in a Lead Cloud Architect role at a Fortune 500 entity.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                    <MoveRight size={16} /> Verified via LinkedIn
                  </div>
               </div>
            </div>

            {/* SMALLER METRIC CARDS */}
            {metrics.map((m, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] hover:border-white/20 transition-all duration-500">
                <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-6`}>
                  <m.icon size={24} />
                </div>
                <h5 className="text-4xl font-black text-white italic mb-2">{m.value}</h5>
                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{m.label}</p>
                <p className="text-slate-600 text-[10px] font-bold uppercase">{m.sub}</p>
              </div>
            ))}

          </div>

        </div>

        {/* LOGO WALL (Subtle grayscale marquee) */}
        <div className="mt-24 pt-12 border-t border-white">
          <p className="text-center text-white text-[10px] font-black uppercase tracking-[0.5em] mb-12 italic">Where our graduates are leading today</p>
          <div className="flex flex-wrap justify-center text-white gap-x-16 gap-y-10 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
             {["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Adobe"].map(brand => (
               <span key={brand} className="text-2xl font-black text-white tracking-tighter uppercase">{brand}</span>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AlumniStats;