import Link from "next/link";
import { 
  MapPin, ArrowRight, Fuel, Gauge, Calendar, ShieldCheck, 
  Zap, Phone, Activity, UserCheck, Star, Sparkles, Crown,
  CarFront, Store, Image as ImageIcon, Heart, Clock, Verified,
  Wrench, Navigation2, Utensils, Building2, Stethoscope
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
  servicesOffered?: string;
  phone?: string;
  images?: string[];
  image?: string;
  isPremium?: boolean;
  rating?: number;
  reviews?: number;
}

interface ListingCardProps {
  data: ListingData;
  premium?: boolean;
  listView?: boolean;
  className?: string;
}

export default function ListingCard({ 
  data, 
  premium = false, 
  listView = false,
  className = ""
}: ListingCardProps) {
  const isBusiness = data.type === 'business';
  const hasImage = data.images?.[0] || data.image;
  const title = isBusiness ? data.businessName || data.location : data.listingTitle || data.title;
  const subtitle = isBusiness ? data.serviceCategory || 'Business' : `${data.make} ${data.model || ''}`.trim();
  const price = data.price;
  const phone = data.phone;

  // 🔥 FIXED: Dynamic business icon function
  const BusinessIcon = (() => {
    const categoryMap: Record<string, any> = {
      'car-service': Wrench,
      'taxi-services': Navigation2,
      'restaurant': Utensils,
      'hospital': Stethoscope,
      'salon-spa': () => null, // Scissors import issue
      'auto-dealer': Store
    };
    const IconComponent = categoryMap[data.serviceCategory || ''] || Store;
    return IconComponent;
  })();

  if (listView) {
    // 🔥 MOBILE LIST VIEW
    return (
      <Link href={`/listings/${data.slug || data.id || 'demo'}`} className="group block">
        <div className={`
          flex items-center gap-4 p-4 rounded-2xl border bg-white/95 backdrop-blur-sm 
          hover:shadow-xl hover:-translate-y-1 hover:border-orange-400/70 transition-all duration-300
          h-24 hover:h-28 overflow-hidden ${premium ? 'ring-2 ring-orange-200/50 border-orange-200/60' : 'border-gray-200/70'}
          ${className}
        `}>
          {/* COMPACT IMAGE */}
          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
            {hasImage ? (
              <img
                src={hasImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {isBusiness ? (
                  <BusinessIcon className="w-8 h-8 text-gray-400" />
                ) : (
                  <CarFront className="w-10 h-10 text-gray-400" />
                )}
              </div>
            )}
            
            {premium && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-base leading-tight line-clamp-1 pr-4 text-gray-900 group-hover:text-orange-600">
                {title}
              </h3>
              {premium && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex-shrink-0">
                  VIP
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 line-clamp-1 mb-2">{data.location}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isBusiness
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {subtitle || (isBusiness ? 'Business' : 'Car')}
                </div>
                {price && !isBusiness && (
                  <span className="text-orange-600 font-bold text-xs">₹{price}</span>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all ml-2 flex-shrink-0" />
            </div>

            {phone && (
              <div className="mt-1 pt-1 border-t border-gray-100 flex items-center gap-1.5 text-sm font-semibold text-green-600 group-hover:text-green-700">
                <Phone className="w-3.5 h-3.5" />
                <span className="truncate">{phone}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // 🔥 DESKTOP CARD VIEW
  return (
    <Link href={`/listings/${data.slug || data.id || 'demo'}`} className="group block h-full w-full">
      <div className={`
        relative h-full bg-white rounded-3xl overflow-hidden border shadow-xl hover:shadow-2xl hover:shadow-orange-500/25
        transition-all duration-500 ease-out hover:-translate-y-2 hover:border-orange-400/80 hover:scale-[1.02]
        ${premium 
          ? 'ring-4 ring-orange-100/70 bg-gradient-to-br from-orange-50/40 to-yellow-50/20 shadow-orange-300/40 hover:shadow-orange-500/50 border-orange-200/70' 
          : 'border-gray-200/80 hover:border-orange-300/70'
        }
        ${className}
      `}>
        
        {/* IMAGE SECTION */}
        <div className="relative h-52 lg:h-64 xl:h-72 overflow-hidden bg-gradient-to-br from-gray-50/80 to-gray-100/80">
          {premium && (
            <div className="absolute top-4 left-4 z-20 group-hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 text-white px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-wider shadow-2xl flex items-center gap-1.5 backdrop-blur-sm border border-white/50">
                <Crown className="w-4 h-4" />
                PREMIUM+
              </div>
            </div>
          )}

          {hasImage ? (
            <img
              src={hasImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 hover:brightness-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100/80 to-gray-200/80 backdrop-blur-sm">
              {isBusiness ? (
                <BusinessIcon className="w-24 h-24 text-gray-400/80" />
              ) : (
                <CarFront className="w-28 h-28 text-gray-400/80" />
              )}
            </div>
          )}

          {price && !isBusiness && (
            <div className="absolute top-4 right-4 bg-white/98 backdrop-blur-md border px-6 py-3 rounded-2xl shadow-2xl text-base font-black text-gray-900 border-gray-200/90 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-400 z-10">
              <div className="text-2xl text-orange-600">₹{price}</div>
              <div className="text-xs text-gray-600 font-medium -mt-1">Best Price</div>
            </div>
          )}

          {premium && (
            <div className="absolute bottom-4 left-4 bg-emerald-500/95 text-white px-4 py-2 rounded-2xl text-sm font-bold uppercase shadow-2xl backdrop-blur-sm border border-emerald-300/50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              VERIFIED
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 lg:p-8 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className={`px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wide border ${
                isBusiness
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {subtitle || (isBusiness ? 'Business' : 'Car')}
              </div>
              {data.rating && (
                <div className="flex items-center gap-1.5 text-sm bg-gray-100/80 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{data.rating.toFixed(1)} ({data.reviews || 0}+)</span>
                </div>
              )}
            </div>
            
            <h3 className="font-black text-xl lg:text-2xl xl:text-3xl leading-tight line-clamp-2 text-gray-900 hover:text-orange-600 transition-all group-hover:drop-shadow-sm">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 text-base text-gray-700 group-hover:text-gray-900 transition-colors">
            <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
            <span className="truncate font-semibold" title={data.location}>
              {data.location || data.address}
            </span>
          </div>

          {!isBusiness ? (
            <div className="grid grid-cols-3 gap-4 pt-2 pb-3">
              {[
                { icon: Gauge, label: data.kmDriven || 'Low KM', color: 'indigo' },
                { icon: Fuel, label: data.fuel || 'Petrol', color: 'emerald' },
                { icon: Activity, label: data.transmission || 'Manual', color: 'purple' }
              ].map(({ icon: Icon, label, color }, i) => (
                <div key={i} className="group/spec flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/60 hover:from-orange-50 hover:to-orange-25 hover:shadow-md transition-all border border-gray-100/60 backdrop-blur-sm h-full">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 truncate group-hover/spec:text-orange-600">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2.5 text-gray-700 font-semibold">
                  <Clock className="w-5 h-5" />
                  Open Now • Fast Response
                </span>
                {premium && (
                  <div className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-4 py-2 rounded-xl font-bold border border-orange-200">
                    <Zap className="w-4 h-4" />
                    Featured
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100/50">
            <div className="flex items-center gap-4 text-base text-gray-700 group-hover:text-gray-900 transition-all">
              <div className="flex items-center gap-2 p-2.5 bg-gray-100/80 hover:bg-red-100/80 rounded-xl group-hover:scale-105 transition-all cursor-pointer">
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                <span className="font-bold whitespace-nowrap">Save Listing</span>
              </div>
            </div>
            
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group-hover:rotate-12 z-10">
              <ArrowRight className="w-6 h-6 lg:w-7 lg:h-7 stroke-[2.5px]" />
            </div>
          </div>

          {/* MOBILE BOTTOM CALL BAR */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-md border-t border-gray-100/80 p-4 flex items-center justify-between rounded-b-3xl -mb-1 translate-y-full group-hover:translate-y-0 transition-all duration-500 z-20">
            {phone ? (
              <>
                <div className="flex items-center gap-3 text-base font-black text-green-600">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <span>Call {phone}</span>
                </div>
                <ArrowRight className="w-7 h-7 text-orange-600 group-hover:translate-x-2 transition-all" />
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 text-lg font-black text-gray-700 w-full">
                <Phone className="w-7 h-7 text-gray-500" />
                Contact Now
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
