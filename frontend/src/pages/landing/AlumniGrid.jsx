import { Linkedin, Twitter, ExternalLink, Briefcase, Zap } from "lucide-react";

const AlumniGrid = () => {
  const alumni = [
    {
      name: "Sarah Jenkins",
      role: "Senior SRE @ Google",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      company: "Google",
      description: "Pioneering distributed cloud systems and latency optimization at scale.",
      accent: "from-blue-500/20 to-blue-600/20"
    },
    {
      name: "Marcus Chen",
      role: "Backend Architect @ Meta",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      company: "Meta",
      description: "Redefining high-concurrency data streaming for 3 Billion+ users.",
      accent: "from-cyan-500/20 to-blue-500/20"
    },
    {
      name: "Elena Rodriguez",
      role: "AI Lead @ NVIDIA",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1974&auto=format&fit=crop",
      company: "NVIDIA",
      description: "Optimizing GPU-accelerated deep learning pipelines for autonomous systems.",
      accent: "from-emerald-500/20 to-green-600/20"
    },
    {
      name: "David Varma",
      role: "Core Engineer @ Uber",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      company: "Uber",
      description: "Architecting real-time matching algorithms for global logistics.",
      accent: "from-slate-500/20 to-slate-800/20"
    }
  ];

  return (
    <section className="relative bg-[#030712] py-32 px-6">
      <div className="max-w-[1350px] mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-emerald-500 font-black text-xs uppercase tracking-[0.5em] mb-4">The Wall of Fame</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              FROM THE CLASSROOM <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">TO THE BOARDROOM.</span>
            </h3>
          </div>
          <p className="text-slate-500 font-bold max-w-sm border-l border-emerald-500/30 pl-6 hidden md:block">
            Our alumni network represents the top 1% of engineering talent globally, driving innovation at Fortune 500 companies.
          </p>
        </div>

        {/* INTERACTIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {alumni.map((person, idx) => (
            <div 
              key={idx} 
              className="group relative h-[450px] rounded-[32px] overflow-hidden bg-white/5 border border-white/10 transition-all duration-700 hover:border-emerald-500/40"
            >
              {/* IMAGE LAYER */}
              <img 
                src={person.img} 
                alt={person.name} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              
              {/* GRADIENT OVERLAY */}
              <div className={`absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${person.accent} opacity-0 group-hover:opacity-60 transition-opacity duration-700`} />

              {/* CONTENT LAYER */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{person.company}</span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight italic leading-none">{person.name}</h4>
                  <p className="text-emerald-400/80 text-[10px] font-black uppercase tracking-widest">{person.role}</p>
                  
                  <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {person.description}
                  </p>

                  {/* SOCIALS & ACTION */}
                  <div className="pt-4 flex items-center justify-between border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                    <div className="flex gap-4">
                      <Linkedin size={18} className="text-white hover:text-emerald-400 cursor-pointer transition-colors" />
                      <Twitter size={18} className="text-white hover:text-emerald-400 cursor-pointer transition-colors" />
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-3 py-2 rounded-lg hover:bg-emerald-500 hover:text-black transition-all">
                      Read Story <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* FLOATING STATUS ICON */}
              <div className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                 <Zap size={16} className="text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniGrid;