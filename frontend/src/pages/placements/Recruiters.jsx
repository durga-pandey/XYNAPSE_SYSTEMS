import { useEffect, useRef, useState } from "react";
import SEO from "../../components/SEO";

const featureItems = [
  "Hiring Fee – Zero",
  "Access to Job-Ready Talent Pool",
  "Flexible Hiring Modes",
  "Full Placement Support",
];

const testimonials = Array.from({ length: 8 }).map((_, index) => ({
  name: `Recruiter Name ${index + 1}`,
  role: "Talent Acquisition Lead",
  company: "Placeholder Corp",
  videoUrl: "https://via.placeholder.com/320x180?text=Video",
  image:
    "https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg",
  description:
    "Short placeholder note about hiring experience and job-ready talent.",
}));

const contactInfo = [
  { label: "Address", value: "Placeholder City" },
  { label: "Phone", value: "+91 90000 00000" },
  { label: "Email", value: "recruit@placeholder.com" },
];

const sectionCardClasses =
  "rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

function AnimatedSection({
  children,
  className = "",
  variant = "up",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = {
    up: "opacity-0 translate-y-6",
    left: "opacity-0 -translate-x-6",
    right: "opacity-0 translate-x-6",
    scale: "opacity-0 scale-95",
  };
  const shown = "opacity-100 translate-y-0 translate-x-0 scale-100";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-600 ease-out ${visible ? shown : hidden[variant] || hidden.up} ${className}`}
    >
      {children}
    </div>
  );
}

function FeatureList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {featureItems.map((item, index) => (
        <AnimatedSection key={item} variant="up" delay={index * 80}>
          <div
            className="rounded-full border border-slate-200/80 px-4 py-3 text-sm font-semibold dark:border-slate-700/70"
            role="presentation"
          >
            {item}
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}

function RecruiterForm() {
  return (
    <AnimatedSection
      className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-900/60"
      variant="right"
    >
      <h3 className="text-xl font-semibold">Want to Hire Talent? Contact Us</h3>
      <p className="text-sm">
        Fill out the placeholder form. Fields map to backend payloads later.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "First Name", type: "text", name: "firstName" },
          { label: "Email", type: "email", name: "email" },
          { label: "Mobile Number", type: "tel", name: "mobile" },
          { label: "Company Name", type: "text", name: "company" },
          { label: "Designation", type: "text", name: "designation" },
        ].map((field) => (
          <label key={field.name} className="text-sm">
            {field.label}
            <input
              type={field.type}
              name={field.name}
              placeholder="Placeholder"
              className="mt-1 w-full rounded border border-slate-200/80 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900"
            />
          </label>
        ))}
        <label className="text-sm sm:col-span-2">
          Message
          <textarea
            name="message"
            rows={4}
            placeholder="Placeholder"
            className="mt-1 w-full rounded border border-slate-200/80 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900"
          />
        </label>
      </div>
      <button
        type="button"
        className="w-full rounded-full border border-slate-200/80 px-4 py-3 text-sm font-semibold dark:border-slate-700/70"
      >
        Submit
      </button>
    </AnimatedSection>
  );
}

function RecruiterCard({ name, role, company, videoUrl, image, description }) {
  return (
    <AnimatedSection
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 transition duration-300 hover:-translate-y-1 hover:scale-[1.01] dark:border-slate-800/60 dark:bg-slate-900/60"
      variant="up"
    >
      <div className="space-y-4">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="rounded-full border border-slate-200/80 px-4 py-2 text-xs font-semibold dark:border-slate-700/70"
            >
              Play
            </button>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{role}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {company}
          </p>
        </div>
        {description && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
        <img
          src={videoUrl}
          alt="Video placeholder"
          className="w-full rounded-lg object-cover"
        />
      </div>
    </AnimatedSection>
  );
}

function Recruiters() {
  return (
    <>
      <SEO
        title="Recruiters | Xynapse Systems"
        description="Connect with top recruiters through Xynapse Systems and explore career opportunities for students and working professionals."
        canonical="https://xynapsesystems.com/placements/recruiters"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <main className="min-h-screen  text-slate-900  dark:text-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-10">
          <AnimatedSection
            className={`${sectionCardClasses} text-center`}
            variant="scale"
          >
            <h1 className="text-4xl font-semibold">Recruiters</h1>
            <p className="mt-2 text-sm">
              Placeholder subheading for recruiter partnerships.
            </p>
          </AnimatedSection>

          <section
            className={`${sectionCardClasses} grid gap-8 lg:grid-cols-2`}
          >
            <AnimatedSection className="space-y-6" variant="left">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em]">
                  Partnership
                </p>
                <h2 className="text-3xl font-semibold">
                  Become Hiring Partner with Us
                </h2>
                <p className="text-base font-semibold">
                  Build Your Future Workforce!
                </p>
                <p className="text-sm leading-relaxed">
                  We help companies bridge the gap between industry and skilled
                  talent. Our training programs produce job-ready professionals
                  across Full Stack Development, Data Science, DevOps, Cloud,
                  ERP, GIS, and multiple other domains. Companies can partner
                  with us for free and access a trained talent pool from 30+
                  career-ready courses. Let's build a skilled workforce
                  together.
                </p>
              </div>
              <FeatureList />
            </AnimatedSection>
            <RecruiterForm />
          </section>

          <section className={`${sectionCardClasses} space-y-6`}>
            <AnimatedSection className="text-center">
              <p className="text-sm uppercase tracking-wide">Testimonials</p>
              <h2 className="text-3xl font-semibold">What Recruiters Say</h2>
            </AnimatedSection>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((recruiter) => (
                <RecruiterCard key={recruiter.name} {...recruiter} />
              ))}
            </div>
          </section>

          <AnimatedSection
            className={`${sectionCardClasses} grid gap-4 text-sm`}
            variant="up"
          >
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0"
              >
                <span className="font-semibold">{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </main>
    </>
  );
}

export default Recruiters;
