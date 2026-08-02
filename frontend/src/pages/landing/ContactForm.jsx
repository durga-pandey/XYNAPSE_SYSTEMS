import React from 'react';
import { 
  Send, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  MessageSquare
} from "lucide-react";

const ContactForm = () => {
  return (
    <section className="relative bg-[#030712] py-32 px-6">
      <div className="max-w-[1350px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT: THE INTERFACE FORM (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative p-10 rounded-[40px] bg-white/[0.02] border border-white/5 overflow-hidden group">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Transmission.</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Protocol: Secure-Channel-v3</p>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Subject Name</label>
                      <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Email</label>
                      <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Message Payload</label>
                    <textarea rows="5" placeholder="Describe your mission..." className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold resize-none" />
                  </div>

                  <button className="group relative w-full overflow-hidden rounded-2xl py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all">
                    Initiate Transmission
                    <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-blue-500" /> End-to-End Encrypted Communication 
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: COMMUNICATION PROTOCOLS (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Direct Mail</p>
                  <p className="text-xl font-black text-white italic tracking-tighter group-hover:text-blue-400 transition-colors">support@xynapsesystems.in</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Command HQ</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">IsmailGanj, Kamta, Lucknow <br />Uttar Pradesh, IN</p>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[40px] bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                 <h5 className="text-white font-black text-xl italic uppercase tracking-tighter">Join the community.</h5>
                 <p className="text-slate-400 text-sm font-bold leading-relaxed">
                   Engage with 5000+ elite architects in our Discord and Twitter channels.
                 </p>
                 <div className="flex gap-4">
                    {['Twitter', 'Discord', 'LinkedIn'].map(social => (
                      <button key={social} className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        {social}
                      </button>
                    ))}
                 </div>
               </div>
               <Globe className="absolute -bottom-10 -right-10 text-white/5 w-40 h-40 group-hover:rotate-45 transition-transform duration-1000" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactForm;