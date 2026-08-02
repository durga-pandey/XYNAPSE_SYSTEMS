import { useEffect, useRef, useState } from "react";
import alumniService from "../../services/alumniService";
import SEO from "../../components/SEO";

const introParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dignissim orci id orci varius, non volutpat augue facilisis.",
  "Integer gravida, orci sed viverra maximus, augue dui egestas metus, ac convallis tortor tellus nec nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.",
];

const alumniProfiles = [
  {
    image:
      "https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg",
    name: "Alumni Name",
    course: "Full Stack Program",
    description:
      "Short summary about the learning path and placement milestone.",
    certificateImage:
      "https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg",
  },
  {
    image: "https://via.placeholder.com/320x320?text=Alumni",
    name: "Placeholder Person",
    course: "Data Science Certification",
    description:
      "Brief placeholder copy describing achievements in the cohort.",
    certificateImage: "https://via.placeholder.com/160x90?text=Certificate",
  },
  {
    image: "https://via.placeholder.com/320x320?text=Alumni",
    name: "Sample Graduate",
    course: "Product Design Intensive",
    description:
      "Summary text about transitioning into a new role via mentorship.",
    certificateImage: "https://via.placeholder.com/160x90?text=Certificate",
  },
  {
    image: "https://via.placeholder.com/320x320?text=Alumni",
    name: "Future Leader",
    course: "Cloud Computing Track",
    description: "Placeholder paragraph sharing success in cloud-native roles.",
    certificateImage: "https://via.placeholder.com/160x90?text=Certificate",
  },
];

const sectionCardClasses =
  "rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/50 sm:p-10";

function AnimatedBlock({
  children,
  className = "",
  variant = "up",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenMap = {
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
      className={`transition-all duration-600 ease-out ${
        visible ? shown : hiddenMap[variant] || hiddenMap.up
      } ${className}`}
    >
      {children}
    </div>
  );
}

function AlumniCard({ image, name, course, tags, description }) {
  return (
    <AnimatedBlock
      className="rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] dark:border-slate-800/60 dark:bg-slate-900/60 shadow-lg"
      variant="up"
    >
      <div className="flex flex-col gap-4">
        <div className="relative w-full h-56 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {course}
          </p>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-2">
            {description}
          </p>
        )}

        {/* Certificate Image Removed from bottom, only main image shown */}
      </div>
    </AnimatedBlock>
  );
}

function AlumniIntroBadges() {
  return (
    <div className="relative">
      <AnimatedBlock
        className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-700"
        variant="left"
      >
        <img
          src="https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg"
          alt="Alumni"
          className="w-full object-cover"
        />
      </AnimatedBlock>

      <AnimatedBlock
        className="absolute right-4 top-4 w-40 rounded-2xl border border-slate-200/80 bg-white/90 p-3 text-sm dark:border-slate-700/70 dark:bg-slate-950/70"
        variant="scale"
        delay={150}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Alumni Name
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Software Developer
            </p>
          </div>
        </div>
      </AnimatedBlock>

      <AnimatedBlock
        className="absolute left-4 top-1/2 w-40 -translate-y-1/2 rounded-2xl border border-slate-200/80 bg-white/90 p-3 dark:border-slate-700/70 dark:bg-slate-950/70"
        variant="scale"
        delay={250}
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Successful Verified
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Your job certification
        </p>
      </AnimatedBlock>

      <AnimatedBlock
        className="absolute bottom-4 left-1/2 w-44 -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-center dark:border-slate-700/70 dark:bg-slate-950/70"
        variant="scale"
        delay={350}
      >
        <div className="mx-auto h-16 w-16 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-600" />
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
          Your job experience
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Tell us about your experience
        </p>
      </AnimatedBlock>
    </div>
  );
}

function AlumniIntroText() {
  return (
    <AnimatedBlock className="space-y-5" variant="right">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
        Alumni Network
      </p>
      <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
        India’s Leading Alumni Network
      </h1>
      {introParagraphs.map((content, index) => (
        <p
          key={index}
          className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          {content}
        </p>
      ))}
    </AnimatedBlock>
  );
}

function Alumni() {
  const [alumniList, setAlumniList] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadAlumni() {
      setAlumniLoading(true);
      try {
        const resp = await alumniService.getAll({ page, limit });
        if (mounted && resp) {
          setAlumniList(resp.data || []);
          setTotal(resp.total || 0);
        }
      } catch (err) {
        console.warn("Failed to load alumni", err);
        if (mounted) {
          setAlumniList([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setAlumniLoading(false);
      }
    }

    loadAlumni();
    return () => {
      mounted = false;
    };
  }, [page, limit]);
  return (
   <>
    <SEO
        title="Alumni | Xynapse Systems"
        description="Explore the success stories of Xynapse Systems alumni and see how our programs shape careers."
        canonical="https://xynapsesystems.com/placements/alumni"
        image="https://xynapsesystems.com/images/Logo.png"
      />
    <main className="min-h-screen  text-slate-900  dark:text-slate-50">
      <div className="mx-auto w-full  max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-10">
        <section className={`${sectionCardClasses} grid gap-10 lg:grid-cols-2`}>
          <AlumniIntroBadges />
          <AlumniIntroText />
        </section>

        <section className={`${sectionCardClasses} space-y-6`}>
          <AnimatedBlock className="text-center">
            <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Global Success
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Our Global Alumni Network
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Placeholder paragraph describing how graduates collaborate,
              mentor, and return to hire future batches.
            </p>
          </AnimatedBlock>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alumniLoading
              ? Array.from({ length: limit }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800/70 dark:bg-slate-900/50"
                  >
                    <div className="h-40 w-full rounded-md bg-slate-100 dark:bg-slate-800" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))
              : alumniList && alumniList.length
              ? alumniList.map((a) => (
                  <AlumniCard
                    key={a._id}
                    image={
                      a.images && a.images.length
                        ? a.images[0].secure_url
                        : "https://via.placeholder.com/320x320?text=Alumni"
                    }
                    name={a.name}
                    course={a.certificateName}
                    tags={a.tags}
                    certificateImage={
                      a.images && a.images.length
                        ? a.images[0].secure_url
                        : null
                    }
                  />
                ))
              : alumniProfiles.map((profile) => (
                  <AlumniCard key={profile.name} {...profile} />
                ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || alumniLoading}
              className="rounded-md px-4 py-2 text-sm font-semibold border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {page} of {Math.max(1, Math.ceil(total / limit))}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit) || alumniLoading}
              className="rounded-md px-4 py-2 text-sm font-semibold border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </main>
   </>
  );
}

export default Alumni;
