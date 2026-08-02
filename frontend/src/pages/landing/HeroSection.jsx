import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const acronym = [
  { letter: "X", text: "eXcellence" },
  { letter: "Y", text: "Your" },
  { letter: "N", text: "Next-gen" },
  { letter: "A", text: "Analytics" },
  { letter: "P", text: "Platforms" },
  { letter: "S", text: "Solutions" },
  { letter: "E", text: "Engineering" },
];

const HeroSection = () => {
  const bubbleCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((prev) => (prev >= 8 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = bubbleCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let bubbles = [];

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    const initBubbles = () => {
      resizeCanvas();
      bubbles = Array.from({ length: 15 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 15 + Math.random() * 30,
        vx: -0.4 + Math.random() * 0.8,
        vy: -0.4 + Math.random() * 0.8,
      }));
    };

    const drawBubble = (b) => {
      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      gradient.addColorStop(0.5, "rgba(255, 182, 193, 0.4)");
      gradient.addColorStop(1, "rgba(255, 20, 147, 0.02)");

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > canvas.width) b.vx *= -1;
        if (b.y < 0 || b.y > canvas.height) b.vy *= -1;
        drawBubble(b);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    initBubbles();
    animate();
    window.addEventListener("resize", initBubbles);
    return () => {
      window.removeEventListener("resize", initBubbles);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    /* MATCHED: Background #030712 and px-6 md:px-10 to match CareerBanner */
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#030712] overflow-hidden"
    >
      {/* Canvas remains absolute to cover full section */}
      <canvas
        ref={bubbleCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* MATCHED: max-w-[1440px] and mx-auto for perfect alignment with other sections */}
      <div className="relative z-10 w-full max-w-[1350px] mx-auto px-6 md:px-10 py-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8 flex flex-col justify-center">
          <div
            className={`transition-all duration-700 ${visibleCount >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-500 font-bold mb-2">
              Recognition
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Best Coaching Institute <br />
              <span className="text-cyan-500">of the Year</span>
            </h1>
          </div>

          {/* Acronym List */}
          <div className="space-y-4 border-l-2 border-slate-800 pl-6">
            {acronym.map((item, index) => {
              const isVisible = visibleCount >= index + 2;
              return (
                <div
                  key={item.letter}
                  className={`transition-all duration-500 transform ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                >
                  <p className="text-xl md:text-2xl font-bold text-white flex items-center gap-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-white text-black font-black shadow-lg">
                      {item.letter}
                    </span>
                    <span className="text-slate-400 font-medium tracking-wide">
                      {item.text}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div
            className={`flex flex-wrap gap-4 transition-all duration-1000 ${visibleCount >= 8 ? "opacity-100" : "opacity-20"}`}
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              Talk to an expert
            </Link>
            <Link
              to="/more-details"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-slate-700 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
            >
              More Details
            </Link>
          </div>
        </div>

        {/* Right Content: Video Section */}
        <div className="flex items-center justify-center">
          <div className="relative p-1 bg-gradient-to-tr from-cyan-500/50 to-purple-500/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <video
              src="https://res.cloudinary.com/dcll0n88n/video/upload/v1769151409/Untitled_design_4_lsbwf3.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="w-full max-w-md h-[550px] rounded-[2.2rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
