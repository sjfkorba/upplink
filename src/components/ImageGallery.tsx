"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ImageGallery({ images = [] }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return (
    <div className="aspect-video bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
      No Images Available
    </div>
  );

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-6 group">
      {/* Main Display Image */}
      <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-indigo-100 border border-white">
        <img 
          src={images[index]} 
          alt={`Gallery Image ${index + 1}`} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
        />
        
        {/* Navigation Arrows (Only on Hover) */}
        <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={prev} className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Maximize2 size={12} /> {index + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-2xl overflow-hidden border-2 transition-all 
            ${index === i ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
          </button>
        ))}
      </div>
    </div>
  );
}