"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutGrid, Car, Building2, MapPin, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.addEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <LayoutGrid size={20} /> },
    { name: "Premium Cars", href: "/cars", icon: <Car size={20} /> },
    { name: "Business", href: "/business", icon: <Building2 size={20} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-xl py-4 lg:py-5 shadow-xl border-b border-slate-100/50" 
        : "bg-transparent py-6 lg:py-7"
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-12 flex items-center justify-between">
        
        {/* 🔥 CLEAN LOGO */}
        <Link href="/" className="group flex items-center gap-3 p-2 lg:p-3 rounded-2xl hover:bg-slate-50/50 transition-all duration-300">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <div className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white rounded-lg rotate-6"></div>
          </div>
          <div>
            <span className="text-xl lg:text-2xl xl:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">
              UPP-LINK
            </span>
            <span className="text-indigo-600 text-sm lg:text-base font-bold">Marketplace</span>
          </div>
        </Link>

        {/* 🔥 DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-1 bg-white/60 backdrop-blur-xl p-2 rounded-3xl border border-slate-200/50 shadow-lg">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-base uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                pathname === link.href 
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/50" 
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-current opacity-70 group-hover:opacity-100 transition-opacity"></span>
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* 🔥 LOCATION & SEARCH */}
        <div className="hidden xl:flex items-center gap-6 bg-white/70 backdrop-blur-xl p-4 rounded-3xl border border-slate-100 shadow-xl">
          <div className="text-right">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Location</div>
            <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <MapPin size={18} className="text-indigo-500" />
              Korba, CG
            </div>
          </div>
          
          <div className="w-px h-8 bg-slate-200"></div>
          
          <div className="relative">
            <Search className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              placeholder="Quick search..."
              className="w-64 pl-12 pr-6 py-3 bg-white/80 rounded-2xl border border-slate-100 focus:border-indigo-300 focus:outline-none font-semibold text-slate-700 shadow-lg hover:shadow-xl transition-all"
            />
          </div>
        </div>

        {/* 🔥 MOBILE ACTIONS */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Link 
            href="/search" 
            className="p-3 lg:p-3.5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-slate-100 active:scale-95"
          >
            <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
          </Link>
          
          <button className="lg:hidden p-3 lg:p-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
