"use client";
import { Car, Bus, Stethoscope, Zap, Armchair, Gem } from "lucide-react";

// 1. Props Interface Define Karein
interface CategoryBarProps {
  activeFilter: string;
  onFilterChange: (val: string) => void;
}

const categories = [
  { name: "All", icon: null, slug: "all" }, // Added "All" for reset
  { name: "Cars", icon: <Car size={20} />, slug: "car" },
  { name: "Taxi", icon: <Bus size={20} />, slug: "taxi" },
  { name: "Hospitals", icon: <Stethoscope size={20} />, slug: "hospital" },
  { name: "Electronics", icon: <Zap size={20} />, slug: "electronics" },
  { name: "Furniture", icon: <Armchair size={20} />, slug: "furniture" },
  { name: "Jewellery", icon: <Gem size={20} />, slug: "jewellery" },
];

export default function CategoryBar({ activeFilter, onFilterChange }: CategoryBarProps) {
  return (
    <section className="-mt-12 px-4 relative z-20">
      <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto pb-6 no-scrollbar">
        {categories.map((cat, i) => (
          <button 
            key={i} 
            onClick={() => onFilterChange(cat.slug)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border transition-all group
            ${activeFilter === cat.slug 
              ? 'bg-indigo-600 border-indigo-600 scale-105 shadow-indigo-200' 
              : 'bg-white border-slate-50 hover:border-indigo-400 hover:scale-105'}
            `}
          >
            <div className={`transition-colors duration-300
              ${activeFilter === cat.slug ? 'text-white' : 'text-slate-300 group-hover:text-indigo-600'}
            `}>
              {cat.icon || <span className="text-lg font-black italic">U</span>}
            </div>
            <span className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors
              ${activeFilter === cat.slug ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}
            `}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}