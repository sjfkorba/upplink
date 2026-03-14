"use client";

import { useState } from "react";
import { Search, MapPin, RotateCcw } from "lucide-react";

interface HeroSearchProps {
  onSearch: (val: string) => void;
  currentValue: string;
}

export default function HeroSearch({ onSearch, currentValue }: HeroSearchProps) {
  return (
    <div className="mt-16 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-stretch bg-white rounded-[2.5rem] p-2 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.15)] border border-slate-50 transition-all focus-within:ring-8 focus-within:ring-indigo-50/50">
        
        {/* KEYWORD SECTION */}
        <div className="flex-[2] flex items-center px-8 gap-4 py-4 md:py-0 border-b md:border-b-0 md:border-r border-slate-100 group">
          <Search className="text-indigo-600 transition-transform group-focus-within:scale-110" size={24} strokeWidth={3} />
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 text-left">Search</span>
            <input 
              type="text" 
              value={currentValue}
              onChange={(e) => onSearch(e.target.value)} // 🔥 Connects to Home state
              placeholder="Cars, Doctors, Services..." 
              className="w-full bg-transparent outline-none font-black text-slate-900 placeholder:text-slate-200 text-xl tracking-tighter" 
            />
          </div>
        </div>

        {/* LOCATION SECTION */}
        <div className="flex-1 flex items-center px-8 gap-4 py-4 md:py-0 group">
          <MapPin className="text-slate-300 transition-colors group-focus-within:text-indigo-500" size={24} />
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1 text-left">In City</span>
            <input 
              type="text" 
              readOnly
              value="Korba, CH" 
              className="w-full bg-transparent outline-none font-black text-slate-900 text-lg tracking-tighter cursor-default" 
            />
          </div>
        </div>

        {/* RESET / FIND BUTTON */}
        <button 
          onClick={() => onSearch("")} // 🔥 Clears search
          className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-slate-900 shadow-xl shadow-indigo-200 transition-all active:scale-95"
        >
          <RotateCcw size={16} />
          Find Now
        </button>
      </div>
    </div>
  );
}