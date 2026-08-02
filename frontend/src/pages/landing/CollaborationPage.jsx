import React from "react";

const collaborationLogos = ["Skill India", "NSDC", "DDU-GKY", "ISO", "NASSCOM", "MSDE"];

const CollaborationPage = () => {
  const logos = collaborationLogos.concat(collaborationLogos);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10 overflow-hidden">
      <h2 className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-6">
        We Proudly Collaborate with E&ICT Academy
      </h2>

      <div className="relative overflow-hidden">
        {/* Slider Track */}
        <div className="flex animate-scroll gap-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="rounded-full border border-slate-200 px-6 py-3 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollaborationPage;
