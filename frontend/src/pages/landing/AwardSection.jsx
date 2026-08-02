import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90  p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const awards = [
  "Most Promising Data Science Training Institutes – 2023",
  "Best Emerging Real-Time Training Academy of the Year",
  "Best Online Training Institute of the Year",
  "Most Innovative Online Education Platform",
  "Most Trusted Education Brand",
  "Indian Iconic Skill & Career Empowering Institute 2025",
];

const AwardSection = () => {
  return (
    <>
      <section className={`${sectionCardClasses} space-y-6`}>
        <AnimatedReveal className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Awards
          </h2>
        </AnimatedReveal>
        <div className="grid gap-4 md:grid-cols-3">
          {awards.map((award, index) => (
            <AnimatedReveal key={award} delay={index * 80}>
              <article className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition-transform duration-300 hover:-translate-y-1 hover:rotate-1 dark:border-slate-700 dark:text-slate-200">
                {award}
              </article>
            </AnimatedReveal>
          ))}
        </div>
      </section>
    </>
  );
};

export default AwardSection;
