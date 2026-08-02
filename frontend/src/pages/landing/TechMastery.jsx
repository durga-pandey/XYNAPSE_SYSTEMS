import { AnimatedReveal } from "./Landing";
import {
  Database,
  Code2,
  BrainCircuit,
  Settings,
  Server,
  LayoutTemplate,
  HardDrive,
} from "lucide-react";

const techStack = [
  {
    name: "Data Engineering",
    icon: <Database className="text-blue-500" />,
    desc: "Pipeline & ETL Mastery",
  },
  {
    name: "Python Mastery",
    icon: <Code2 className="text-yellow-500" />,
    desc: "Advanced Scripting",
  },
  {
    name: "AI & Machine Learning",
    icon: <BrainCircuit className="text-purple-500" />,
    desc: "Neural Nets & LLMs",
  },
  {
    name: "DevOps & Cloud",
    icon: <Settings className="text-cyan-500" />,
    desc: "Infra & Automation",
  },
  {
    name: "Backend Development",
    icon: <Server className="text-emerald-500" />,
    desc: "Scalable Systems",
  },
  {
    name: "Frontend Architecture",
    icon: <LayoutTemplate className="text-rose-500" />,
    desc: "Modern UI/UX Design",
  },
  {
    name: "Database Design",
    icon: <HardDrive className="text-orange-500" />,
    desc: "SQL & NoSQL Expert",
  },
];

const sectionCardClasses =
  "rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const TechMastery = () => {
  return (
    <section className={`${sectionCardClasses} mt-5`}>
      <AnimatedReveal className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          Master the <span className="text-cyan-500">Modern Stack</span>
        </h2>
        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
          We don't just teach tools; we build architects. Learn the stack used
          by the top 1% of engineering teams.
        </p>
      </AnimatedReveal>

      {/* Grid: 2 columns on mobile, 3 on tablet, 4 on small laptop, 7 on full desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
        {techStack.map((tech, i) => (
          <AnimatedReveal key={i} delay={i * 100} className="h-full">
            <div className="group relative flex flex-col items-center p-6 h-full text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-xl dark:hover:shadow-cyan-500/10">
              
              {/* Icon Container */}
              <div className="mb-4 p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
                {tech.icon}
              </div>

              {/* Text content wrapped in a div to push spacing */}
              <div className="flex flex-col flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {tech.name}
                </h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 leading-tight">
                  {tech.desc}
                </p>
              </div>
              
              {/* Subtle hover line at bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-cyan-500 transition-all duration-300 group-hover:w-1/2 rounded-full" />
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};

export default TechMastery;