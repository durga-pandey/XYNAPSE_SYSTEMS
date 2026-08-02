import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import TopBar from "./layout/TopBar";
import Footer from "./layout/Footer";
import authService from "../services/authService";
import courseService from "../services/courseService";
import { logout as logoutAction } from "../redux/authslice";
import FormModal from "./layout/FormModal";
import InternshipModal from "./layout/InternshipModal";
import axiosInstance from "../utils/axiosInstance";
import FloatingAction from "./FloatingAction";

const navLinks = [
  // { label: "Home", to: "/" },
  { label: "Courses", mega: true },
  { label: "Branches", branches: true },
  { label: "Colleges", college: true },
  {
    label: "Discover",
    dropdown: true,
    items: [
      { label: "About", to: "/about" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  { label: "Placements", placement: true },

  { label: "Dashboard", to: "/dashboard", cta: true },
];

const footerNav = [
  { label: "Programs", to: "/about" },
  { label: "Playground", to: "/play" },
  { label: "Careers", to: "/about" },
  { label: "Support", to: "/about" },
];

const placementLinks = [
  {
    label: "Alumni",
    description: "Success stories, outcomes, and placement highlights.",
    to: "/placements/alumni",
  },
  {
    label: "Recruiters",
    description: "Hire-ready talent pools and partner benefits.",
    to: "/placements/recruiters",
  },
];

const branches = [
  {
    name: "Ameerpet",
    phone: "+91 78159 24610",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/ameerpet.webp",
    id: "ameerpet",
  },
  {
    name: "Hitec City",
    phone: "+91 78159 24622",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/secunderabad.webp",
    id: "hitec-city",
  },
  {
    name: "Secunderabad",
    phone: "+91 92814 66365",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/bangalore.webp",
    id: "secunderabad",
  },
  {
    name: "Dilsukhnagar",
    phone: "+91 78159 24700",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/bangalore.webp",
    id: "dilsukhnagar",
  },
  {
    name: "Mehdipatnam",
    phone: "+91 98660 47567",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/secunderabad.webp",
    id: "mehdipatnam",
  },
  {
    name: "Kukatpally",
    phone: "+91 86884 08352",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/bangalore.webp",
    id: "kukatpally",
  },
  {
    name: "Bangalore",
    phone: "+91 70754 63275",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/secunderabad.webp",
    id: "bangalore",
  },
  {
    name: "Visakhapatnam",
    phone: "+91 91333 08352",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/bangalore.webp",
    id: "visakhapatnam",
  },
  {
    name: "Delhi",
    phone: "+91 91333 08352",
    icon: "	https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/branchnavimg/salem.webp",
    id: "visakhapsasaatnam",
  },
];

const socials = [
  {
    label: "Telegram",
    href: "https://t.me/+917309900393",
    color: "#229ED9",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M9.04 15.47l-.38 5.36c.54 0 .78-.23 1.06-.5l2.54-2.43 5.26 3.85c.97.54 1.66.26 1.9-.9L23.9 2.9c.3-1.4-.5-1.95-1.44-1.6L1.6 9.1c-1.35.53-1.33 1.29-.23 1.63l5.36 1.67L19.18 4.9c.6-.4 1.15-.18.7.22" />
      </svg>
    ),
  },

  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "#0A66C2",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.851-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.353V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.604 0 4.27 2.372 4.27 5.459v6.282zM5.337 7.433a2.062 2.062 0 01-2.063-2.063 2.062 2.062 0 112.063 2.063zM6.967 20.452H3.705V9h3.262v11.452z" />
      </svg>
    ),
  },

  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583784914325",
    color: "#1877F2",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.18h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.527h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
      </svg>
    ),
  },

  {
    label: "Instagram",
    href: "https://www.instagram.com/xynapsesystems/",
    color: "#E4405F",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.33 4 20 5.67 20 7.75v8.5c0 2.08-1.67 3.75-3.75 3.75h-8.5C5.67 20 4 18.33 4 16.25v-8.5C4 5.67 5.67 4 7.75 4zm4.25 2.5A5.75 5.75 0 1 0 17.75 12 5.76 5.76 0 0 0 12 6.5zm0 2A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.5zm4.88-3.38a1.12 1.12 0 1 0 1.12 1.12 1.12 1.12 0 0 0-1.12-1.12z" />
      </svg>
    ),
  },
];

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topCourses, setTopCourses] = useState([]);
  const [topCoursesLoading, setTopCoursesLoading] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isPlacementsOpen, setIsPlacementsOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isCollegesOpen, setIsCollegesOpen] = useState(false);
  const [isCoursesMobileOpen, setIsCoursesMobileOpen] = useState(false);
  const [isPlacementsMobileOpen, setIsPlacementsMobileOpen] = useState(false);
  const [isDiscoverMobileOpen, setIsDiscoverMobileOpen] = useState(false);
  const [isBranchesMobileOpen, setIsBranchesMobileOpen] = useState(false);
  const [showAllMobileCourses, setShowAllMobileCourses] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const coursesTriggerRef = useRef(null);
  const coursesMenuRef = useRef(null);
  const coursesHoverTimeoutRef = useRef(null);
  const discoverTriggerRef = useRef(null);
  const discoverMenuRef = useRef(null);
  const discoverHoverTimeoutRef = useRef(null);
  const branchesTriggerRef = useRef(null);
  const branchesMenuRef = useRef(null);
  const branchesHoverTimeoutRef = useRef(null);
  const collegesTriggerRef = useRef(null);
  const collegesMenuRef = useRef(null);
  const collegesHoverTimeoutRef = useRef(null);
  const placementsTriggerRef = useRef(null);
  const placementsMenuRef = useRef(null);
  const placementsHoverTimeoutRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalBranch, setModalBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formDataFormModal, setFormDataFormModal] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    courseId: "",
  });

  const [formDataInternshipModal, setFormDataInternshipModal] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    courseId: "",
    year: "",
    department: "",
    linkedin: "",
    portfolio: "",
  });

  const openModal = (type, branch) => {
    setIsCoursesOpen(false);
    setModalType(type);
    setModalBranch(branch);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // Don't reset modalType and modalBranch immediately to allow smooth transitions
    setTimeout(() => {
      setModalType(null);
      setModalBranch(null);
    }, 300);

    if (modalType === "enroll") {
      setFormDataFormModal({
        name: "",
        email: "",
        phone: "",
        city: "",
        course: "",
      });
    } else if (modalType === "internship") {
      setFormDataInternshipModal({
        name: "",
        email: "",
        phone: "",
        resume: null,
        course: "",
        year: "",
        department: "",
        linkedin: "",
        portfolio: "",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (modalType === "enroll") {
      setFormDataFormModal((prev) => ({ ...prev, [name]: value }));
    } else if (modalType === "internship") {
      setFormDataInternshipModal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (modalType === "internship") {
      setFormDataInternshipModal((prev) => ({ ...prev, resume: file }));
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit =
        modalType === "enroll" ? formDataFormModal : formDataInternshipModal;

      if (modalType === "enroll") {
        const { data } = await axiosInstance.post("/courseForm/create-form", {
          name: dataToSubmit.name,
          email: dataToSubmit.email,
          mobile: dataToSubmit.phone,
          city: dataToSubmit.city,
          country: dataToSubmit.country,
          courseId: dataToSubmit.courseId,
        });

        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          setFormDataFormModal({
            name: "",
            email: "",
            phone: "",
            city: "",
            country: "",
            courseId: "",
          });
          closeModal();
        }
      } else if (modalType === "internship") {
        const formData = new FormData();
        for (let key in dataToSubmit) {
          if (key === "resume" && dataToSubmit.resume) {
            formData.append("resumeUrl", dataToSubmit.resume);
          } else {
            formData.append(key, dataToSubmit[key]);
          }
        }

        const { data } = await axiosInstance.post(
          "/internship/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (data.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          closeModal();
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        error;
      console.error(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axiosInstance.get("/course/all-courses");
        if (data.success) {
          const options = data.data.map((c) => ({
            value: c._id,
            label: c.title,
          }));
          setCourses(options);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(
          "https://restcountries.com/v3.1/all?fields=name",
        );

        const options = res.data
          .map((c) => ({ value: c.name.common, label: c.name.common }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountryOptions(options);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCourses();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (
      !isCoursesOpen &&
      !isPlacementsOpen &&
      !isDiscoverOpen &&
      !isBranchesOpen &&
      !isCollegesOpen
    )
      return undefined;

    const handleClickOutside = (event) => {
      const triggerEl = coursesTriggerRef.current;
      const menuEl = coursesMenuRef.current;
      if (
        isCoursesOpen &&
        menuEl &&
        !menuEl.contains(event.target) &&
        triggerEl &&
        !triggerEl.contains(event.target)
      ) {
        setIsCoursesOpen(false);
      }

      const placementTriggerEl = placementsTriggerRef.current;
      const placementMenuEl = placementsMenuRef.current;
      if (
        isPlacementsOpen &&
        placementMenuEl &&
        !placementMenuEl.contains(event.target) &&
        placementTriggerEl &&
        !placementTriggerEl.contains(event.target)
      ) {
        setIsPlacementsOpen(false);
      }
      const discoverTriggerEl = discoverTriggerRef.current;
      const discoverMenuEl = discoverMenuRef.current;
      if (
        isDiscoverOpen &&
        discoverMenuEl &&
        !discoverMenuEl.contains(event.target) &&
        discoverTriggerEl &&
        !discoverTriggerEl.contains(event.target)
      ) {
        setIsDiscoverOpen(false);
      }
      const branchesTriggerEl = branchesTriggerRef.current;
      const branchesMenuEl = branchesMenuRef.current;
      if (
        isBranchesOpen &&
        branchesMenuEl &&
        !branchesMenuEl.contains(event.target) &&
        branchesTriggerEl &&
        !branchesTriggerEl.contains(event.target)
      ) {
        setIsBranchesOpen(false);
      }
      const collegesTriggerEl = collegesTriggerRef.current;
      const collegesMenuEl = collegesMenuRef.current;
      if (
        isCollegesOpen &&
        collegesMenuEl &&
        !collegesMenuEl.contains(event.target) &&
        collegesTriggerEl &&
        !collegesTriggerEl.contains(event.target)
      ) {
        setIsCollegesOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCoursesOpen(false);
        setIsPlacementsOpen(false);
        setIsDiscoverOpen(false);
        setIsBranchesOpen(false);
        setIsCollegesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isCoursesOpen,
    isPlacementsOpen,
    isDiscoverOpen,
    isBranchesOpen,
    isCollegesOpen,
  ]);

  useEffect(
    () => () => {
      if (coursesHoverTimeoutRef.current) {
        clearTimeout(coursesHoverTimeoutRef.current);
      }
      if (placementsHoverTimeoutRef.current) {
        clearTimeout(placementsHoverTimeoutRef.current);
      }
      if (discoverHoverTimeoutRef.current) {
        clearTimeout(discoverHoverTimeoutRef.current);
      }
      if (branchesHoverTimeoutRef.current) {
        clearTimeout(branchesHoverTimeoutRef.current);
      }
      if (collegesHoverTimeoutRef.current) {
        clearTimeout(collegesHoverTimeoutRef.current);
      }
    },
    [],
  );

  const closeSidebar = () => {
    setSidebarOpen(false);
    setIsCoursesMobileOpen(false);
    setIsPlacementsMobileOpen(false);
    setShowAllMobileCourses(false);
  };

  const goToProfile = () => {
    closeSidebar();
    navigate("/profile");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.log(error);
      console.error(error.message || error);
    } finally {
      dispatch(logoutAction());
      setLoggingOut(false);
      closeSidebar();
      navigate("/");
    }
  };

  const openCoursesHoverMenu = () => {
    if (modalOpen) return;

    if (coursesHoverTimeoutRef.current) {
      clearTimeout(coursesHoverTimeoutRef.current);
    }
    setIsBranchesOpen(false);
    setIsPlacementsOpen(false);
    setIsDiscoverOpen(false);
    setIsCoursesOpen(true);
  };

  const closeCoursesHoverMenu = () => {
    if (modalOpen) return;

    coursesHoverTimeoutRef.current = setTimeout(() => {
      setIsCoursesOpen(false);
    }, 300);
  };

  const openPlacementsHoverMenu = () => {
    if (placementsHoverTimeoutRef.current) {
      clearTimeout(placementsHoverTimeoutRef.current);
    }
    setIsBranchesOpen(false);
    setIsCoursesOpen(false);
    setIsDiscoverOpen(false);
    setIsPlacementsOpen(true);
  };

  const openBranchesHoverMenu = () => {
    if (branchesHoverTimeoutRef.current) {
      clearTimeout(branchesHoverTimeoutRef.current);
    }
    setIsCoursesOpen(false);
    setIsPlacementsOpen(false);
    setIsDiscoverOpen(false);
    setIsBranchesOpen(true);
  };

  const openCollegesHoverMenu = () => {
    if (collegesHoverTimeoutRef.current) {
      clearTimeout(collegesHoverTimeoutRef.current);
    }
    setIsCoursesOpen(false);
    setIsPlacementsOpen(false);
    setIsDiscoverOpen(false);
    setIsBranchesOpen(false);
    setIsCollegesOpen(true);
  };

  const closeCollegesHoverMenu = () => {
    collegesHoverTimeoutRef.current = setTimeout(() => {
      setIsCollegesOpen(false);
    }, 300);
  };

  const openDiscoverHoverMenu = () => {
    if (discoverHoverTimeoutRef.current) {
      clearTimeout(discoverHoverTimeoutRef.current);
    }
    setIsBranchesOpen(false);
    setIsCoursesOpen(false);
    setIsPlacementsOpen(false);
    setIsDiscoverOpen(true);
  };

  useEffect(() => {
    let mounted = true;
    async function loadCourses() {
      setTopCoursesLoading(true);
      try {
        const resp = await courseService.getAllCourses({ page: 1, limit: 8 });
        if (!mounted) return;
        setTopCourses(resp?.data || []);
      } catch (err) {
        console.error("Failed to load courses", err?.message || err);
      } finally {
        if (mounted) setTopCoursesLoading(false);
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      setIsCoursesOpen(false);
      setIsPlacementsOpen(false);
      setIsDiscoverOpen(false);
      setIsBranchesOpen(false);
      setIsCollegesOpen(false);
    }
  }, [modalOpen]);

  const closePlacementsHoverMenu = () => {
    placementsHoverTimeoutRef.current = setTimeout(() => {
      setIsPlacementsOpen(false);
    }, 300);
  };

  const closeBranchesHoverMenu = () => {
    branchesHoverTimeoutRef.current = setTimeout(() => {
      setIsBranchesOpen(false);
    }, 300);
  };

  const closeDiscoverHoverMenu = () => {
    discoverHoverTimeoutRef.current = setTimeout(() => {
      setIsDiscoverOpen(false);
    }, 300);
  };

  const toggleCoursesMobileAccordion = () => {
    setIsCoursesMobileOpen((prev) => {
      const next = !prev;
      if (next) {
        setShowAllMobileCourses(false);
      }
      return next;
    });
  };

  const togglePlacementsMobileAccordion = () => {
    setIsPlacementsMobileOpen((prev) => !prev);
  };

  const toggleBranchesMobileAccordion = () => {
    setIsBranchesMobileOpen((prev) => !prev);
  };

  const filteredLinks = navLinks.filter((link) => {
    if (link.authOnly === true) {
      return isAuthenticated;
    }
    if (link.authOnly === false) {
      return !isAuthenticated;
    }
    return true;
  });

  const mobileCourseItems =
    topCourses && topCourses.length
      ? topCourses.map((c) => ({
          title: c.title,
          href: `/course/${c._id}`,
          description: c.shortDescription || c.description || "",
          collectionName: "Courses",
          accent: "bg-sky-100/60",
          icon: (
            <img
              src={c.thumbnail?.secure_url}
              alt={c.title}
              className="h-6 w-6 rounded-md object-cover"
            />
          ),
        }))
      : [];
  const visibleMobileCourses = showAllMobileCourses
    ? mobileCourseItems
    : mobileCourseItems.slice(0, 2);
  const canShowMoreMobileCourses =
    mobileCourseItems.length > visibleMobileCourses.length;

  const userLabel =
    user?.name ||
    user?.identifier ||
    user?.email ||
    user?.deviceName ||
    user?.userId ||
    "Signed in";

  return (
    <>
      <div className="min-h-screen">
        <header className="sticky top-0 z-20">
          <TopBar
            openModal={openModal}
            isAuthenticated={isAuthenticated}
            goToProfile={goToProfile}
            userLabel={userLabel}
            socials={socials}
          />

          <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto max-w-[1450px] flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link to="/more-details" onClick={closeSidebar} className="inline-block">
                <img
                  src="/images/Logo.png"
                  alt="Xynapse Systems"
                  className="h-20 w-40"
                />
              </Link>

              <div className="hidden items-center gap-6 lg:flex">
                {filteredLinks.map((link) =>
                  link.college ? (
                    <div key={link.label} className="relative">
                      <button
                        type="button"
                        ref={collegesTriggerRef}
                        aria-expanded={isCollegesOpen}
                        aria-haspopup="true"
                        aria-controls="colleges-mega-menu"
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                          isCollegesOpen
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                        onClick={() => setIsCollegesOpen((prev) => !prev)}
                        onMouseEnter={openCollegesHoverMenu}
                        onMouseLeave={closeCollegesHoverMenu}
                        onFocus={openCollegesHoverMenu}
                        onBlur={closeCollegesHoverMenu}
                      >
                        Colleges
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-4 w-4 transition ${
                            isCollegesOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      <div
                        id="colleges-mega-menu"
                        ref={collegesMenuRef}
                        onMouseEnter={openCollegesHoverMenu}
                        onMouseLeave={closeCollegesHoverMenu}
                        className={`absolute left-1/2 top-full z-10 mt-2
      w-[min(92vw,70rem)] -translate-x-1/2
      rounded-3xl border border-slate-200/70
      bg-white/85 backdrop-blur-xl
      p-8 shadow-2xl transition-all duration-200
      dark:border-slate-800/70 dark:bg-slate-900/90
      ${
        isCollegesOpen
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2"
      }`}
                      >
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                              College Programs & Partnerships
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                              Industry-driven training & institutional
                              collaborations
                            </p>
                          </div>

                          <span
                            className="rounded-full bg-gradient-to-r
        from-sky-500 to-indigo-500
        px-4 py-1.5 text-xs font-bold text-white shadow-md"
                          >
                            ENTERPRISE
                          </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                          {[
                            {
                              title: "College Partners",
                              items: [
                                "Our College Tie-ups",
                                "MoU Partnerships",
                                "Campus Training Programs",
                                "College Workshops & Seminars",
                                "Internship Collaboration",
                                "Placement Support for Colleges",
                                "Skill Development Programs",
                                "Technical Fest Partnerships",
                              ],
                              accent: "from-sky-500 to-cyan-400",
                              route: "/college/partners",
                            },
                            {
                              title: "Classroom Trainings",
                              items: [
                                "In-Person Training Sessions",
                                "Hands-on Practical Learning",
                                "Real-time Project Training",
                                "Beginner to Advanced Courses",
                                "Industry Expert Trainers",
                                "Weekly Assessments & Assignments",
                                "Certification-Oriented Classes",
                                "Small Batch Personalized Training",
                              ],
                              accent: "from-indigo-500 to-purple-500",
                              route: "/college/training",
                            },
                            {
                              title: "College Connect Program",
                              items: [
                                "Direct College Partnership",
                                "Professional Trainers Assigned",
                                "On-Campus Training Programs",
                                "Industry-Ready Skill Development",
                                "Custom Training Modules",
                                "Semester-Based Training",
                                "Workshops & Bootcamps",
                                "Internship & Live Projects",
                                "Placement Readiness",
                                "Dedicated Relationship Manager",
                              ],
                              accent: "from-emerald-500 to-teal-400",
                              route: "/college/connect",
                            },
                          ].map((section, idx) => (
                            <div
                              key={idx}
                              className="group rounded-2xl border border-slate-200/60
        bg-white/80 p-5 transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        dark:border-slate-700 dark:bg-slate-900/70"
                            >
                              {/* Title */}
                              <div className="mb-4 flex items-center gap-3">
                                <div
                                  className={`h-9 w-9 rounded-xl bg-gradient-to-br ${section.accent}
            flex items-center justify-center shadow-md`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="h-5 w-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 19.5V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75V19.5M9 22.5h6"
                                    />
                                  </svg>
                                </div>

                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                  {section.title}
                                </h4>
                              </div>

                              {/* List */}
                              <ul className="space-y-2 text-sm">
                                {section.items.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-slate-600
              transition group-hover:text-slate-900
              dark:text-slate-400 dark:group-hover:text-slate-200"
                                  >
                                    <span
                                      className={`mt-1 h-1.5 w-1.5 rounded-full
              bg-gradient-to-r ${section.accent}`}
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>

                              {/* Apply Here Button */}

                              <div className="mt-4">
                                <Link
                                  to={`${
                                    section.route
                                  }?program=${encodeURIComponent(
                                    section.title,
                                  )}`}
                                  state={{ program: section.title }}
                                  className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm font-semibold transition hover:bg-gray-800"
                                >
                                  Apply here
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : link.mega ? (
                    <div key={link.label} className="relative">
                      {/* Trigger */}
                      <button
                        type="button"
                        ref={coursesTriggerRef}
                        aria-expanded={isCoursesOpen}
                        aria-haspopup="true"
                        aria-controls="courses-mega-menu"
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                          isCoursesOpen
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                        onClick={() =>
                          setIsCoursesOpen((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsBranchesOpen(false);
                              setIsPlacementsOpen(false);
                              setIsDiscoverOpen(false);
                            }
                            return next;
                          })
                        }
                        onFocus={openCoursesHoverMenu}
                        onBlur={closeCoursesHoverMenu}
                        onMouseEnter={openCoursesHoverMenu}
                        onMouseLeave={closeCoursesHoverMenu}
                      >
                        Courses
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-4 w-4 transition ${
                            isCoursesOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      {/* Mega menu */}
                      <div
                        id="courses-mega-menu"
                        ref={coursesMenuRef}
                        onMouseEnter={openCoursesHoverMenu}
                        onMouseLeave={closeCoursesHoverMenu}
                        className={`absolute left-1/2 top-full z-10 mt-4 w-[min(90vw,44rem)]
      -translate-x-1/2 rounded-3xl border border-slate-200/80
      bg-white/95 p-6 shadow-2xl shadow-slate-900/10
      transition-all duration-200 dark:border-slate-800/80
      dark:bg-slate-900/95
      ${
        isCoursesOpen
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2"
      }`}
                      >
                        {/* CONTENT */}
                        {topCoursesLoading ? (
                          <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800"
                              />
                            ))}
                          </div>
                        ) : topCourses && topCourses.length ? (
                          <div className="flex flex-col divide-y divide-slate-200/60 dark:divide-slate-700/60">
                            {topCourses.map((c) => (
                              <Link
                                key={c._id}
                                to={`/course/${c._id}`}
                                onClick={() => {
                                  setIsCoursesOpen(false);
                                  if (modalOpen) closeModal();
                                }}
                                className="group flex items-center justify-between px-4 py-3
              transition hover:bg-sky-50/70 dark:hover:bg-slate-800/60"
                              >
                                {/* Left */}
                                <div className="flex items-center gap-3">
                                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500 opacity-70 group-hover:opacity-100" />
                                  <p
                                    className="text-sm font-semibold text-slate-900 transition
                group-hover:text-sky-600 dark:text-white
                dark:group-hover:text-sky-400"
                                  >
                                    {c.title}
                                  </p>
                                </div>

                                {/* Arrow */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-slate-400 transition
                group-hover:translate-x-1 group-hover:text-sky-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No courses available.
                          </p>
                        )}

                        <Link
                          to="/about"
                          className="mt-6 inline-flex items-center gap-2 rounded-full
        border border-slate-200/80 px-4 py-2 text-sm font-semibold
        text-slate-700 transition hover:border-sky-400
        hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
                        >
                          Know more
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ) : link.branches ? (
                    <div key={link.label} className="relative">
                      {/* Trigger */}
                      <button
                        type="button"
                        ref={branchesTriggerRef}
                        aria-expanded={isBranchesOpen}
                        aria-haspopup="true"
                        aria-controls="branches-mega-menu"
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                          isBranchesOpen
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                        onClick={() =>
                          setIsBranchesOpen((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsCoursesOpen(false);
                              setIsPlacementsOpen(false);
                              setIsDiscoverOpen(false);
                            }
                            return next;
                          })
                        }
                        onMouseEnter={openBranchesHoverMenu}
                        onMouseLeave={closeBranchesHoverMenu}
                        onFocus={openBranchesHoverMenu}
                        onBlur={closeBranchesHoverMenu}
                      >
                        Branches
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-4 w-4 transition ${
                            isBranchesOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      {/* Mega Menu */}
                      <div
                        ref={branchesMenuRef}
                        id="branches-mega-menu"
                        onMouseEnter={openBranchesHoverMenu}
                        onMouseLeave={closeBranchesHoverMenu}
                        className={`absolute left-1/2 top-full z-10 mt-4
      w-[min(90vw,68rem)] -translate-x-1/2
      rounded-3xl border border-slate-200/70
      bg-white/90 backdrop-blur-xl
      p-6 shadow-2xl transition-all duration-200
      dark:border-slate-800/70 dark:bg-slate-900/90
      ${
        isBranchesOpen
          ? "pointer-events-auto opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2"
      }`}
                      >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {branches.map((b) => (
                            <Link
                              key={b.id}
                              to={`/branch/${b.id}`}
                              className="group relative rounded-2xl border
            border-slate-200/60 bg-white/80
            p-5 transition-all duration-300
            hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl
            dark:border-slate-700 dark:bg-slate-900/70"
                            >
                              <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="relative flex-shrink-0">
                                  <div
                                    className="absolute inset-0 rounded-xl bg-gradient-to-br
                from-sky-400 to-indigo-500 opacity-20 blur-lg
                transition group-hover:opacity-40"
                                  />
                                  <div
                                    className="relative flex h-14 w-14 items-center justify-center
                rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500
                shadow-md"
                                  >
                                    <img
                                      src={b.icon}
                                      alt={b.name}
                                      className="h-8 w-8 object-contain brightness-0 invert"
                                    />
                                  </div>
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-sm font-bold text-slate-900 transition
                group-hover:text-sky-600
                dark:text-white dark:group-hover:text-sky-400"
                                  >
                                    {b.name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Explore courses & details
                                  </p>
                                </div>

                                {/* Arrow */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  className="h-5 w-5 text-slate-400 transition-all
                group-hover:translate-x-1
                group-hover:text-sky-500
                dark:text-slate-500 dark:group-hover:text-sky-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
                              </div>

                              {/* Bottom Accent */}
                              <div
                                className="absolute inset-x-0 bottom-0 h-0.5
            bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400
            opacity-0 transition group-hover:opacity-100"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : link.dropdown ? (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={openDiscoverHoverMenu}
                      onMouseLeave={closeDiscoverHoverMenu}
                    >
                      <button
                        type="button"
                        ref={discoverTriggerRef}
                        aria-expanded={isDiscoverOpen}
                        aria-haspopup="true"
                        aria-controls="discover-menu"
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                          isDiscoverOpen
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                        onClick={() =>
                          setIsDiscoverOpen((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsCoursesOpen(false);
                              setIsPlacementsOpen(false);
                              setIsBranchesOpen(false);
                            }
                            return next;
                          })
                        }
                        onFocus={openDiscoverHoverMenu}
                        onBlur={closeDiscoverHoverMenu}
                      >
                        Discover
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-4 w-4 transition ${
                            isDiscoverOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      <div
                        id="discover-menu"
                        ref={discoverMenuRef}
                        className={`absolute left-1/2 top-full z-10 mt-3 w-56 -translate-x-1/2 rounded-lg border border-slate-200/80 bg-white/95 p-3 shadow-lg transition-all duration-150 dark:border-slate-800/80 dark:bg-slate-900/95 ${
                          isDiscoverOpen
                            ? "pointer-events-auto opacity-100 translate-y-0"
                            : "pointer-events-none opacity-0 -translate-y-1"
                        }`}
                      >
                        <div className="space-y-1">
                          {link.items.map((it) => (
                            <Link
                              key={it.label}
                              to={it.to}
                              className="block rounded-md px-3 py-2 border border:gray-200 hover:border-sky-500 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : link.placement ? (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={openPlacementsHoverMenu}
                      onMouseLeave={closePlacementsHoverMenu}
                    >
                      <button
                        type="button"
                        ref={placementsTriggerRef}
                        aria-expanded={isPlacementsOpen}
                        aria-haspopup="true"
                        aria-controls="placements-menu"
                        className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                          isPlacementsOpen
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                        onClick={() =>
                          setIsPlacementsOpen((prev) => {
                            const next = !prev;
                            if (next) {
                              setIsCoursesOpen(false);
                              setIsBranchesOpen(false);
                              setIsDiscoverOpen(false);
                            }
                            return next;
                          })
                        }
                        onFocus={openPlacementsHoverMenu}
                        onBlur={closePlacementsHoverMenu}
                      >
                        Placements
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`h-4 w-4 transition ${
                            isPlacementsOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      <div
                        id="placements-menu"
                        ref={placementsMenuRef}
                        className={`absolute left-1/2 top-full z-10 mt-4 w-64 -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 transition-all duration-150 dark:border-slate-800/80 dark:bg-slate-900/95 ${
                          isPlacementsOpen
                            ? "pointer-events-auto opacity-100 translate-y-0 animate-slide-up"
                            : "pointer-events-none opacity-0 -translate-y-2 animate-slide-down"
                        }`}
                      >
                        <div className="space-y-3">
                          {placementLinks.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className="block rounded-xl border border-slate-200/80 px-3 py-2 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
                            >
                              <p className="text-sm font-semibold">
                                {item.label}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : link.cta ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 button-interactive"
                    >
                      {link.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-sm font-medium transition hover:text-sky-500 ${
                        location.pathname === link.to
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
                <ThemeToggle />
                {isAuthenticated && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToProfile}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      {userLabel}
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm dark:border-slate-700 dark:text-slate-100 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span>Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-white/95 p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden dark:bg-slate-950/95 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="text-lg font-bold text-slate-900 dark:text-white"
              onClick={closeSidebar}
            >
              XYNAPSE SYSTEMS
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              className="rounded-full border border-slate-200 p-2 dark:border-slate-700"
              onClick={closeSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable nav */}
          <nav className="flex-1 flex flex-col overflow-y-auto space-y-3 max-h-[calc(100vh-160px)] pr-1">
            {filteredLinks.map((link) =>
              link.mega ? (
                <div key={link.label} className="space-y-2">
                  {/* Courses Accordion */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={toggleCoursesMobileAccordion}
                  >
                    <span>Courses</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-5 w-5 transition-transform ${
                        isCoursesMobileOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  {isCoursesMobileOpen && (
                    <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto pr-1">
                      {visibleMobileCourses.map((item) => (
                        <Link
                          key={`${item.collectionName}-${item.title}`}
                          to={item.href}
                          onClick={closeSidebar}
                          className="block rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white transition hover:bg-sky-50 hover:border-sky-400 dark:hover:bg-sky-900/30"
                        >
                          {item.title}
                        </Link>
                      ))}
                      {canShowMoreMobileCourses && (
                        <button
                          type="button"
                          onClick={() => setShowAllMobileCourses(true)}
                          className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-600 dark:text-slate-200 mt-2"
                        >
                          Show more
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : link.dropdown ? (
                <div key={link.label} className="space-y-2">
                  {/* Discover Accordion */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => setIsDiscoverMobileOpen((p) => !p)}
                  >
                    <span>Discover</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-5 w-5 transition-transform ${
                        isDiscoverMobileOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  {isDiscoverMobileOpen && (
                    <div className="flex flex-col gap-2 mt-2 px-2">
                      {link.items.map((it) => (
                        <Link
                          key={it.label}
                          to={it.to}
                          onClick={closeSidebar}
                          className="block rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white transition hover:bg-sky-50 hover:border-sky-400 dark:hover:bg-sky-900/30"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.branches ? (
                <div key={link.label} className="space-y-2">
                  {/* Branches Accordion */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={toggleBranchesMobileAccordion}
                  >
                    <span>Branches</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-5 w-5 transition-transform ${
                        isBranchesMobileOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>

                  {isBranchesMobileOpen && (
                    <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto pr-1">
                      {branches.map((b) => (
                        <Link
                          key={b.id}
                          to={`/branch/${b.id}`}
                          onClick={closeSidebar}
                          className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 shadow-sm p-4 transition hover:scale-[1.02] hover:border-sky-400 hover:shadow-lg active:scale-[0.98] dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:hover:border-sky-500"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-sky-300/30 blur-md transition-all group-hover:bg-sky-400/50" />
                            <img
                              src={b.icon}
                              alt={b.name}
                              className="relative h-12 w-12 rounded-xl object-cover ring-4 ring-sky-400 transition-transform group-hover:scale-110 dark:ring-sky-600"
                            />
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600">
                            {b.name}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5 ml-auto text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-sky-500 dark:text-slate-500 dark:group-hover:text-sky-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.placement ? (
                <div key={link.label} className="space-y-2">
                  {/* Placements Accordion */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={togglePlacementsMobileAccordion}
                  >
                    <span>Placements</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`h-5 w-5 transition-transform ${
                        isPlacementsMobileOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  {isPlacementsMobileOpen && (
                    <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto pr-1">
                      {placementLinks.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={closeSidebar}
                          className="block rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                        >
                          <p>{item.label}</p>
                          <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.cta ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeSidebar}
                  className="block rounded-2xl bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeSidebar}
                  className={`block rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    location.pathname === link.to
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}

            {/* Authenticated User Profile */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={goToProfile}
                className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {userLabel}
              </button>
            )}
          </nav>

          {/* Footer - Theme Toggle & Logout */}
          <div className="mt-6 space-y-3">
            <ThemeToggle />
            {isAuthenticated && (
              <button
                type="button"
                className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-backdrop-fade"
            aria-hidden
            onClick={closeSidebar}
          />
        )}

        {modalType === "enroll" && (
          <FormModal
            modalOpen={modalOpen}
            modalBranch={modalBranch}
            closeModal={closeModal}
            submitForm={submitForm}
            formData={formDataFormModal}
            setFormDataFormModal={setFormDataFormModal}
            countryOptions={countryOptions}
            handleFormChange={handleFormChange}
            loading={loading}
            courses={courses}
            showSuccess={showSuccess}
          />
        )}

        {modalType === "internship" && (
          <InternshipModal
            modalOpen={modalOpen}
            modalBranch={modalBranch}
            closeModal={closeModal}
            submitForm={submitForm}
            formData={formDataInternshipModal}
            handleFormChange={handleFormChange}
            handleFileChange={handleFileChange}
            loading={loading}
            courses={courses}
          />
        )}

        <main className="max-w-7xl mx-auto pt-12">
          <Outlet />
        </main>

        <Footer footerNav={footerNav} socials={socials} />
      </div>
      <FloatingAction />
    </>
  );
}

export default Layout;
