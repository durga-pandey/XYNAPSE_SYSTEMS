import React from 'react';
import { AnimatedReveal } from "./Landing";

const XynapseSection = () => {
  const acronym = [
    { letter: "X", title: "Xenon-Grade Speed", desc: "Ultra-fast execution and processing." },
    { letter: "Y", title: "Yielding Excellence", desc: "Producing top-tier engineering talent." },
    { letter: "N", title: "Neural Networks", desc: "Advanced AI-driven learning paths." },
    { letter: "A", title: "Architectural Mastery", desc: "Building scalable systems from scratch." },
    { letter: "P", title: "Precision Systems", desc: "Detailed engineering with 0% compromise." },
    { letter: "S", title: "Strategic Synthesis", desc: "Merging theory with industry reality." },
    { letter: "E", title: "Evolutionary Tech", desc: "Staying ahead of the tech curve." },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-white dark:bg-[#030712] transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: Heading & Acronym */}
        <div className="space-y-10">
          <AnimatedReveal>
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                The <span className="text-cyan-500">Xynapse</span> <br /> 
                Manifesto
              </h2>
              <p className="max-w-md text-lg text-slate-600 dark:text-slate-400 font-medium border-l-4 border-cyan-500 pl-4">
                We are not just a system; we are the neural connection between raw talent and industry dominance.
              </p>
            </div>
          </AnimatedReveal>

          <div className="space-y-6">
            {acronym.map((item, index) => (
              <AnimatedReveal key={index} delay={index * 100}>
                <div className="group flex items-center gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-cyan-500 transition-all duration-300">
                    <span className="text-2xl font-black text-cyan-500">{item.letter}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Video Player */}
        <AnimatedReveal delay={400} className="relative group">
          {/* Decorative Glow behind video */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
          
          <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-slate-100 dark:border-slate-800/50 shadow-2xl">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover scale-[1.01]"
            >
              <source 
                src="https://res.cloudinary.com/dcll0n88n/video/upload/v1769151409/Untitled_design_4_lsbwf3.mp4" 
                type="video/mp4" 
              />
            </video>

            {/* Overlay Gradient for Video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Label on video */}
          <div className="absolute -bottom-6 -right-6 bg-cyan-500 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl rotate-3">
            Core Systems v1.0
          </div>
        </AnimatedReveal>

      </div>
    </section>
  );
};

export default XynapseSection;