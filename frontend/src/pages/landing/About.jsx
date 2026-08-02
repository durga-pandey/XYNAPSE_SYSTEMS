import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90  p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const About = () => {
  return (
    <>
      <section className={`${sectionCardClasses} grid gap-8 lg:grid-cols-2`}>
        <AnimatedReveal variant="left">
          <div className="rounded-3xl border border-dashed border-slate-300 p-6 dark:border-slate-700">
            {/* Image Box */}
            <div className="h-80 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="/images/success.jpg"
                alt="success"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Seminars • Live projects • IT collaborations • CRT & PDP programs
              • Mock interviews
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal variant="right" className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-300">
            About XYNAPSE SSYTEMS
          </p>

          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
            XYNAPSE SYSTEMS – Making Job Cracking Easier!
          </h2>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Our Mission
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Empower learners through industry-vetted curriculum, mentorship,
              and immersive practice to land roles they love.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Our Vision
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Build the most trusted ecosystem for talent creation where every
              student can access career pathways with confidence.
            </p>
          </div>

          <button
            type="button"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            Learn More
          </button>
        </AnimatedReveal>
      </section>
    </>
  );
};

export default About;
