import { useState, useRef, useEffect } from "react";
import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const professionals = [
  { name: "Shruti Singh", role: "Software Engineer", img: "/images/shruti.jpeg" },
  { name: "Jai Rishant", role: "Digital Marketing", img: "/images/prof-2.jpg" },
  { name: "Pooja", role: "Jr. Developer", img: "/images/prof-3.jpg" },
  { name: "Praveen", role: "Developer", img: "/images/prof-4.jpg" },
  { name: "Siva Kumar", role: "Digital Marketing", img: "/images/prof-5.jpg" },
  { name: "Siva Shankar", role: "Database Administrator", img: "/images/prof-6.jpg" },
];

// Gradient animation keyframes for Tailwind
const gradientAnimationStyle = `
@keyframes gradient-x {
  0%,100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}
`;

const WorkingProfessional = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const targetNumber = 38000;

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
    <div>
      <style>{gradientAnimationStyle}</style>
      <section className={`${sectionCardClasses} space-y-6`}>
        <AnimatedReveal className="text-center">
          <h2
            ref={ref}
            className="text-3xl font-semibold text-slate-900 dark:text-white"
          >
            {count.toLocaleString()}+
            <span className="ml-1 text-base font-medium text-gray-500">
              Working Professionals
            </span>
            <span className="ml-1 text-base font-medium text-gray-500">
              World Wide
            </span>
          </h2>
        </AnimatedReveal>

        <div className="grid gap-5 md:grid-cols-3">
          {professionals.map((person, index) => (
            <AnimatedReveal key={index} delay={index * 100}>
              <div className="relative group block rounded-2xl overflow-hidden p-0.5">
                {/* Gradient Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x"></div>

                {/* Card Content */}
                <article className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {person.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {person.role}
                    </p>
                  </div>
                </article>
              </div>
            </AnimatedReveal>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Enroll Now
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Book a Free Demo
          </button>
        </div>
      </section>
    </div>
  );
};

export default WorkingProfessional;
