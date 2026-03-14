"use client";

import { TrendingUp, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";

export default function MerchantBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="relative overflow-hidden bg-slate-900 rounded-[4rem] p-10 md:p-20 group">
        
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all duration-700"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content Area */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
              <Star size={14} fill="currentColor" /> Grow with UPP-LINK
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
              List your <br /> <span className="text-indigo-500">Business.</span> <br /> Dominate Korba.
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              Chhattisgarh ke sabse verified directory network se judiye. Apne products aur services ko premium customers tak pahunchaiye instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <button className="bg-indigo-600 text-white px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-indigo-900/50 flex items-center justify-center gap-3 active:scale-95">
                Join as Partner <ArrowRight size={18} />
              </button>
              <div className="flex -space-x-4 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                    {i === 4 ? "+50" : <div className="w-full h-full bg-indigo-200 rounded-full opacity-20"></div>}
                  </div>
                ))}
                <span className="ml-6 text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Merchants</span>
              </div>
            </div>
          </div>

          {/* Right: Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <TrendingUp className="text-emerald-400" />, title: "High Visibility", desc: "Google Search Ranking" },
              { icon: <ShieldCheck className="text-indigo-400" />, title: "Trust Verified", desc: "Elite Member Badge" },
              { icon: <Zap className="text-amber-400" />, title: "Instant Leads", desc: "Direct Call Connection" },
              { icon: <Star className="text-purple-400" />, title: "Premium UI", desc: "Look Better than Others" }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all">
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-white font-black uppercase italic tracking-tighter text-lg mb-2">{feature.title}</h4>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{feature.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}