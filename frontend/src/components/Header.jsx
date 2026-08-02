import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MAIN NAV BAR - Fixed Height to kill extra space */}
      <nav className="absolute top-0 left-0 w-full z-50 h-[60px] md:h-[90px] flex justify-between items-center px-6 md:px-12 lg:px-[110px] border-b border-white/5 bg-[#030712]/50 backdrop-blur-md md:bg-transparent md:border-none">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/Logo.png"
            alt="Xynapse Systems Logo"
            className="h-8 md:h-24 w-auto object-contain"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-xs uppercase text-white tracking-widest font-bold opacity-60">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link
            to="/about-us"
            className="hover:text-cyan-400 transition-colors"
          >
            About
          </Link>
          <Link to="/alumni" className="hover:text-cyan-400 transition-colors">
            Alumni
          </Link>
          <Link to="/contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#030712] border-l border-white/10 z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <span className="text-cyan-500 font-black text-sm tracking-tighter">
              XYNAPSE SYSTEMS
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white p-1 bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col gap-1">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about-us" },
              { name: "Alumni", path: "/placements/alumni" },
              { name: "Recruiters", path: "/placements/recruiters" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex justify-between items-center p-4 text-white text-sm font-bold border-b border-white/5 hover:bg-white/5 rounded-xl transition-all"
              >
                {link.name}
                <ChevronRight size={16} className="text-cyan-500" />
              </Link>
            ))}
          </div>

          {/* Drawer Footer info */}
          <div className="mt-auto pb-4">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase font-bold text-center">
              © 2026 Xynapse Systems
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
