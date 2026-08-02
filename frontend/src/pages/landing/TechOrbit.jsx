import { useState } from "react";
import { AnimatedReveal } from "./Landing";
import {
  Database,
  Code2,
  BrainCircuit,
  Settings,
  Server,
  LayoutTemplate,
  HardDrive,
  ArrowUpRight,
  Download, FileText
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect } from "react";

const sectionCardClasses =
  "rounded-[3rem] border border-slate-200/80 bg-white/90 p-8 shadow-2xl dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-16 relative overflow-hidden";

const TechOrbit = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/course/all-courses?limit=8",
        );
        setCourses(data.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDownload = async (url, title) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };
  return (
    <section className={`${sectionCardClasses} mt-12 mb-12`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <AnimatedReveal className="text-center space-y-6 mb-20 relative z-10">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-black tracking-widest uppercase">
          Industry Authority
        </div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
          The Tech{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            Orbit
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 font-medium">
          Architecting careers through deep-tech specialization. Move beyond the
          basics and master the engineering elite stack.
        </p>
      </AnimatedReveal>

      {/* The Orbit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
        {courses.map((course, i) => (
          <AnimatedReveal key={course._id} delay={i * 50} className="h-full">
            <div className="group relative flex flex-col p-8 h-full rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:border-cyan-500/40 hover:shadow-2xl">
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem] backdrop-blur-sm">
                <button
                  onClick={() =>
                    handleDownload(course.syllabus?.secure_url, course.title)
                  }
                  className="flex items-center gap-2 bg-slate-900 dark:bg-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  <Download size={18} /> Syllabus
                </button>
              </div>

              <div className="flex justify-between items-start mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-cyan-500 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <FileText size={32} />
                </div>
                <ArrowUpRight className="text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 transition-all" />
              </div>

              <div className="space-y-4 flex-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  {course.title}
                </h4>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {course.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-black text-cyan-600 bg-cyan-500/10 px-2 py-1 rounded-md uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price */}
                {/* <div className="text-lg font-black text-slate-900 dark:text-slate-300 pt-2">
                  {course.isFree ? "FREE" : `₹${course.price}`}
                </div> */}
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};

export default TechOrbit;
