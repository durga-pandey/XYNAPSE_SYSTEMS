import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90  p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const appBullets = [
  "Interactive video lessons",
  "Mock interviews & assessments",
  "Real-time project tracking",
  "Certification & placement support",
];

const FutureLearning = () => {
  return (
    <>
      <section className={`${sectionCardClasses} grid gap-8 lg:grid-cols-2`}>
        <AnimatedReveal>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              The Future of Learning is Here
            </h2>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              XYNAPSE SYSTEMS E-Learning App
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Access live and recorded classes, assignments, and mentor support
              from anywhere with the Teks mobile app.
            </p>
            <ul className="space-y-2">
              {appBullets.map((item) => (
                <li
                  key={item}
                  className="text-sm text-slate-600 dark:text-slate-300"
                >
                  • {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Download for iOS
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                Download for Android
              </button>
            </div>
          </div>
        </AnimatedReveal>
        <AnimatedReveal
          variant="right"
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-sm rounded-3xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/learning.jpg"
                alt="learning"
                className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Interactive mobile learning experience
            </p>
          </div>
        </AnimatedReveal>
      </section>
    </>
  );
};

export default FutureLearning;
