import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { notFound } from "next/navigation";
import CallButton from "@/components/CallButton";
import ImageGallery from "@/components/ImageGallery";
import { 
  Car, Store, MapPin, Phone, Star, ShieldCheck, Clock, 
  Fuel, Gauge, Calendar, Activity, Info 
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${title} | UPP-LINK Marketplace`,
    description: `Premium verified ${title.toLowerCase()} listing. Direct owner contact.`,
  };
}

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = query(collection(db, "listings"), where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) notFound();
  const data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as any;
  const isCar = data.type === 'selling';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* 🔥 PERFECT SPACING CONTAINER */}
      <div className="pt-24 lg:pt-32 pb-24">
        
        {/* 🔥 MOBILE HEADER */}
        <section className="lg:hidden px-6 pb-12 mb-12 bg-white/90 backdrop-blur-xl rounded-b-3xl shadow-xl border-b border-slate-200">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl mb-8 shadow-2xl mx-auto font-bold text-sm uppercase tracking-wide">
              {isCar ? <Car size={20} /> : <Store size={20} />}
              {isCar ? 'Car Listing' : 'Business Directory'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              {isCar ? data.listingTitle : data.businessName}
            </h1>
            <div className="flex flex-wrap gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 shadow-lg rounded-2xl border">
                <MapPin size={20} className="text-indigo-600" />
                <span className="font-bold text-slate-900">{data.location}</span>
              </div>
              {data.price && (
                <div className="text-3xl font-black text-emerald-600 bg-emerald-100 px-6 py-3 rounded-2xl shadow-lg">
                  ₹{data.price}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 🔥 DESKTOP HEADER */}
        <section className="hidden lg:block px-8 mb-16 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 hover:shadow-3xl transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-12 py-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-wide mb-6 shadow-xl">
                  {isCar ? <Car size={20} /> : <Store size={20} />}
                  <span>{isCar ? 'Premium Automobile' : 'Verified Business'}</span>
                </div>
                <h1 className="text-4xl xl:text-5xl font-black text-slate-900 leading-tight">
                  {isCar ? data.listingTitle : data.businessName}
                </h1>
              </div>
              <div className="text-right flex-shrink-0 min-w-[240px]">
                {data.price && (
                  <div className="text-5xl xl:text-6xl font-black text-emerald-600 mb-6 leading-none bg-emerald-50 px-8 py-4 rounded-3xl shadow-2xl">
                    ₹{data.price}
                  </div>
                )}
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl shadow-lg text-lg font-semibold text-slate-800">
                  <MapPin size={22} className="text-indigo-600" />
                  <span>{data.location}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 MAIN CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            
            {/* 🔥 MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-12 lg:space-y-16">
              
              {/* 🔥 SMART IMAGE BANNER - Images ya Animated Placeholder */}
              <div className="w-full bg-white border-2 border-slate-100 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                {data.images && data.images.length > 0 ? (
                  // 🔥 REAL IMAGES EXIST - Show ImageGallery
                  <ImageGallery images={data.images} />
                ) : (
                  // 🔥 NO IMAGES - Professional Animated Placeholder
                  <NoImageBanner 
                    isCar={isCar} 
                    businessName={isCar ? data.listingTitle : data.businessName} 
                  />
                )}
              </div>

              {/* 🔥 SPECIFICATIONS */}
              {isCar && (
                <div className="bg-white rounded-3xl p-10 lg:p-14 shadow-2xl border border-slate-100 hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-14 flex items-center gap-4">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Gauge className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                    </div>
                    Specifications
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { icon: Fuel, label: data.fuelType || 'Diesel', title: 'Fuel Type' },
                      { icon: Gauge, label: data.kmDriven || '28K KM', title: 'Odometer' },
                      { icon: Activity, label: data.transmission || 'Automatic', title: 'Transmission' },
                      { icon: Calendar, label: data.year || '2023', title: 'Model Year' }
                    ].map((spec, i) => (
                      <SpecCard key={i} icon={spec.icon} label={spec.label} title={spec.title} />
                    ))}
                  </div>
                </div>
              )}

              {/* 🔥 DESCRIPTION */}
              {(data.description || data.servicesOffered) && (
                <div className="bg-white rounded-3xl p-12 lg:p-16 shadow-2xl border border-slate-100 hover:shadow-3xl transition-all duration-500">
                  <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-12 flex items-center gap-4">
                    {isCar ? 
                      <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Info className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                      </div> : 
                      <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <ShieldCheck className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                      </div>
                    }
                    {isCar ? 'Vehicle Details' : 'Services Offered'}
                  </h3>
                  <div className="text-xl lg:text-2xl text-slate-700 leading-relaxed lg:leading-[1.8] max-w-4xl">
                    <p>{data.description || data.servicesOffered}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 🔥 SIDEBAR - STICKY */}
            <div className="lg:col-span-1 lg:sticky lg:top-32 lg:self-start space-y-10 lg:space-y-12">
              
              {/* 🔥 PRIMARY CALL BUTTON */}
              <div className="group">
                <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-2 shadow-3xl group-hover:shadow-4xl group-hover:scale-[1.02] transition-all duration-500 border border-indigo-500/30">
                  <a 
                    href={`tel:${data.contact}`}
                    className="block w-full bg-white text-indigo-700 rounded-2xl p-12 lg:p-14 text-center font-black text-2xl lg:text-3xl uppercase tracking-[0.1em] shadow-3xl hover:bg-indigo-50 hover:shadow-4xl hover:scale-[1.02] transition-all duration-500 border-4 border-indigo-200/50"
                  >
                    <Phone className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-8 text-indigo-600 shadow-3xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                    <div>Call Directly</div>
                    <div className="text-indigo-600 text-xl lg:text-2xl font-bold mt-3 opacity-90">Owner Contact</div>
                  </a>
                </div>
              </div>

              {/* 🔥 PRICE CARD */}
              {data.price && (
                <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-3xl p-12 lg:p-16 shadow-4xl hover:shadow-5xl hover:scale-[1.02] transition-all duration-500 text-center border-4 border-emerald-600/50">
                  <div className="text-6xl lg:text-7xl font-black leading-none mb-6 drop-shadow-4xl">₹{data.price}</div>
                  <div className="text-2xl uppercase tracking-[0.2em] font-black">Final Price</div>
                  <div className="text-emerald-100 text-lg font-semibold mt-2">Ready To Drive</div>
                </div>
              )}

              {/* 🔥 LOCATION */}
              <div className="bg-white rounded-3xl p-10 lg:p-12 shadow-3xl border border-slate-100/70 hover:shadow-4xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0">
                    <MapPin className="w-9 h-9 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <h4 className="font-black text-2xl lg:text-3xl text-slate-900">Location</h4>
                </div>
                <div className="space-y-4">
                  <div className="font-black text-2xl lg:text-3xl text-slate-900">{data.location}</div>
                  <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed max-h-20 overflow-hidden" title={data.address || data.location}>
                    {data.address || data.location}
                  </p>
                </div>
              </div>

              {/* 🔥 PREMIUM BADGE */}
              {data.isPremium && (
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white p-12 lg:p-16 rounded-3xl shadow-4xl hover:shadow-5xl hover:scale-[1.05] transition-all duration-500 text-center border-4 border-amber-400/50">
                  <Star className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-8 fill-current shadow-4xl drop-shadow-4xl" />
                  <div className="font-black text-3xl lg:text-4xl mb-4">Premium Verified</div>
                  <div className="text-2xl text-amber-100 uppercase tracking-[0.1em] font-bold">Admin Approved</div>
                </div>
              )}

              {/* 🔥 BUSINESS STATUS */}
              {!isCar && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-12 lg:p-16 rounded-3xl shadow-4xl hover:shadow-5xl transition-all duration-500 text-center">
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <Clock className="w-16 h-16 lg:w-20 lg:h-20 shadow-4xl" />
                    <span className="font-black text-3xl uppercase tracking-[0.2em]">Open 24/7</span>
                  </div>
                  <div className="font-black text-2xl lg:text-3xl mb-4">Service Ready</div>
                  <div className="text-xl text-emerald-100 font-bold">Contact Now</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CallButton phoneNumber={data.contact} />
    </div>
  );
}

// 🔥 SPEC CARD COMPONENT
function SpecCard({ icon: Icon, label, title }: { 
  icon: any; 
  label: string; 
  title: string 
}) {
  return (
    <div className="group relative p-10 lg:p-12 rounded-3xl bg-gradient-to-b from-slate-50/80 to-indigo-50/50 hover:from-indigo-50 hover:to-purple-50 border-2 border-slate-100/60 hover:border-indigo-300/70 hover:shadow-3xl hover:shadow-indigo-200/40 hover:-translate-y-4 transition-all duration-700 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
      <div className="relative z-10 text-center">
        <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-8 bg-white/90 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-700 border-4 border-white/50 group-hover:border-indigo-200/50">
          <Icon className="w-12 h-12 lg:w-14 lg:h-14 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
        </div>
        <div className="font-black text-2xl lg:text-3xl text-slate-900 mb-4 group-hover:text-indigo-600 transition-all leading-tight tracking-tight">
          {label}
        </div>
        <div className="text-lg text-slate-600 uppercase tracking-[0.2em] font-bold group-hover:text-indigo-500 transition-all">
          {title}
        </div>
      </div>
    </div>
  );
}

// 🔥 PROFESSIONAL ANIMATED NO-IMAGE BANNER
function NoImageBanner({ 
  isCar, 
  businessName 
}: { 
  isCar: boolean; 
  businessName: string 
}) {
  return (
    <div className="relative h-[280px] sm:h-[380px] lg:h-[520px] xl:h-[600px] overflow-hidden group">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/90 via-indigo-50/80 to-purple-50/70 animate-gradient-xy" />
      
      {/* Shine Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-full w-[200%] animate-shimmer" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="w-28 h-28 lg:w-36 lg:h-36 mb-8 p-6 lg:p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-white/50 animate-bounce-slow group-hover:scale-110 transition-all duration-700 flex items-center justify-center">
          {isCar ? (
            <Car className="w-16 h-16 lg:w-20 lg:h-20 text-indigo-600 drop-shadow-lg animate-pulse" />
          ) : (
            <Store className="w-16 h-16 lg:w-20 lg:h-20 text-emerald-600 drop-shadow-lg animate-pulse" />
          )}
        </div>
        
        {/* Business Title */}
        <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent animate-slide-up">
          {businessName}
        </h3>
        
        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-slate-600 font-semibold mb-6 animate-slide-up-delayed">
          {isCar 
            ? "High-Quality Photos Coming Soon" 
            : "Contact Owner for Gallery & Details"
          }
        </p>
        
        {/* CTA Badge */}
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-wider text-sm lg:text-base rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-pulse-slow border-2 border-indigo-500/30">
          <Phone className="w-5 h-5" />
          📞 Call Now for Details
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 lg:w-24 lg:h-24 bg-indigo-200/60 rounded-2xl animate-float blur-sm" />
      <div className="absolute bottom-20 right-10 w-16 h-16 lg:w-20 lg:h-20 bg-emerald-200/50 rounded-full animate-float-delayed blur-sm" />
    </div>
  );
}
