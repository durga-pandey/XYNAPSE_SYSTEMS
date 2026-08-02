import { motion } from "framer-motion";
import { Shield, Zap, Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const WelcomePage = () => {
  return (
    <section className="relative min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
      <Header />
      <div className="absolute inset-0 z-0">
        {/* Subtle Moving Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-40"></div>
      </div>

      <div className="relative z-10 text-center px-6 py-[100px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.3em] uppercase mb-8"
        >
          <Shield size={14} className="animate-pulse" />
          System Protocol Active
        </motion.div>

        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-none">
          WELCOME TO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
            THE MATRIX
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-16">
          Architecting high-scale distributed systems and elite engineering
          talent for the next era of global digital infrastructure.
        </p>

        {/* 3. THE TWO MINI CARDS (The Action Hub) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          <div onClick={() => document.getElementById('systems-section')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden text-left cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
              <Zap size={80} />
            </div>
            <p className="text-cyan-500 text-[10px] font-black tracking-widest uppercase mb-2">
              Core Solutions
            </p>
            <h3 className="text-2xl font-black text-white mb-2">
              XYNAPSE SYSTEMS
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Enterprise AI & Cloud Architecture.
            </p>
            <div className="mt-6 h-1 w-12 bg-cyan-500 group-hover:w-full transition-all duration-700"></div>
          </div>

          {/* Card 2: Global Institution */}
          <div onClick={() => document.getElementById('academy-section')?.scrollIntoView({ behavior: 'smooth' })} className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden text-left cursor-pointer">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
              <Globe size={80} />
            </div>
            <p className="text-purple-500 text-[10px] font-black tracking-widest uppercase mb-2">
              Elite Academy
            </p>
            <h3 className="text-2xl font-black text-white mb-2">
              GLOBAL INSTITUTION
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Mastering Full-Stack Architecture.
            </p>
            <div className="mt-6 h-1 w-12 bg-purple-500 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <ChevronDown className="text-white" size={32} />
      </div>

      <style jsx>{`
        @keyframes text-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
};

export default WelcomePage;
