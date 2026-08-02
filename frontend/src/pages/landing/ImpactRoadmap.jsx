import { AnimatedReveal } from "./Landing";
import { CheckCircle2, Star, Target, Zap, Rocket, Award } from "lucide-react";

const roadmapSteps = [
  {
    stage: "Phase 01",
    title: "System Fundamentals",
    desc: "Mastering Linux Kernel, Networking Protocols, and Shell Automation.",
    icon: <Zap className="text-yellow-500" />,
    status: "The Foundation"
  },
  {
    stage: "Phase 02",
    title: "Distributed Architecture",
    desc: "Deep dive into Kubernetes, Service Mesh (Cilium), and Cloud-Native patterns.",
    icon: <Rocket className="text-cyan-500" />,
    status: "The Engineering"
  },
  {
    stage: "Phase 03",
    title: "Production Hardening",
    desc: "Implementing Zero-Trust Security, GitOps pipelines, and SRE practices.",
    icon: <Award className="text-purple-500" />,
    status: "The Mastery"
  }
];

const sectionCardClasses = "rounded-[3rem] border border-slate-200/80 bg-white/90 p-8 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-16 relative overflow-hidden";

const ImpactRoadmap = () => {
  return (
    <section className={`${sectionCardClasses} mt-12 mb-20`}>
      {/* Background Neon Stroke */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* Left Side: Stats & Text */}
        <div className="lg:w-1/3 space-y-8">
          <AnimatedReveal>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Your <span className="text-cyan-500">Path</span> to Mastery
            </h2>
            <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              We don't believe in short-cuts. Our architectural roadmap is designed to transform you into a top-tier engineer.
            </p>
          </AnimatedReveal>

          {/* Impact Metrics Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-500"><Target size={24} /></div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white">100%</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Production Focus</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><Star size={24} /></div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white">Top 1%</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Global Curriculum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Roadmap Vertical Line */}
        <div className="lg:w-2/3 relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent" />

          <div className="space-y-12">
            {roadmapSteps.map((step, i) => (
              <AnimatedReveal key={i} delay={i * 200} className="relative pl-16 md:pl-28">
                {/* Step Circle Indicator */}
                <div className="absolute left-3 md:left-9 top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-cyan-500 z-20 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                
                <div className="group relative p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-black text-cyan-500 uppercase tracking-widest px-3 py-1 bg-cyan-500/10 rounded-full w-fit">
                      {step.stage}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {step.status}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="hidden md:block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 transition-transform group-hover:scale-110">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImpactRoadmap;