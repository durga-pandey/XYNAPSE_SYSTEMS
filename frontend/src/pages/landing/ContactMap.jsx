import React from "react";
import { MapPin, Navigation, Crosshair, Globe, Shield } from "lucide-react";

const ContactMap = () => {
  const latitude = "26.8467";
  const longitude = "80.9462";

  const embedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14234.67648780552!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

  return (
    <section className="relative bg-[#030712] py-32 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/20 rounded-full animate-ping-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full animate-ping-slower" />
      </div>

      <div className="max-w-[1350px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.8em] mb-4 flex items-center gap-3">
                <Crosshair size={14} /> HQ Coordinates
              </h2>
              <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-6 italic uppercase">
                THE CORE <br /> <span className="text-blue-500">SECTOR.</span>
              </h3>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                Our Physical Node is anchored in Lucknow, the rising tech hub of
                North India. Strategically positioned for high-scale
                architectural collaboration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6 group hover:border-blue-500/30 transition-all">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Navigation size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Global Lat/Long
                  </p>
                  <p className="text-white font-black text-sm italic">
                    {latitude}° N, {longitude}° E
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6 group hover:border-blue-500/30 transition-all">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Region Node
                  </p>
                  <p className="text-white font-black text-sm italic">
                    Lucknow, UP, IN
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-5 bg-blue-600 hover:bg-white text-white hover:text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="lg:col-span-8 relative">
            <div className="relative aspect-video lg:aspect-square max-h-[600px] w-full rounded-[40px] overflow-hidden border border-white/10 group bg-slate-900 shadow-2xl">
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full grayscale invert-[0.9] contrast-[1.2] opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>

              <div className="absolute inset-0 pointer-events-none border-[15px] border-[#030712] rounded-[40px] z-10" />

              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30 blur-sm animate-scan z-20 pointer-events-none" />

              <div className="absolute bottom-8 left-8 p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 z-20 flex items-center gap-3">
                <Globe size={16} className="text-blue-500 animate-spin-slow" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Lucknow Node: Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-ping-slow { animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping 5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </section>
  );
};

export default ContactMap;
