import Link from "next/link";
import { 
  MapPin, ArrowRight, Fuel, Gauge, Calendar, ShieldCheck, 
  Zap, Phone, Activity, UserCheck, Star, Sparkles, Crown,
  CarFront, Store, Image as ImageIcon, Heart, Clock, Verified
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
  rating?: number;
  reviews?: number;
}

interface ListingCardProps {
  data: ListingData;
  premium?: boolean;
}

export default function ListingCard({ data, premium = false }: ListingCardProps) {
  const isBusiness = data.type === 'business';
  const hasImage = data.images?.[0] || data.image;
  const title = isBusiness ? data.businessName || data.location : data.listingTitle || data.title;
  const subtitle = isBusiness ? data.serviceCategory || 'Business' : `${data.make} ${data.model || ''}`.trim();
  const price = data.price;

  return (
    <Link href={`/listings/${data.slug || data.id || 'demo'}`} className="group block h-full w-full">
      <div className={`
        relative h-full bg-white rounded-2xl overflow-hidden border shadow-lg hover:shadow-2xl hover:shadow-orange-500/20
        transition-all duration-500 ease-out hover:-translate-y-1 hover:border-orange-400/70
        ${premium 
          ? 'ring-2 ring-orange-300/50 bg-gradient-to-br from-orange-50/50 to-yellow-50/30 shadow-orange-200/50 hover:shadow-orange-400/40 border-orange-200/60' 
          : 'border-gray-200/70 hover:border-orange-300/60'
        }
      `}>
        
        {/* 🔥 OLX-STYLE IMAGE SECTION - PERFECT RATIO */}
        <div className="relative h-48 md:h-56 lg:h-60 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          
          {/* Premium Badge - JustDial Style */}
          {premium && (
            <div className="absolute top-3 left-3 z-20 group-hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                PREMIUM
              </div>
            </div>
          )}

          {/* 🔥 IMAGE / FALLBACK - OLX Perfect */}
          {hasImage ? (
            <img
              src={hasImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 hover:brightness-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              {isBusiness ? (
                <Store className="w-20 h-20 text-gray-400" />
              ) : (
                <CarFront className="w-24 h-24 text-gray-400" />
              )}
            </div>
          )}

          {/* 🔥 PRICE BADGE - OLX/JustDial Hybrid */}
          {price && !isBusiness && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-gray-900 border-gray-200/80 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
              <span className="text-lg font-black text-orange-600">₹{price}</span>
            </div>
          )}

          {/* 🔥 NEW/VERIFIED - IndiaMart Style */}
          {premium && (
            <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
              <Verified className="w-3 h-3 inline mr-1" />
              VERIFIED
            </div>
          )}
        </div>

        {/* 🔥 CONTENT - JustDial Clean Layout */}
        <div className="p-5 md:p-6 lg:p-7 space-y-4">
          
          {/* 🔥 TITLE SECTION - Perfect Typography */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isBusiness
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {subtitle || (isBusiness ? 'Business' : 'Car')}
              </div>
              {data.rating && (
                <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{data.rating.toFixed(1)} ({data.reviews || 0}+)</span>
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg md:text-xl lg:text-2xl leading-tight line-clamp-2 text-gray-900 hover:text-orange-600 transition-colors group-hover:font-black">
              {title}
            </h3>
          </div>

          {/* 🔥 LOCATION - JustDial Style */}
          <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate" title={data.location}>
              {data.location || data.address}
            </span>
          </div>

          {/* 🔥 CAR SPECS / BUSINESS INFO - OLX Grid */}
          {!isBusiness ? (
            <div className="grid grid-cols-3 gap-3 pt-2 pb-1">
              {[
                { icon: Gauge, label: data.kmDriven || 'Low KM', color: 'indigo' },
                { icon: Fuel, label: data.fuel || 'Petrol', color: 'green' },
                { icon: Activity, label: data.transmission || 'Manual', color: 'purple' }
              ].map(({ icon: Icon, label, color }, i) => (
                <div key={i} className="group/spec flex items-center gap-2 p-2.5 rounded-xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-gray-100 hover:to-white hover:shadow-sm transition-all border border-gray-100/50">
                  <div className={`w-8 h-8 bg-${color}-50 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 truncate">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            /* 🔥 BUSINESS HOURS/CALL - IndiaMart Style */
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  Open Now
                </span>
                {premium && (
                  <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-bold">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 🔥 CTA SECTION - Perfect Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                Save {premium ? 'VIP' : ''}
              </span>
            </div>
            
            {/* 🔥 ARROW CTA - OLX Style */}
            <div className="w-11 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group-hover:rotate-12">
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* 🔥 MOBILE BOTTOM BAR - JustDial Perfect */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-3 flex items-center justify-between rounded-b-2xl -m-2 translate-y-full group-hover:translate-y-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Phone className="w-4 h-4 text-green-600" />
            Call Now
          </div>
          <div className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <ArrowRight className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
