import { useState } from "react";
import { AnimatedReveal } from "./Landing";

const sectionCardClasses =
  "rounded-3xl border border-slate-00/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

const placementReviews = [
  {
    name: "Chandravardhan",
    track: "Full Stack Java",
    feedback:
      "Teks Academy shaped my thinking and gave me confidence to face product interviews.",
    img: "/images/stu-1.jpg",
  },
  {
    name: "Shandruth",
    track: "Full Stack Python",
    feedback:
      "Hands-on labs and mentor reviews turned every concept into a mini project.",
    img: "/images/stu-2.jpg",
  },
  {
    name: "Srinivas",
    track: "Data Science",
    feedback:
      "Capstones + mock interviews made transitioning from support to data seamless.",
    img: "/images/stu-3.jpg",
  },
];

const successStories = {
  learning: [
    {
      name: "Chandravardhan",
      program: "Full Stack Java",
      type: "Video Testimonial",
      img: "/images/exp-1.jpg",
    },
    {
      name: "Shandruth",
      program: "Full Stack Python",
      type: "Classroom Journey",
      img: "/images/exp-2.jpg",
    },
    {
      name: "Srinivas",
      program: "Data Science",
      type: "Mentor Review",
      img: "/images/exp-3.jpg",
    },
  ],
  placed: [
    {
      name: "Sushmitha",
      program: "UI/UX",
      type: "Offer Letter Reveal",
      img: "/images/stu-1.jpg",
    },
    {
      name: "Bhargav",
      program: "Cyber Security",
      type: "Career Switch",
      img: "/images/stu-2.jpg",
    },
    {
      name: "Rahul",
      program: "Cloud Computing",
      type: "Placement Story",
      img: "/images/stu-3.jpg",
    },
  ],
};

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

const SuccessStories = () => {
  const [activeStoryTab, setActiveStoryTab] = useState("learning");
  const storyKeys = [
    { key: "learning", label: "Learning Experience" },
    { key: "placed", label: "Placed Students" },
  ];

  return (
    <>
      <style>{gradientAnimationStyle}</style>
      <section className={`${sectionCardClasses} space-y-8`}>
        <AnimatedReveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Proof of impact
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Our Success Stories
              </h2>
            </div>
            <div className="flex gap-3">
              {storyKeys.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveStoryTab(tab.key)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold ${
                    activeStoryTab === tab.key
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </AnimatedReveal>

        {/* Success Stories Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {successStories[activeStoryTab].map((story, index) => (
            <AnimatedReveal key={story.name + index} delay={index * 120}>
              <div className="relative group rounded-2xl overflow-hidden p-0.5">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x"></div>

                {/* Card Content */}
                <article className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl space-y-3">
                  {/* Image */}
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={story.img}
                      alt={story.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Name + Program */}
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {story.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {story.program}
                    </p>
                  </div>

                  <span className="inline-flex text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {story.type}
                  </span>
                </article>
              </div>
            </AnimatedReveal>
          ))}
        </div>

        {/* Placement Reviews */}
        <div className="grid gap-6 md:grid-cols-3">
          {placementReviews.map(
            (review, index) =>
              review.img && (
                <AnimatedReveal key={review.name + index} delay={index * 90}>
                  <div className="relative group rounded-2xl overflow-hidden p-0.5">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-100 animate-gradient-x"></div>

                    <article className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                      {/* Image */}
                      <div className="h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={review.img}
                          alt={review.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Name + Track + Feedback */}
                      <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        {review.track}
                      </p>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        “{review.feedback}”
                      </p>
                    </article>
                  </div>
                </AnimatedReveal>
              )
          )}
        </div>

        <AnimatedReveal className="text-center">
          <button
            type="button"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
          >
            View More Success Stories
          </button>
        </AnimatedReveal>
      </section>
    </>
  );
};

export default SuccessStories;
