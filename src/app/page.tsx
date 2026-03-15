"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import { 
  Car, Store, Search, Star, Zap, MapPin, Sparkles, ChevronRight, ShieldCheck, 
  TrendingUp, Users, Award, Zap as LightningBolt 
} from "lucide-react";

export default function Home() {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = allListings.filter((item) => {
    const typeMatch = filter === "all" || item.type === filter;
    const searchStr = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchStr || 
      item.listingTitle?.toLowerCase().includes(searchStr) ||
      item.businessName?.toLowerCase().includes(searchStr) ||
      item.location?.toLowerCase().includes(searchStr);
    return typeMatch && matchesSearch;
  });

  const premium = filtered.filter((l) => l.isPremium);
  const regular = filtered.filter((l) => !l.isPremium);
  const carCount = allListings.filter(l => l.type === 'selling').length || 0;
  const businessCount = allListings.filter(l => l.type === 'business').length || 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-32">
      <div className="text-center p-12">
        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-3xl animate-spin mx-auto mb-8 shadow-2xl"></div>
        <p className="font-black text-2xl text-slate-700 uppercase tracking-wide">Loading Premium Listings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-32 lg:pt-40">
      
      {/* 🔥 HERO SECTION */}
      <section className="px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white px-8 py-4 rounded-3xl text-lg font-black uppercase tracking-wide mb-12 shadow-3xl border border-indigo-500/30 mx-auto">
            <Sparkles className="w-6 h-6" />
            MP & CG Verified Marketplace
          </div>

          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-tight mb-8 lg:mb-12 drop-shadow-xl">
            UPP<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">LINK</span>
          </h1>

          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-700 mb-16 lg:mb-20 max-w-3xl mx-auto leading-tight">
            🚗 {carCount.toLocaleString()} Premium Cars • 🏢 {businessCount.toLocaleString()} Verified Businesses
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-3xl border border-slate-200/70 hover:shadow-4xl transition-all">
              <div className="flex flex-col lg:flex-row gap-3 p-4 lg:p-6">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 w-6 h-6" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search used cars Raipur, businesses Bhopal, Korba services..." 
                    className="w-full pl-16 pr-6 py-5 lg:py-6 bg-white/80 rounded-2xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none font-semibold text-xl text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-200 shadow-lg"
                  />
                </div>
                
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-8 py-5 lg:py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-slate-100 rounded-2xl font-semibold text-xl focus:border-indigo-300 shadow-lg hover:border-slate-200"
                >
                  <option>All ({allListings.length.toLocaleString()})</option>
                  <option>Cars ({carCount.toLocaleString()})</option>
                  <option>Business ({businessCount.toLocaleString()})</option>
                </select>
                
                <button 
                  onClick={() => {setFilter("all"); setSearchQuery("");}}
                  className="px-12 py-5 lg:py-6 bg-gradient-to-r from-slate-900 to-indigo-900 text-white font-black uppercase tracking-wide text-xl rounded-2xl shadow-3xl hover:shadow-4xl hover:from-indigo-900 hover:to-purple-900 transition-all whitespace-nowrap shrink-0"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 SEO-OPTIMIZED WHY UPPLINK SECTION */}
      <section className="px-6 lg:px-12 py-24 lg:py-32 bg-white/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 lg:mb-28">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-3xl text-lg font-black uppercase tracking-wide mb-12 shadow-3xl border border-emerald-500/30 mx-auto max-w-max">
              <ShieldCheck className="w-6 h-6" />
              Welcome to UPPLINK
            </div>
            <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed max-w-4xl mx-auto mb-20 lg:mb-24">
              The most trusted digital bridge connecting buyers and sellers across Central India. 
              Looking for the <strong>best used cars in Raipur</strong>? Need <strong>verified business listings in Bhopal</strong>? 
              Want to grow your business in <strong>Korba</strong>? UPPLINK provides an elite, secure platform for 
              <strong>Madhya Pradesh (MP)</strong> and <strong>Chhattisgarh (CG)</strong> markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Listings",
                desc: "Every business profile audited for authenticity. Trusted by thousands across MP & CG."
              },
              {
                icon: Car,
                title: "Premium Car Marketplace",
                desc: "Buy/sell pre-owned vehicles with transparency. Used cars Raipur, Bhopal, Korba & more."
              },
              {
                icon: TrendingUp,
                title: "Local SEO Dominance",
                desc: "Optimized for Chhattisgarh (CG) & Madhya Pradesh (MP). Rank higher in local searches."
              },
              {
                icon: LightningBolt,
                title: "Business Growth",
                desc: "High-authority backlinks & digital visibility. Perfect for local entrepreneurs."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-white/90 to-slate-50/70 border border-slate-200/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 hover:border-emerald-200">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 text-center group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 CATEGORY BUTTONS */}
      <section className="px-6 lg:px-12 pb-20 lg:pb-28 -mt-12 lg:-mt-16 relative">
        <div className="max-w-7xl mx-auto flex justify-center gap-6 lg:gap-8">
          {[
            { id: 'all', label: 'All', count: allListings.length, Icon: Star, color: 'indigo' },
            { id: 'selling', label: 'Cars', count: carCount, Icon: Car, color: 'emerald' },
            { id: 'business', label: 'Business', count: businessCount, Icon: Store, color: 'amber' }
          ].map((cat) => {
            const Icon = cat.Icon;
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`group relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl shadow-2xl border-4 p-6 lg:p-8 transition-all duration-500 hover:shadow-4xl hover:scale-105 hover:-translate-y-3 ${
                  isActive
                    ? `bg-gradient-to-br from-${cat.color}-500 to-${cat.color}-600 border-${cat.color}-400 shadow-${cat.color}-300/60`
                    : 'bg-white/90 border-slate-200/60 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <Icon 
                    size={24}
                    className={`mb-3 transition-all duration-500 ${
                      isActive 
                        ? `text-white drop-shadow-2xl scale-110` 
                        : 'text-slate-500 group-hover:text-slate-800 group-hover:scale-110'
                    }`}
                  />
                  <span className={`font-bold text-base lg:text-lg uppercase tracking-wide ${
                    isActive 
                      ? 'text-white drop-shadow-lg' 
                      : 'text-slate-800 group-hover:text-slate-900'
                  }`}>
                    {cat.label}
                  </span>
                  <span className={`text-xs font-bold ${
                    isActive ? 'text-white/90' : 'text-slate-500'
                  }`}>
                    ({cat.count.toLocaleString()})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🔥 MAIN LISTINGS GRID */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-32 lg:pb-40">
        {premium.length > 0 && (
          <section className="mb-32 lg:mb-40">
            <div className="flex items-center gap-6 mb-16 lg:mb-20">
              <div className="w-4 h-24 lg:w-5 lg:h-28 bg-gradient-to-b from-amber-500 to-orange-600 rounded-3xl shadow-xl"></div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight">
                Premium Deals
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {premium.map((item) => (
                <ListingCard key={item.id} data={item} premium />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-6 mb-16 lg:mb-20">
            <div className="w-4 h-24 lg:w-5 lg:h-28 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-3xl shadow-xl"></div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-tight">
              Latest Listings
            </h2>
          </div>
          
          {regular.length === 0 ? (
            <div className="text-center py-32 lg:py-40 bg-white/80 backdrop-blur-xl rounded-4xl border-4 border-dashed border-slate-200 shadow-2xl p-20 lg:p-24 max-w-2xl mx-auto">
              <Search className="w-24 h-24 lg:w-28 lg:h-28 mx-auto mb-8 text-slate-400" />
              <h3 className="text-3xl lg:text-4xl font-black text-slate-600 mb-6">No listings found</h3>
              <p className="text-xl lg:text-2xl text-slate-500 mb-12 lg:mb-16 max-w-md mx-auto leading-relaxed">
                Try different search terms or categories for used cars Raipur, businesses Bhopal, Korba services
              </p>
              <button 
                onClick={() => {setFilter('all'); setSearchQuery('');}}
                className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-12 lg:px-16 py-6 lg:py-8 rounded-3xl font-black uppercase tracking-wide text-xl shadow-3xl hover:shadow-4xl transition-all flex items-center gap-3 mx-auto"
              >
                Reset Filters
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
              {regular.map((item) => (
                <ListingCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 🔥 SEO CITIES */}
      <section className="py-32 lg:py-40 bg-gradient-to-br from-slate-50/50 via-indigo-50/30 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8 lg:gap-10 mb-24 lg:mb-32">
            {[
              { href: "/?searchQuery=Used+Cars+Bhopal", title: "Used Cars Bhopal", desc: "Toyota Fortuner, Innova Crysta, Swift, Brezza dealers", Icon: Car, color: "indigo" },
              { href: "/?searchQuery=Car+Dealers+Indore", title: "Car Dealers Indore", desc: "Maruti, Hyundai, Mahindra service centers", Icon: Store, color: "emerald" },
              { href: "/?searchQuery=Cars+Jabalpur", title: "Used Cars Jabalpur", desc: "Premium pre-owned cars, SUVs, sedans", Icon: Car, color: "orange" },
              { href: "/?searchQuery=Car+Service+Gwalior", title: "Car Service Gwalior", desc: "Top mechanics, auto repair shops", Icon: Store, color: "blue" },
              { href: "/?searchQuery=Hospitals+Raipur", title: "Hospitals Raipur", desc: "Top hospitals, clinics, diagnostic centers", Icon: Store, color: "purple" },
              { href: "/?searchQuery=Car+Mechanics+Korba", title: "Mechanics Korba", desc: "Trusted car service centers, workshops", Icon: Store, color: "slate" }
            ].map((city, i) => (
              <CityCard key={i} {...city} />
            ))}
          </div>

          <div className="text-center mt-24 lg:mt-32 pt-20 lg:pt-24 border-t-4 border-slate-100/50">
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
              MP & CG Complete Coverage
            </h2>
            <p className="text-2xl lg:text-3xl text-slate-700 font-semibold max-w-4xl mx-auto leading-relaxed">
              Bhopal • Indore • Jabalpur • Gwalior • Raipur • Korba • Bilaspur • Durg & 50+ more cities
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 FOOTER */}
      <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-24 lg:py-32 text-center border-t-8 border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h3 className="text-4xl lg:text-6xl font-black text-white mb-8 lg:mb-12 drop-shadow-2xl leading-tight">
            UPP-LINK 2026
          </h3>
          <p className="text-xl lg:text-2xl text-slate-200 font-bold mb-8 lg:mb-12">
            🚗 {carCount.toLocaleString()} Cars • 🏢 {businessCount.toLocaleString()} Businesses
          </p>
          <p className="text-slate-400 font-bold uppercase tracking-wide text-lg lg:text-xl">
            © 2026 UPP-LINK • Madhya Pradesh & Chhattisgarh Premium Marketplace
          </p>
        </div>
      </footer>
    </div>
  );
}

// 🔥 CITY CARD COMPONENT
const colorStyles: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  orange: "from-orange-500 to-orange-600",
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  slate: "from-slate-500 to-slate-600",
  yellow: "from-yellow-500 to-yellow-600",
  teal: "from-teal-500 to-teal-600"
};

function CityCard({ href, title, desc, Icon, color }: any) {
  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <Link href={href} className="group h-full">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col hover:-translate-y-2">
        <div className={`w-20 h-20 bg-gradient-to-br ${style} rounded-3xl flex items-center justify-center mb-6 shadow-2xl`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4">
          {title}
        </h3>
        <p className="text-slate-600 mb-6 grow">
          {desc}
        </p>
        <span className="font-bold text-sm uppercase tracking-widest text-emerald-600 group-hover:text-emerald-700 transition-colors">
          Explore →
        </span>
      </div>
    </Link>
  );
}
