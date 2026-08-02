import {
  Zap,
  Globe,
  Briefcase,
  TrendingUp,
  Database,
  Cloud,
  Brain,
  Code2,
  ArrowRight,
} from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
  colorClass,
  shadowColor,
  isCourse = false,
}) => (
  <div
    className={`group relative p-8 rounded-[2rem] bg-[#0a0f1d]/50 border border-white/5 transition-all duration-500 
    hover:border-${colorClass}/40 hover:shadow-[0_0_50px_-15px_${shadowColor}] hover:-translate-y-2 overflow-hidden backdrop-blur-sm`}
  >
    {/* Icon Wrapper */}
    <div
      className={`mb-5 text-${colorClass} transition-transform duration-500 group-hover:scale-110 inline-block`}
    >
      <Icon size={isCourse ? 40 : 32} strokeWidth={1.5} />
    </div>

    {/* Title Logic: Split and Color */}
    <h3 className="text-xl font-black mb-3 tracking-tight text-white leading-tight">
      {title.split(" ")[0]}{" "}
      <span className={`text-${colorClass}`}>
        {title.split(" ").slice(1).join(" ")}
      </span>
    </h3>

    <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
      {desc}
    </p>

    {/* Decorative Glow */}
    <div
      className={`absolute -right-4 -top-4 w-20 h-20 bg-${colorClass}/10 rounded-full blur-3xl group-hover:bg-${colorClass}/20 transition-all duration-500`}
    ></div>

    {isCourse && (
      <div className="mt-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-white/40 uppercase group-hover:text-white transition-colors">
        Learn More <ArrowRight size={12} />
      </div>
    )}
  </div>
);

const WhyChoose = () => {
  const companyFeatures = [
    {
      icon: Zap,
      title: "Modern Technologies",
      desc: "AI-ML aur Cloud Native frameworks par focus jo industry standards set karte hain.",
      colorClass: "cyan-500",
      shadowColor: "rgba(6,182,212,0.4)",
    },
    {
      icon: Globe,
      title: "Global Approach",
      desc: "International methodologies aur worldwide project standards ka exposure.",
      colorClass: "blue-500",
      shadowColor: "rgba(59,130,246,0.4)",
    },
    {
      icon: Briefcase,
      title: "Industry Projects",
      desc: "Real-world production environments mein production-level bottlenecks solve karna.",
      colorClass: "cyan-500",
      shadowColor: "rgba(6,182,212,0.4)",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      desc: "Elite architectural training aur placement pipelines jo professional journey ko secure karti hai.",
      colorClass: "blue-500",
      shadowColor: "rgba(59,130,246,0.4)",
    },
  ];

  const courseFeatures = [
    {
      icon: Database,
      title: "Data Analytics",
      desc: "Big Data processing, visualization aur statistical modeling seekhen industry experts se.",
      colorClass: "purple-500",
      shadowColor: "rgba(168,85,247,0.4)",
    },
    {
      icon: Cloud,
      title: "Cloud Computing",
      desc: "AWS, Azure aur DevOps mastery. Scalable infrastructure design karna seekhen.",
      colorClass: "pink-500",
      shadowColor: "rgba(236,72,153,0.4)",
    },
    {
      icon: Brain,
      title: "AI/ML Mastery",
      desc: "Neural networks se lekar Deep Learning tak, futuristic algorithms build karna seekhen.",
      colorClass: "purple-500",
      shadowColor: "rgba(168,85,247,0.4)",
    },
    {
      icon: Code2,
      title: "Python Engineering",
      desc: "Backend development aur automation mein Python ki power ka upyog karna seekhen.",
      colorClass: "pink-500",
      shadowColor: "rgba(236,72,153,0.4)",
    },
  ];

  return (
    <section className="relative w-full bg-[#030712] py-32 overflow-hidden">
      {/* Abstract Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1350px] mx-auto px-6 md:px-10">
        {/* --- SECTION 1: XYNAPSE SYSTEMS --- */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            The Company
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-10">
            Xynapse{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Systems
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyFeatures.map((f, idx) => (
              <FeatureCard key={idx} {...f} />
            ))}
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-24" />

        {/* --- SECTION 2: XYNAPSE INSTITUTION --- */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            The Academy
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            Global{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Institution
            </span>
          </h2>
          <p className="text-slate-500 mb-12 max-w-2xl font-medium text-lg">
            Industry-driven curriculum designed to turn students into elite tech
            architects.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseFeatures.map((f, idx) => (
              <FeatureCard key={idx} {...f} isCourse={true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
