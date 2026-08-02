import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedReveal } from "./Landing";
import { ShieldCheck, Globe, Zap, ArrowRight, BarChart3 } from "lucide-react";

const coreServices = [
  {
    icon: <ShieldCheck className="text-cyan-400" />,
    title: "Enterprise Security",
    desc: "Top-tier data protection.",
  },
  {
    icon: <Zap className="text-yellow-400" />,
    title: "Rapid Deployment",
    desc: "Fast & scalable IT solutions.",
  },
  {
    icon: <Globe className="text-blue-400" />,
    title: "Global Hiring",
    desc: "Best talent for your team.",
  },
];

const CompanyHeroSection = () => {
  const gridCanvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    const drawGrid = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;

      const step = 60;
      const offset = (time * 0.02) % step;

      for (let x = offset; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = offset; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    resize();
    drawGrid(0);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#030712] overflow-hidden py-24"
    >
      <canvas
        ref={gridCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-[1fr_1fr] items-center">
          <AnimatedReveal
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
            variant="left"
          >
            <div className="relative group w-full max-w-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <video
                src="https://res.cloudinary.com/dcll0n88n/video/upload/v1769151409/corporate_tech_bg.mp4"
                autoPlay
                muted
                playsInline
                loop
                className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] object-cover shadow-2xl border border-white/5"
              />

              {/* Floating Success Card */}
              <div className="absolute bottom-6 -right-2 md:-right-6 bg-[#0f172a]/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                      Success Rate
                    </p>
                    <p className="text-2xl font-black text-white">99.9%</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Content: Text - Removed max-w-xl to fill the space */}
          <AnimatedReveal
            className="space-y-10 order-1 lg:order-2"
            variant="right"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-cyan-400 font-black mb-5">
                Enterprise Solutions
              </p>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Innovating The <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                  Digital Future
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
              XYNAPSE SYSTEMS empowers global businesses with cutting-edge
              software engineering, cloud infrastructure, and strategic talent
              acquisition designed to scale at the speed of thought.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {coreServices.map((s, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="mb-4">{s.icon}</div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <a
                href="https://techsolutions.xynapsesystems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white text-black px-10 py-5 text-sm font-black transition-all hover:bg-cyan-500 hover:text-white shadow-xl transform hover:-translate-y-1"
              >
                Partner With Us <ArrowRight size={20} />
              </a>
              <Link
                to="/more-details"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-black text-white transition-all hover:bg-white/10 transform hover:-translate-y-1"
              >
                Our Services
              </Link>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
};

export default CompanyHeroSection;
