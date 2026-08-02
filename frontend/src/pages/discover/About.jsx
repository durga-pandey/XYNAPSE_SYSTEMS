import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";

const stats = [
  { label: "Learners trained", value: "35,000+" },
  { label: "Projects built", value: "4,800+" },
  { label: "Hiring partners", value: "120+" },
  { label: "Average rating", value: "4.9/5" },
];

const timeline = [
  {
    title: "Where it began",
    description:
      "AuthFlow started as a small mentoring circle focused on job-ready skills for aspiring developers.",
    year: "2019",
  },
  {
    title: "First milestone",
    description:
      "Launched structured cohorts with real-world projects and secured our initial hiring partners.",
    year: "2020",
  },
  {
    title: "Scaling impact",
    description:
      "Introduced advanced specializations, remote-first collaboration pods, and global mentors.",
    year: "2022",
  },
  {
    title: "Looking ahead",
    description:
      "Building an adaptive learning OS that personalizes every learner's journey end-to-end.",
    year: "Next",
  },
];

const leaders = [
  {
    name: "Aanya Kapoor",
    role: "Co-founder & CEO",
    bio: "Product strategist passionate about inclusive education and future-focused careers.",
  },
  {
    name: "Raghav Sharma",
    role: "Head of Learning",
    bio: "Former FAANG mentor crafting hands-on curricula rooted in industry demands.",
  },
  {
    name: "Mira Thomas",
    role: "Community Director",
    bio: "Builds thriving peer networks and alumni programs that unlock lifelong opportunities.",
  },
  {
    name: "Leo Fernandez",
    role: "Engineering Lead",
    bio: "Architects the platform experience and ensures seamless, secure learning journeys.",
  },
  {
    name: "Sara Mehta",
    role: "Career Success Lead",
    bio: "Partners with hiring teams to translate learner strengths into dream offers.",
  },
  {
    name: "Arjun Rao",
    role: "Design Lead",
    bio: "Shapes the AuthFlow visual language with a balance of warmth and clarity.",
  },
];

function About() {
  const sectionRef = useRef(null);

  const [counts, setCounts] = useState(
    stats.map((s) => {
      const num = parseInt(s.value.replace(/[^0-9]/g, ""));
      return isNaN(num) ? s.value : 0;
    }),
  );

  useEffect(() => {
    const animationFrameIds = [];

    const animateCounter = (index, target) => {
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = value;
          return newCounts;
        });

        if (progress < 1) {
          const id = requestAnimationFrame(step);
          animationFrameIds.push(id);
        } else {
          // ensure final value
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = target;
            return newCounts;
          });
        }
      };

      requestAnimationFrame(step);
    };

    let observer;
    if (sectionRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              const num = parseInt(stat.value.replace(/[^0-9]/g, ""));
              if (!isNaN(num)) {
                animateCounter(index, num);
              }
            });
            observer.unobserve(sectionRef.current);
          }
        },
        { threshold: 0.3 },
      );

      observer.observe(sectionRef.current);
    }

    return () => {
      animationFrameIds.forEach((id) => cancelAnimationFrame(id));
      if (observer && sectionRef.current)
        observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <>
      <SEO
        title="About Us | Xynapse Systems"
        description="Learn about Xynapse Systems, our mission, and how we empower students and professionals through software training."
        canonical="https://xynapsesystems.com/about"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-6 py-16 text-center shadow-sm dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-400">
              About AuthFlow
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Our Mission at AuthFlow
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              We empower learners to build meaningful careers with immersive
              practice, mentorship, and a community that never stops growing.
            </p>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="grid gap-6 md:grid-cols-2">
          {["Our Mission", "Our Vision"].map((title, index) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-slate-800/60 dark:bg-slate-900/60"
            >
              <div
                className="absolute inset-0 rounded-3xl border border-slate-200/60 dark:border-slate-700/60"
                aria-hidden
              />
              <div className="relative space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {title}
                </p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {index === 0
                    ? "Deliver the most trusted, outcomes-first learning experience for ambitious talent."
                    : "Become the companion platform that powers every learner's lifelong growth story."}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {index === 0
                    ? "We combine rigorous curriculum, peer collaboration, and real projects to accelerate confidence and skills."
                    : "From discovery to placement to reinvention, AuthFlow envisions a future where growth is beautifully orchestrated."}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section
          ref={sectionRef}
          className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/40"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const isNumber = typeof counts[index] === "number";
              const hasPlus = stat.value.includes("+");
              const display = isNumber
                ? counts[index].toLocaleString() + (hasPlus ? "+" : "")
                : counts[index];

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-slate-50/70 p-6 text-center dark:bg-slate-900/70"
                >
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                    {display}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Our journey
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Milestones that shaped AuthFlow
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A timeline of curiosity, community, and continuous improvement.
            </p>
          </div>
          <div className="relative border-l border-dashed border-slate-200 pl-8 dark:border-slate-700">
            {timeline.map((step, idx) => (
              <div key={step.title} className="relative pb-10 last:pb-0">
                <span className="absolute -left-11 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-xs font-bold text-white shadow-lg dark:border-slate-900">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {step.year}
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section>
          <div className="mb-8 space-y-2 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Leadership & team
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              People behind the momentum
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Builders, mentors, and operators aligned to bring bold outcomes to
              life.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/40"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-lg font-semibold text-white shadow-lg">
                    <div className="flex h-full items-center justify-center">
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {leader.name}
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {leader.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA  */}
        <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-center text-white shadow-lg dark:border-slate-800">
          <h2 className="text-3xl font-semibold">
            Join our learning community
          </h2>
          <p className="mt-3 text-sm text-slate-200">
            Step into immersive cohorts, build flagship projects, and unlock the
            next chapter of your career.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Explore courses
          </Link>
        </section>
      </div>
    </>
  );
}

export default About;
