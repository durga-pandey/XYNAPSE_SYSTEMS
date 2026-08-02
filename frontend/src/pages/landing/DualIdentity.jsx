import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  Zap, 
  Layers, 
  Target, 
  Globe, 
  ShieldCheck, 
  Users,
  ArrowUpRight
} from "lucide-react";

const DualIdentity = () => {
  return (
    <section className="relative bg-[#030712] py-32 overflow-hidden">
      {/* Background Decorative Text - Behind Everything */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[20vw] font-black text-white leading-none">IDENTITY</h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
          
          {/* --- LEFT SIDE: THE COMPANY (SYSTEMS) --- */}
          <div className="relative group p-10 md:p-16 bg-[#050a18] hover:bg-[#060d21] transition-all duration-700">
            {/* Image Background Overlay */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-0 group-hover:opacity-10 transition-opacity duration-1000 grayscale mix-blend-screen" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                  <Terminal size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter italic">XYNAPSE SYSTEMS</h3>
                  <p className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.4em]">The Engineering Core</p>
                </div>
              </div>

              <h4 className="text-4xl font-bold text-white leading-tight mb-8">
                Building the Backbones of <span className="text-cyan-400">Next-Gen Enterprises.</span>
              </h4>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Our systems division is a high-octane engineering lab where we architect distributed infrastructures, 
                AI-driven analytics engines, and secure blockchain ecosystems. We don't just solve problems; 
                we eliminate inefficiencies through superior code architecture and cloud-native strategies. 
                From Fortune 500 integrations to disruptive startup MVPs, our production grade standards 
                are non-negotiable.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Globe, label: "Global Deployment", desc: "Edge-computed nodes worldwide" },
                  { icon: ShieldCheck, label: "Military-Grade Security", desc: "Zero-trust architecture protocols" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <item.icon className="text-cyan-400" size={20} />
                    <p className="text-white font-bold text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button className="group flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest border-b border-white/10 pb-2 hover:border-cyan-500 transition-all">
                View Enterprise Solutions <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE INSTITUTE (ACADEMY) --- */}
          <div className="relative group p-10 md:p-16 bg-[#0a0614] hover:bg-[#0f081d] transition-all duration-700 border-t lg:border-t-0 lg:border-l border-white/10">
            {/* Image Background Overlay */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-0 group-hover:opacity-10 transition-opacity duration-1000 grayscale mix-blend-screen" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                  <BookOpen size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter italic">XYNAPSE ACADEMY</h3>
                  <p className="text-purple-500/60 text-[10px] font-black uppercase tracking-[0.4em]">The Elite Think-Tank</p>
                </div>
              </div>

              <h4 className="text-4xl font-bold text-white leading-tight mb-8">
                Training Architects, <br /> <span className="text-purple-400">Not Just Developers.</span>
              </h4>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Traditional education is failing the tech industry. Xynapse Academy was born to disrupt the 
                learning curve by providing students with direct access to industrial environments. 
                Our curriculum is curated by active engineers who build the products of tomorrow. 
                We focus on deep-tier software design, low-level optimizations, and full-stack mastery 
                that standard bootcamps simply cannot offer.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: Zap, label: "Real-Time Sandbox", desc: "Direct access to production code" },
                  { icon: Users, label: "Elite Mentorship", desc: "Guided by senior architects" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <item.icon className="text-purple-400" size={20} />
                    <p className="text-white font-bold text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button className="group flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest border-b border-white/10 pb-2 hover:border-purple-500 transition-all">
                Browse Masterclasses <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Stat Bars (Visual Filler) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-10">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all">
            <h5 className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">98%</h5>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Industry Integration Rate</p>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all">
            <h5 className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">12+</h5>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Active Enterprise Nodes</p>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all">
            <h5 className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">50k+</h5>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Lines of Production Code</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DualIdentity;