import { 
  Facebook, Instagram, Linkedin, Send, Mail, Phone, MapPin, 
  ChevronRight, Globe, Github, Twitter, Cpu, Database, Cloud, Code2, 
  PhoneCall
} from "lucide-react";

const FooterLanding = () => {
  const socialLinks = [
    { icon: Facebook, link: "#", color: "hover:text-blue-500 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
    { icon: Instagram, link: "#", color: "hover:text-pink-500 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]" },
    { icon: Twitter, link: "#", color: "hover:text-sky-400 hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]" },
    { icon: Linkedin, link: "#", color: "hover:text-blue-700 hover:border-blue-700/50 hover:shadow-[0_0_20px_rgba(29,78,216,0.4)]" },
    { icon: Github, link: "#", color: "hover:text-white hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]" },
    { icon: Send, link: "#", color: "hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]" },
  ];

  const services = [
    "Enterprise AI Solutions", "Cloud-Native Infrastructure", "Custom ERP/CRM Systems",
     "Microservices Architecture",
    "FinTech API Integration", "Big Data Engineering",
    "DevOps Automation", "UI/UX Systems Design", "Mobile App Ecosystems"
  ];

  return (
    <footer className="relative bg-[#030712] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* SCANNER ANIMATION */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-0 w-[250px] h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-scan" />

      <div className="max-w-[1350px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* COL 1: BRAND & MISSION */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-black text-white tracking-tighter italic">
              XYNAPSE<span className="text-cyan-500 animate-pulse">.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              Leading the global transition to <span className="text-white">intelligent infrastructure</span>. We don't just build software; we architect the backbone of modern digital enterprises through elite engineering and relentless innovation.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((soc, i) => (
                <a key={i} href={soc.link} className={`p-3 bg-white/5 rounded-2xl border border-white/10 text-white transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/10 ${soc.color}`}>
                  <soc.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* COL 2: SERVICES (DATA LOADED) */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" /> Industry Services
            </h4>
            <ul className="grid grid-cols-1 gap-y-3">
              {services.map((item) => (
                <li key={item} className="group flex items-center text-slate-500 hover:text-cyan-400 font-bold text-[13px] transition-all duration-300 cursor-pointer">
                  <ChevronRight size={14} className="w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-cyan-500 mr-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: ACADEMY (FULL DATA) */}
          <div className="lg:col-span-1 space-y-10">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" /> Academy Tracks
            </h4>
            
            <div className="space-y-6">
              <div className="group cursor-pointer border-l-2 border-white/5 hover:border-cyan-500 pl-4 transition-all">
                <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Database size={12} /> AI & Data Science
                </p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed group-hover:text-white">NLP, Computer Vision, Big Data, Predictive Analytics, Neural Networks.</p>
              </div>

              <div className="group cursor-pointer border-l-2 border-white/5 hover:border-purple-500 pl-4 transition-all">
                <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Cloud size={12} /> Cloud & DevOps
                </p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed group-hover:text-white">AWS Architecting, Kubernetes, Terraform, CI/CD Pipelines, Azure Cloud.</p>
              </div>

              <div className="group cursor-pointer border-l-2 border-white/5 hover:border-blue-500 pl-4 transition-all">
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={12} /> Software Engineering
                </p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed group-hover:text-white">Python Backend, GoLang Systems, React Ecosystem, Microservices.</p>
              </div>
            </div>
          </div>

          {/* COL 4: CONTACT */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" /> Global Office
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all text-white">
                  <MapPin size={20} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Tech District</p>
                  <p className="text-slate-500">Lucknow, Uttar Pradesh, 226028 India</p>
                </div>
              </div>
              <div className="flex gap-4 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all text-white">
                  <Mail size={20} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Email Us</p>
                  <p className="text-slate-500">support@xynapsesystems.in</p>
                </div>
              </div>
              <div className="flex gap-4 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all text-white">
                  <PhoneCall size={20} />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Call us</p>
                  <p className="text-slate-500">+91 7309900393</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER BOTTOM */}
        <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-black text-slate-600 tracking-[0.4em] uppercase">© 2026 XYNAPSE</div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Globe size={14} className="animate-spin-slow text-cyan-500" /> Distributed Node: IN-01
            </div>
          </div>

          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {["Security", "Privacy", "Architecture"].map(t => (
              <span key={t} className="hover:text-white cursor-pointer transition-all hover:shadow-[0_0_10px_white]">{t}</span>
            ))}
          </div>

          <div className="relative flex items-center gap-3 px-6 py-3 bg-[#0a0f1d] rounded-full border border-green-500/30 text-[10px] font-black text-green-500 uppercase">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="relative z-10">Systems Status: 100% Operational</span>
            <div className="absolute inset-0 bg-green-500/5 blur-md rounded-full" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { left: -250px; }
          100% { left: 100%; }
        }
        .animate-scan { animation: scan 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </footer>
  );
};

export default FooterLanding;