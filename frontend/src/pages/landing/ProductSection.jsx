import { motion } from "framer-motion";
import { Code2, Users, ExternalLink, Cpu, Terminal, ShieldCheck } from "lucide-react";

const products = [
  {
    name: "XYNAPSE LAB",
    tagline: "The XYNAPSE LAB for Next-Gen Architects",
    desc: "A high-performance coding platform by XYNAPSE LAB. Master DSA, solve company-specific challenges, and read elite XYNAPSE LAB technical articles. Built for those who aim for FAANG.",
    icon: <Code2 className="text-cyan-400" size={32} />,
    features: ["Real-time Compiler", "AI Debugging", "Architectural Articles"],
    color: "from-cyan-500/20 to-blue-600/20",
    border: "group-hover:border-cyan-500/50",
    glow: "bg-cyan-500/10",
    link: "/upcoding"
  },
  {
    name: "XYNAPSE HRMS",
    tagline: "Enterprise Resource Management",
    desc: "A robust, scalable HRMS solution for modern global enterprises. From automated payroll to decentralized talent management, we've engineered the backbone of HR operations.",
    icon: <Users className="text-purple-400" size={32} />,
    features: ["Automated Payroll", "Talent Analytics", "Secure Cloud Data"],
    color: "from-purple-500/20 to-pink-600/20",
    border: "group-hover:border-purple-500/50",
    glow: "bg-purple-500/10",
    link: "/hrms"
  }
];

const ProductSection = () => {
  return (
    <section className="relative w-full bg-[#030712] py-32 overflow-hidden">
      {/* Background Blobs - Consistency maintained */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-[1350px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="mb-20 text-center lg:text-left">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-cyan-500 font-black uppercase tracking-[0.6em] text-xs mb-4"
          >
            Our Ecosystem
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter"
          >
            XYNAPSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-600">Powerhouse</span>
          </motion.h2>
        </div>

        {/* Product Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card Container */}
              <div className={`relative h-full p-10 md:p-14 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl transition-all duration-500 ${product.border} hover:shadow-[0_0_100px_-20px_rgba(255,255,255,0.1)]`}>
                
                {/* Glow Background inside card */}
                <div className={`absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${product.color}`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                      {product.icon}
                    </div>
                    <motion.a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 45 }}
                      className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all"
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-cyan-400 font-bold mb-6 tracking-wide uppercase text-sm">
                    {product.tagline}
                  </p>
                  
                  <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                    {product.desc}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    {product.features.map((feat, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-300">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <button className="flex items-center gap-3 text-white font-black group/btn">
                    <span className="border-b-2 border-white/20 group-hover/btn:border-white transition-all py-1">
                      Explore Product
                    </span>
                    <Cpu size={18} className="animate-pulse" />
                  </button>
                </div>

                {/* Animated Lines/Decorations */}
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Terminal size={120} strokeWidth={0.5} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;