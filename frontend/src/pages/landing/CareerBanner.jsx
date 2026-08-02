import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Cpu, ArrowRight } from "lucide-react";

const AnimatedText = ({ phrases, align = "left" }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % phrases.length);
      setKey((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <div
      className={`h-64 flex flex-col justify-center ${align === "right" ? "items-end" : "items-start"}`}
    >
      <h2
        className={`text-2xl md:text-5xl font-bold leading-[1.4] md:leading-[1.5] ${
          align === "right" ? "text-right" : "text-left"
        }`}
      >
        {phrases[currentLine].split(" ").map((word, i) => (
          <span
            key={`${key}-${i}`}
            className="inline-block opacity-0 animate-text-reveal bg-gradient-to-r from-white via-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{
              animationDelay: `${i * 150}ms`,
              animationFillMode: "forwards",
            }}
          >
            {word}&nbsp;
          </span>
        ))}
      </h2>
    </div>
  );
};

const CareerBanner = () => {
  const systemPhrases = [
    "Engineering the future with high-scale AI solutions and robust distributed computing.",
    "Cloud native architectures for global enterprises leveraging automated deployment pipelines.",
    "Bypassing limits with optimized system design and high-performance engineering excellence.",
    "Next-gen software focusing on security protocols and decentralized data management.",
    "Scalability meets innovation at Xynapse Systems through advanced machine learning.",
  ];

  const institutionPhrases = [
    "Industry ready training with real-time projects and advanced software architectural patterns.",
    "Master the art of full-stack engineering by building production-ready scalable applications.",
    "Placement assistance that launches your career into top-tier global tech companies.",
    "Learn from architects, gaining hands-on experience in solving real-world production bottlenecks.",
    "Join the elite league of developers by mastering modern cloud-native technologies.",
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden text-white selection:bg-cyan-500/30">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse-scale"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-scale"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Navbar */}

      {/* Main Content - Max Width 1440px */}
      <main className="relative z-10 w-full px-6 md:px-10 py-10 flex flex-col gap-32 max-w-[1400px] mx-auto">
        {/* ROW 1: XYNAPSE SYSTEMS */}
        <div
          id="systems-section"
          className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
        >
          <div className="w-full lg:w-[50%] group">
            <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_80px_-15px_rgba(6,182,212,0.3)]">
              <div className="absolute top-10 right-10 text-cyan-500 animate-float">
                <Cpu size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                Xynapse <span className="text-cyan-500">Systems</span>
                <span className="text-white font-black text-sm mt-2 tracking-tighter hidden sm:block">
                  tECH SOLUTIONS
                  <span className="text-cyan-400 text-3xl leading-[0]">.</span>
                </span>
              </h2>
              <p className="text-gray-400 mb-10 text-lg md:text-xl leading-relaxed font-medium">
                We specialize in building enterprise-grade digital ecosystems.
                From high-scale AI applications and distributed cloud networks
                to robust cybersecurity frameworks, our engineering excellence
                drives the next generation of global digital infrastructure.
              </p>
              <a
                href="https://techsolutions.xynapsesystems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black transition-all hover:bg-cyan-500 hover:text-white transform hover:-translate-y-1 text-base"
              >
                Explore Company{" "}
                <ArrowRight
                  size={20}
                  className="group-hover/btn:translate-x-2 transition-transform"
                />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[50%]">
            <AnimatedText phrases={systemPhrases} align="left" />
          </div>
        </div>

        {/* ROW 2: GLOBAL INSTITUTION */}
        <div
          id="academy-section"
          className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16"
        >
          <div className="w-full lg:w-[50%]">
            <AnimatedText phrases={institutionPhrases} align="right" />
          </div>

          <div className="w-full lg:w-[50%] group">
            <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_80px_-15px_rgba(168,85,247,0.3)]">
              <div
                className="absolute top-10 left-10 text-purple-500 animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <GraduationCap size={48} strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                  Global <span className="text-purple-500">Institution</span>
                </h2>
                <p className="text-gray-400 mb-10 text-lg md:text-xl leading-relaxed font-medium">
                  Empowering the next wave of elite developers. Our academy
                  offers architectural-level training on production-ready
                  stacks, bridging the gap between academic theory and
                  industrial mastery through hands-on system design and global
                  placement support.
                </p>
                <Link
                  to="/more-details"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black transition-all hover:bg-purple-500 hover:text-white transform hover:-translate-y-1 text-base"
                >
                  <ArrowRight
                    size={20}
                    className="rotate-180 group-hover/btn:-translate-x-2 transition-transform"
                  />{" "}
                  <span>Explore Academy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerBanner;
