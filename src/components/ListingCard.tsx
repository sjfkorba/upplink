import Link from "next/link";
import { 
  MapPin, ArrowUpRight, Fuel, Gauge, Calendar, ShieldCheck, 
  Zap, PhoneCall, Activity, UserCheck, Star, Sparkles, Crown,
  CarFront, Store, Image as ImageIcon
} from "lucide-react";

interface ListingData {
  id?: string;
  slug?: string;
  type: 'selling' | 'business';
  title?: string;
  listingTitle?: string;
  businessName?: string;
  make?: string;
  model?: string;
  year?: string;
  modelYear?: string;
  kmDriven?: string;
  fuel?: string;
  transmission?: string;
  price?: string;
  location?: string;
  address?: string;
  serviceCategory?: string;
  images?: string[];
  image?: string;
  isPremium?: boolean;
}

interface ListingCardProps {
  data: ListingData;
  premium?: boolean;
}

export default function ListingCard({ data, premium = false }: ListingCardProps) {
  const isBusiness = data.type === 'business';
  const hasImage = data.images?.[0] || data.image;
  const title = isBusiness ? data.businessName || data.location : data.listingTitle || data.title;
  const subtitle = isBusiness ? data.serviceCategory || 'Business Directory' : data.make;
  const price = data.price;

  return (
    <Link href={`/listings/${data.slug || data.id || 'demo'}`} className="group block h-full w-full">
      <div className={`
        relative h-full bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border-2 shadow-2xl hover:shadow-3xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]
        transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-indigo-300
        ${premium 
          ? 'border-amber-300/70 bg-gradient-to-br from-amber-50/80 via-white/90 to-indigo-50/60 shadow-[0_35px_60px_rgba(251,191,36,0.3)] hover:shadow-[0_45px_80px_rgba(251,191,36,0.4)]' 
          : 'border-slate-100/60 hover:border-indigo-200/80'
        }
      `}>
        
        {/* 🔥 SHIMMER ANIMATION */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
          -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100" />

        {/* 🔥 VISUAL SECTION */}
        <div className={`relative h-48 md:h-52 overflow-hidden ${premium ? 'ring-2 ring-amber-200/50' : ''}`}>
          
          {/* Premium Crown Badge */}
          {premium && (
            <div className="absolute top-4 right-4 z-20 group-hover:scale-110 transition-all duration-300">
              <div className="relative bg-gradient-to-r from-amber-400 to-yellow-400 p-2 rounded-2xl shadow-2xl border-2 border-white/50">
                <Crown className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse whitespace-nowrap">
                  VIP
                </span>
              </div>
            </div>
          )}

          {/* 🔥 IMAGE / BUSINESS BACKGROUND */}
          {isBusiness ? (
            /* BUSINESS MASTERPIECE */
            <div className="h-full bg-gradient-to-br from-slate-900/95 via-indigo-900/30 to-purple-900/40 p-8 flex flex-col justify-between relative overflow-hidden">
              
              {/* Animated Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-12 left-12 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping [animation-delay:0s]"></div>
                <div className="absolute top-32 right-16 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping [animation-delay:1s]"></div>
                <div className="absolute bottom-20 left-20 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping [animation-delay:2s]"></div>
              </div>

              {/* Header Badge */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-gradient-to-r from-indigo-500/40 to-purple-500/40 backdrop-blur-xl p-3.5 rounded-2xl border border-indigo-500/50 shadow-xl">
                  <Sparkles className="w-6 h-6 text-indigo-200" strokeWidth={2} />
                </div>
                {premium && (
                  <div className="bg-gradient-to-r from-amber-500/95 to-yellow-500/95 text-slate-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-amber-300/70 animate-pulse">
                    🔥 PREMIUM LISTING
                  </div>
                )}
              </div>

              {/* Business Title */}
              <div className="relative z-10 mt-6">
                <h3 className="text-2xl md:text-[28px] font-black bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight tracking-[-0.03em] line-clamp-2 group-hover:scale-[1.02] transition-transform">
                  {data.businessName}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-indigo-300 font-bold text-sm uppercase tracking-widest bg-indigo-500/20 px-4 py-2 rounded-2xl backdrop-blur-sm border border-indigo-400/40">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Verified Business</span>
                  {premium && <Star className="w-4 h-4 fill-amber-400 text-amber-400 ml-auto" />}
                </div>
              </div>
            </div>
          ) : (
            /* CAR GALLERY */
            <div className="h-full relative">
              {/* Fallback Background */}
              {!hasImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-100 to-emerald-100 flex items-center justify-center">
                  <CarFront className="w-24 h-24 text-slate-400/70 animate-pulse" />
                </div>
              )}
              
              {/* Safe Image */}
              {hasImage && (
                <img
                  src={hasImage}
                  alt={title || 'Car image'}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.querySelector('div')!.style.display = 'flex';
                  }}
                  loading="lazy"
                />
              )}

              {/* Floating Price */}
              {price && (
                <div className="absolute top-6 right-6 z-20 bg-white/98 backdrop-blur-2xl border-2 border-white/60 shadow-2xl px-6 py-4 rounded-3xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/20">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white px-6 py-3 rounded-2xl uppercase tracking-tight shadow-lg whitespace-nowrap">
                    ₹{price}
                  </span>
                </div>
              )}

              {/* Model Strip */}
              <div className="absolute bottom-6 left-6 right-6 z-10 bg-gradient-to-r from-indigo-600/95 to-purple-600/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/50">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6" strokeWidth={2.5} />
                    <span className="font-black text-xl uppercase tracking-tight">{data.year || data.modelYear || 'New'}</span>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-bold uppercase tracking-wider">
                    {data.make}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 🔥 CONTENT SECTION */}
        <div className="p-7 md:p-9 flex-1 flex flex-col relative z-20">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-7 pb-6 border-b border-slate-100/60">
            <div className="space-y-2">
              <span className={`inline-block px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm ${
                isBusiness
                  ? 'bg-gradient-to-r from-indigo-100/80 to-purple-100/80 text-indigo-800 border border-indigo-200/70'
                  : 'bg-gradient-to-r from-emerald-100/80 to-green-100/80 text-emerald-800 border border-emerald-200/70'
              } backdrop-blur-sm`}>
                {subtitle}
              </span>
              <h4 className="text-xl md:text-2xl lg:text-[27px] font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-all line-clamp-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text drop-shadow-sm">
                {title}
              </h4>
            </div>
            
            {/* Animated CTA */}
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-50/80 to-indigo-50/80 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-xl border border-slate-200/70 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-2xl group-hover:scale-110 group-hover:border-indigo-400/70 transition-all duration-500 origin-center">
              <ArrowUpRight size={20} className="group-hover:rotate-45 transition-all duration-500" strokeWidth={2.5} />
            </div>
          </div>

          {/* 🔥 DYNAMIC BOTTOM SECTION */}
          {!isBusiness ? (
            /* CAR SPECS */
            <div className="grid grid-cols-3 gap-4 pt-6 bg-gradient-to-r from-slate-50/70 to-indigo-50/40 rounded-2xl backdrop-blur-sm border border-slate-100/50 mt-auto hover:shadow-inner transition-all">
              <SpecItem 
                icon={<Gauge size={16} className="text-indigo-500 drop-shadow-sm" />} 
                label={data.kmDriven || '25K KM'} 
                premium={premium}
              />
              <SpecItem 
                icon={<Fuel size={16} className="text-emerald-500 drop-shadow-sm" />} 
                label={data.fuel || 'Diesel'} 
                premium={premium}
              />
              <SpecItem 
                icon={<Activity size={16} className="text-purple-500 drop-shadow-sm" />} 
                label={data.transmission || 'Automatic'} 
                premium={premium}
              />
            </div>
          ) : (
            /* BUSINESS CONTACT */
            <div className="mt-auto pt-8 space-y-5 border-t-2 border-gradient-to-r from-indigo-100/70 via-slate-100/50 to-purple-100/70">
              
              {/* Location */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-2xl backdrop-blur-xl group-hover:shadow-lg group-hover:shadow-indigo-200/30 transition-all border border-indigo-100/50 hover:border-indigo-200/60">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-slate-800 text-base tracking-wide truncate" title={data.address || data.location}>
                  {data.address || data.location}
                </span>
              </div>

              {/* 🔥 EPIC CALL BUTTON */}
              <button className="w-full group/btn bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white py-5 px-8 rounded-3xl font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-3xl hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] active:scale-95 active:shadow-xl transition-all duration-400 border border-indigo-500/50 backdrop-blur-xl flex items-center justify-center gap-3">
                <PhoneCall className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                <span>Call Directly</span>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ml-2 group-hover:bg-white/40 group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-4 h-4" strokeWidth={3} />
                </div>
              </button>
            </div>
          )}

          {/* 🔥 Premium Glow Effects */}
          {premium && (
            <>
              <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-amber-400 via-yellow-400 to-orange-400 shadow-2xl -skew-x-12 origin-left animate-pulse" />
              <div className="absolute top-2 right-2 w-8 h-8 bg-amber-400/60 rounded-2xl blur-xl animate-ping" />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// 🔥 PERFECT SPEC COMPONENT
function SpecItem({ icon, label, premium = false }: { 
  icon: React.ReactNode; 
  label: string; 
  premium?: boolean 
}) {
  return (
    <div className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl backdrop-blur-sm bg-white/70 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-slate-100/60 hover:border-indigo-200/70 hover:shadow-lg hover:shadow-indigo-100/50 hover:scale-[1.05]">
      <div className={`w-12 h-12 bg-gradient-to-br from-slate-50/80 to-indigo-50/60 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-300 border border-slate-100/40 hover:border-indigo-200/60 ${premium ? 'ring-1 ring-amber-200/50' : ''}`}>
        {icon}
      </div>
      <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-800 text-center leading-tight group-hover:text-indigo-600 transition-colors">
        {label}
      </span>
    </div>
  );
}
