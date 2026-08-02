import { useState, useRef, useEffect } from "react";
import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-10";

const hiringLogos = [
  { name: "Google", icon: "google", color: "#4285F4" },
  { name: "Microsoft", icon: "microsoft", color: "#5E5E5E" },
  { name: "Apple", icon: "apple", color: "#000000" },
  { name: "Deloitte", icon: "deloitte", color: "#86BC25" },
  { name: "Infosys", icon: "infosys", color: "#007CC3" },
  { name: "Salesforce", icon: "salesforce", color: "#00A1E0" },
  { name: "Amazon", icon: "amazon", color: "#FF9900" },
  { name: "TCS", icon: "tata", color: "#486AAE" },
  { name: "Accenture", icon: "accenture", color: "#A100FF" },
  { name: "Oracle", icon: "oracle", color: "#F80000" },
  { name: "Adobe", icon: "adobe", color: "#FF0000" },
  { name: "IBM", icon: "ibm", color: "#1261FE" },
];

const HiringPartner = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const targetNumber = 750;

  useEffect(() => {
    let observer;
    let interval;

    const animateCounter = () => {
      let current = 0;
      const increment = Math.ceil(targetNumber / 100);
      interval = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          current = targetNumber;
          clearInterval(interval);
        }
        setCount(current);
      }, 10);
    };

    if (ref.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animateCounter();
            observer.unobserve(ref.current);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (observer && ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section className={`${sectionCardClasses} space-y-6`}>
      <AnimatedReveal className="space-y-3 text-center">
        <h2
          ref={ref}
          className="text-3xl font-semibold text-slate-900 dark:text-white"
        >
          {count}+
          <span className="ml-1 text-base font-medium text-gray-500">
            Hiring Partners
          </span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Get ready to grab your dream job! Join the talent pool with access
          to the world’s best hiring companies.
        </p>
      </AnimatedReveal>

      <style>{`
        .marquee { overflow: hidden; }
        .marquee-track { display: flex; gap: 32px; align-items: center; }
        .marquee-item {
          flex: 0 0 auto;
          width: 90px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo {
          width: 100%;
          height: 100%;
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }
        .scroll-left { animation: scroll-left 28s linear infinite; }
        .scroll-right { animation: scroll-right 26s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Top row */}
      <div className="marquee">
        <div className="marquee-track scroll-right">
          {[...hiringLogos, ...hiringLogos].map((l, i) => (
            <div key={`top-${l.name}-${i}`} className="marquee-item">
              <div
                className="logo"
                style={{
                  backgroundColor: l.color,
                  WebkitMaskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${l.icon}.svg)`,
                  maskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${l.icon}.svg)`,
                }}
                aria-label={l.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* Bottom row */}
      <div className="marquee">
        <div className="marquee-track scroll-left">
          {[...hiringLogos, ...hiringLogos].map((l, i) => (
            <div key={`bot-${l.name}-${i}`} className="marquee-item">
              <div
                className="logo"
                style={{
                  backgroundColor: l.color,
                  WebkitMaskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${l.icon}.svg)`,
                  maskImage: `url(https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${l.icon}.svg)`,
                }}
                aria-label={l.name}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HiringPartner;
