
import { Globe,  Star, ArrowDownRight, MapPin } from "lucide-react";

const AlumniHero = () => {
  return (
    <section className="relative w-full bg-[#030712] flex items-center overflow-hidden pt-[110px] pb-10">
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
          alt="Alumni Success"
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent" />
      </div>
      {/* ANIMATED GRID LINES (Subtle Tech Vibe) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          size: "40px 40px",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-[1350px] mx-auto px-6 md:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT: TEXT HEAVY */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400">
                The Alumni Network: Active in 15+ Countries
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              OUR GRADUATES <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                ARCHITECT THE WORLD.
              </span>
            </h1>

            <p className="max-w-xl text-white text-lg md:text-xl font-medium leading-relaxed">
              Xynapse alumni are more than just developers; they are{" "}
              <span className="text-white italic">Technical Architects</span>{" "}
              engineering high-scale systems at global giants like Google, Meta,
              and NVIDIA. Our legacy is defined by their unprecedented success
              in the modern tech economy.
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white italic tracking-tighter">
                  500+
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Global Architects
                </span>
              </div>
              <div className="w-[1px] h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white italic tracking-tighter">
                  40%
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Avg. Salary Jump
                </span>
              </div>
              <div className="w-[1px] h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white italic tracking-tighter">
                  12+
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Fortune 500 Partners
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: INTERACTIVE FLOATING CARD */}
          <div className="relative hidden lg:block">
            {/* Main Success Card */}
            <div className="relative z-20 p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-700">
              <div className="flex items-start justify-between mb-12">
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-emerald-500/50 p-1">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                    alt="Top Alumni"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="text-right">
                  <div className="flex gap-1 text-emerald-500 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-white font-black text-xs uppercase tracking-widest">
                    Elite Member
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-black text-white tracking-tight uppercase italic">
                  Aryan K.
                </h4>
                <p className="text-white text-sm font-bold leading-relaxed italic">
                  "The rigorous training at Xynapse fundamentally re-engineered
                  my approach to system design. Today, as a Senior
                  Infrastructure Engineer at Amazon, I find myself implementing
                  the exact architectural patterns I mastered during my time
                  here."
                </p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Noida, New Delhi
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-black uppercase tracking-tighter">
                    Class of 2024
                  </div>
                </div>
              </div>

              {/* Decorative Circle behind card */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all" />
            </div>

            {/* Small Secondary Card */}
            <div className="absolute -top-10 -right-4 z-30 p-4 bg-[#0a0f1d] border border-white/10 rounded-2xl flex items-center gap-4 animate-bounce-slow shadow-2xl">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-tighter">
                  Global Placement
                </p>
                <p className="text-slate-500 text-[10px]">
                  Active in Silicon Valley
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SCROLL INDICATOR */}
        <div className="mt-20 flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer group">
          <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
            Scroll to see the legacy
          </span>
          <ArrowDownRight
            size={16}
            className="text-white group-hover:translate-y-1 transition-transform"
          />
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s ease-in-out infinite;
        }
      `}</style>
      Section
    </section>
  );
};

export default AlumniHero;
