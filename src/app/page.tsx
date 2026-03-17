"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import { 
  Search, Star, MapPin, Phone, Car, Store, Building2, Wrench, Utensils, Stethoscope, 
  Scissors, Smartphone, Home, Truck, Navigation2, Hotel, Dumbbell, School, 
  Heart, ShieldCheck, TrendingUp, Users, Award, Zap, ChevronRight, Sparkles,
  ArrowRight, Filter 
} from "lucide-react";

const UplinkHome = () => {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // ✅ FIXED FILTER STATE

  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 PERFECT FILTERING LOGIC - FIXED ✅
  const filteredListings = allListings.filter((item) => {
    const searchStr = searchQuery.toLowerCase().trim();
    const cityStr = cityQuery.toLowerCase().trim();
    
    // ✅ TYPE FILTER - NOW WORKS CORRECTLY
    const typeMatch = activeFilter === "all" || item.type === activeFilter;
    
    // ✅ SEARCH FILTER
    const matchesSearch = !searchStr || 
      item.listingTitle?.toLowerCase().includes(searchStr) ||
      item.businessName?.toLowerCase().includes(searchStr) ||
      item.location?.toLowerCase().includes(searchStr) ||
      item.servicesOffered?.toLowerCase().includes(searchStr);
    
    // ✅ CITY FILTER
    const matchesCity = !cityStr || item.location?.toLowerCase().includes(cityStr);
    
    return typeMatch && matchesSearch && matchesCity;
  });

  // 🔥 PREMIUM/REGULAR SEPARATION
  const premiumListings = filteredListings.filter(l => l.isPremium);
  const regularListings = filteredListings.filter(l => !l.isPremium);
  
  const carCount = allListings.filter(l => l.type === 'selling').length;
  const businessCount = allListings.filter(l => l.type === 'business').length;

  // 🔥 DYNAMIC CATEGORIES
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    allListings.forEach((item) => {
      let category = "Others";
      if (item.type === 'selling') category = "Used Cars";
      else if (item.serviceCategory) {
        const categoryMap: Record<string, string> = {
          "taxi-services": "Taxi Services", "car-service": "Car Service", 
          "auto-dealer": "Car Dealers", "restaurant": "Restaurants",
          "salon-spa": "Salon & Spa", "hospital": "Hospitals"
        };
        category = categoryMap[item.serviceCategory] || "Business";
      }
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const popularCategories = [
    { label: "Used Cars", icon: Car, count: categoryCounts["Used Cars"] || carCount, color: "blue", searchTerm: "used cars" },
    { label: "Car Service", icon: Wrench, count: categoryCounts["Car Service"] || 0, color: "orange", searchTerm: "car service" },
    { label: "Taxi Services", icon: Navigation2, count: categoryCounts["Taxi Services"] || 0, color: "emerald", searchTerm: "taxi" },
    { label: "Restaurants", icon: Utensils, count: categoryCounts["Restaurants"] || 0, color: "red", searchTerm: "restaurant" }
  ].filter(cat => cat.count > 0)
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600', orange: 'from-orange-500 to-orange-600',
      emerald: 'from-emerald-500 to-emerald-600', red: 'from-red-500 to-red-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-12">
      <div className="text-center">
        <div className="w-24 h-24 border-4 border-orange-500 border-t-white rounded-full animate-spin mx-auto mb-8 shadow-2xl"></div>
        <p className="text-2xl font-black text-orange-600 uppercase tracking-wider">Loading Premium Listings...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 🔥 STICKY HEADER */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">UPP-LINK</h1>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">MP & CG Verified Marketplace</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <Link href="/login" className="hover:text-orange-600 font-bold py-2 px-4 hover:bg-orange-50 rounded-xl transition-all">Login</Link>
              <Link href="/admin" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-wide shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all">FREE Listing</Link>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 HERO SEARCH */}
      <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/80 px-8 py-4 rounded-3xl shadow-2xl border-2 border-orange-200 mb-8 backdrop-blur-xl">
              <MapPin className="w-6 h-6 text-orange-600 mr-3" />
              <span className="font-black text-xl text-orange-800 uppercase tracking-wide">Korba, Chhattisgarh</span>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-3" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight drop-shadow-2xl">
              Find Local Businesses
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 font-bold mb-12 max-w-3xl mx-auto">
              🚗 {carCount.toLocaleString()} Premium Cars • 🏢 {businessCount.toLocaleString()} Verified Businesses
            </p>
          </div>

          {/* 🔥 TWO-FIELD SEARCH BAR */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 rounded-3xl shadow-2xl border border-orange-100 p-2 backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row gap-3 p-2">
                <div className="relative flex-1 lg:w-3/5">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 w-6 h-6" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Car service, taxi, restaurant, hospital..." 
                    className="w-full pl-16 pr-6 py-6 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:outline-none text-xl font-bold bg-white/70 hover:bg-white transition-all shadow-lg"
                  />
                </div>
                <div className="relative flex-1 lg:w-2/5">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 w-6 h-6" />
                  <input 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="📍 Korba, Raipur, Bhopal..." 
                    className="w-full pl-16 pr-6 py-6 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:outline-none text-xl font-bold bg-white/70 hover:bg-white transition-all shadow-lg"
                  />
                </div>
                <button 
                  onClick={() => document.getElementById('listings')?.scrollIntoView({behavior: 'smooth'})}
                  className="lg:w-56 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black uppercase tracking-wide text-xl px-10 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all whitespace-nowrap flex items-center gap-3"
                >
                  <Search className="w-6 h-6" />
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 FILTER TABS */}
      <section className="py-12 bg-gradient-to-r from-orange-50 to-yellow-50 sticky z-40 top-[80px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-400/50 scale-105"
                  : "bg-white/80 border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 text-gray-800"
              }`}
            >
              All ({filteredListings.length})
            </button>
            <button
              onClick={() => setActiveFilter("selling")}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg flex items-center gap-2 ${
                activeFilter === "selling"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-400/50 scale-105"
                  : "bg-white/80 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 text-gray-800"
              }`}
            >
              <Car className="w-5 h-5" />
              Cars ({allListings.filter(l => l.type === 'selling').length})
            </button>
            <button
              onClick={() => setActiveFilter("business")}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-wide text-lg transition-all shadow-lg flex items-center gap-2 ${
                activeFilter === "business"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-400/50 scale-105"
                  : "bg-white/80 border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 text-gray-800"
              }`}
            >
              <Store className="w-5 h-5" />
              Business ({allListings.filter(l => l.type === 'business').length})
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 PREMIUM LISTINGS - LUXURY DESIGN */}
      <section id="listings" className="py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {premiumListings.length > 0 && (
            <>
              <div className="flex items-center mb-20">
                <div className="w-3 h-24 bg-gradient-to-b from-orange-500 to-orange-600 rounded-2xl mr-6 shadow-xl"></div>
                <div>
                  <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-2 leading-tight">
                    ⭐ Premium Deals
                  </h2>
                  <p className="text-2xl text-orange-600 font-bold">Top verified listings - Fastest response</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {premiumListings.map((item) => (
                  <div key={item.id} className="group">
                    <ListingCard data={item} premium />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🔥 REGULAR LISTINGS */}
          <div className="mt-24 pt-24 border-t-4 border-orange-100">
            <div className="flex items-center mb-20">
              <div className="w-3 h-24 bg-gradient-to-b from-gray-400 to-gray-500 rounded-2xl mr-6 shadow-xl"></div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Latest Listings ({regularListings.length})
              </h2>
            </div>
            {regularListings.length === 0 ? (
              <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-4xl border-4 border-dashed border-orange-200 shadow-2xl max-w-4xl mx-auto p-20">
                <Search className="w-28 h-28 mx-auto mb-12 text-gray-300 shadow-2xl" />
                <h3 className="text-4xl lg:text-5xl font-black text-gray-700 mb-6">No listings match your search</h3>
                <p className="text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Try "car service Korba", "taxi Raipur" or clear filters to see all listings
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={() => {setSearchQuery(''); setCityQuery(''); setActiveFilter('all');}}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-wide text-xl shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {regularListings.map((item) => (
                  <div key={item.id} className="group">
                    <ListingCard data={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🔥 POPULAR CATEGORIES */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-2xl text-gray-600 font-bold">{carCount + businessCount} Total Active Listings</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {popularCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button 
                  key={cat.label}
                  onClick={() => {
                    setSearchQuery(cat.searchTerm);
                    setActiveFilter(cat.searchTerm.includes('car') || cat.searchTerm.includes('Cars') ? 'selling' : 'business');
                    document.getElementById('listings')?.scrollIntoView({behavior: 'smooth'});
                  }}
                  className="group relative p-10 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-gray-100 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-3 hover:bg-white transition-all duration-500 h-full shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500 ${getColorClass(cat.color)}`}></div>
                  <div className="relative z-10">
                    <div className={`w-20 h-20 ${getColorClass(cat.color)} rounded-2xl flex items-center justify-center mb-8 shadow-2xl mx-auto group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-black text-2xl text-gray-900 mb-4 text-center group-hover:text-gray-800">{cat.label}</h3>
                    <div className="text-4xl font-black text-orange-600 mb-3 text-center">{cat.count}</div>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-widest text-center group-hover:text-orange-600">Verified Listings</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔥 FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 text-white py-20 border-t-8 border-orange-500">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h3 className="text-5xl lg:text-6xl font-black mb-8 drop-shadow-2xl">UPP-LINK</h3>
          <p className="text-2xl font-bold text-orange-300 mb-12">
            🚗 {carCount.toLocaleString()}+ Cars • 🏢 {businessCount.toLocaleString()}+ Businesses
          </p>
          <div className="border-t-2 border-orange-500/50 pt-12">
            <p className="text-lg font-bold text-gray-300 mb-8">© 2026 UPP-LINK | Korba, Chhattisgarh</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest font-bold">
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
              <Link href="/advertise" className="hover:text-orange-400 transition-colors">Advertise</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UplinkHome;
