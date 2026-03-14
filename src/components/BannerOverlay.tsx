import { MapPin, Tag, Calendar, Fuel } from "lucide-react";

export default function BannerOverlay({ data }: { data: any }) {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl group shadow-2xl">
      {/* Background Image */}
      <img 
        src={data.image || "/placeholder.jpg"} 
        alt={data.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent shadow-inner"></div>

      {/* Floating Badge (Top Left) */}
      <div className="absolute top-6 left-6 flex gap-2">
        <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          {data.type === 'car' ? "Verified Car" : data.bizCategory}
        </span>
        {data.isPremium && (
          <span className="bg-amber-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            ★ Featured
          </span>
        )}
      </div>

      {/* Main Content (Bottom Left) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
        <h1 className="text-3xl md:text-6xl font-black uppercase italic leading-none tracking-tighter drop-shadow-md">
          {data.title}
        </h1>
        
        <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-8">
          {/* Price Tag */}
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md text-amber-400">
                <Tag size={20} />
            </div>
            <span className="text-2xl md:text-3xl font-black">₹{data.price}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={18} className="text-indigo-400" />
            <span className="text-sm md:text-lg font-medium">{data.location}</span>
          </div>

          {/* Car Specific Details (Conditional) */}
          {data.type === 'car' && (
            <div className="flex gap-4 border-l border-white/20 pl-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="text-sm font-bold">{data.modelYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel size={18} />
                <span className="text-sm font-bold">{data.fuel}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}