"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase/config";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import { 
  Search, Star, MapPin, Phone, Car, Store, Building2, Wrench, Utensils, Stethoscope, 
  Smartphone, Home, Truck, Navigation2, Hotel, Dumbbell, School, 
  Heart, ShieldCheck, TrendingUp, Users, Award, Zap, ChevronRight, Sparkles,
  ArrowRight, Filter, Menu, X, ChevronDown 
} from "lucide-react";

const UplinkHome = () => {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔥 SCROLL LISTENER FOR APP BAR ONLY
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 FIREBASE QUERY
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt 
      }));
      setAllListings(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredListings = allListings.filter((item) => {
    const searchStr = searchQuery.toLowerCase().trim();
    const cityStr = cityQuery.toLowerCase().trim();
    
    const typeMatch = activeFilter === "all" || item.type === activeFilter;
    
    const matchesSearch = !searchStr || 
      item.listingTitle?.toLowerCase().includes(searchStr) ||
      item.businessName?.toLowerCase().includes(searchStr) ||
      item.location?.toLowerCase().includes(searchStr) ||
      item.servicesOffered?.toLowerCase().includes(searchStr);
    
    const matchesCity = !cityStr || item.location?.toLowerCase().includes(cityStr);
    
    return typeMatch && matchesSearch && matchesCity;
  });

  const premiumListings = filteredListings.filter(l => l.isPremium);
  const regularListings = filteredListings.filter(l => !l.isPremium);
  
  const carCount = allListings.filter(l => l.type === 'selling').length;
  const businessCount = allListings.filter(l => l.type === 'business').length;

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-8 sm:p-12">
      <div className="text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-orange-500 border-t-white rounded-full animate-spin mx-auto mb-8 shadow-2xl"></div>
        <p className="text-xl sm:text-2xl font-black text-orange-600 uppercase tracking-wider">Loading Premium Listings...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* 🔥 SCROLL-AWARE APP BAR - SHRINKS ON SCROLL */}
      <header className={`bg-white/95 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b-2 border-orange-200/80 transition-all duration-300 ${isScrolled ? 'py-3 lg:py-4 shadow-xl' : 'py-4 lg:py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isScrolled ? 'lg:space-x-4' : 'lg:space-x-6'}`}>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isScrolled ? 'scale-95' : 'scale-100'}`}>
                <Star className="w-7 h-7 lg:w-9 lg:h-9 text-white" />
              </div>
              <div className="hidden lg:block">
                <h1 className={`text-3xl lg:text-4xl font-black text-gray-900 tracking-tight transition-all ${isScrolled ? 'scale-95' : 'scale-100'}`}>UPP-LINK</h1>
                <p className={`text-sm lg:text-base text-orange-600 font-bold uppercase tracking-widest ${isScrolled ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>MP & CG Verified</p>
              </div>
              <div className="lg:hidden">
                <h1 className={`text-2xl font-black text-gray-900 tracking-tight transition-all ${isScrolled ? 'scale-95' : 'scale-100'}`}>UPP-LINK</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/login" className="hidden lg:inline-block hover:text-orange-600 font-bold py-2 px-4 hover:bg-orange-50 rounded-xl text-base transition-all">
                Login
              </Link>
              <Link href="/admin" className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 lg:px-8 lg:py-3.5 rounded-2xl font-black uppercase tracking-wide text-sm lg:text-base shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all ${isScrolled ? 'scale-95' : 'scale-100'}`}>
                FREE Listing
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-orange-200/50 pt-4">
              <Link href="/login" className="block w-full text-left px-4 py-4 font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-all text-lg">
                Login
              </Link>
              <Link href="/admin" className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wide mt-3 shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 transition-all text-lg">
                FREE Listing
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 🔥 HERO SECTION */}
      <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 py-12 lg:py-20 xl:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-white/95 px-4 py-3 lg:px-6 lg:py-4 rounded-3xl shadow-2xl border-2 border-orange-200 mb-8 lg:mb-12 backdrop-blur-xl max-w-max">
            <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 mr-2 lg:mr-3 flex-shrink-0" />
            <span className="font-black text-lg lg:text-xl text-orange-800 uppercase tracking-wide truncate max-w-[200px] lg:max-w-none">Korba, Chhattisgarh</span>
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 ml-2 lg:ml-3 flex-shrink-0" />
          </div>

          <h1 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-gray-900 mb-6 lg:mb-8 leading-tight drop-shadow-2xl text-center">
            Find Local Businesses
          </h1>
          
          <p className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-600 font-bold mb-10 lg:mb-16 max-w-4xl mx-auto text-center px-4 lg:px-0 leading-relaxed">
            🚗 {carCount.toLocaleString()} Premium Cars • 🏢 {businessCount.toLocaleString()} Verified Businesses
          </p>

          <div className="max-w-4xl lg:max-w-6xl mx-auto">
            <div className="bg-white/95 rounded-3xl shadow-2xl border border-orange-100 p-4 lg:p-6 xl:p-8 backdrop-blur-xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 w-6 h-6 lg:w-7 lg:h-7" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Search cars, services, restaurants..." 
                    className="w-full pl-16 lg:pl-20 pr-6 lg:pr-8 py-5 lg:py-6 xl:py-7 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:outline-none text-lg lg:text-xl xl:text-2xl font-bold bg-white/90 hover:bg-white transition-all shadow-xl"
                  />
                </div>
                <div className="flex gap-3 lg:flex-col">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5 lg:w-6 lg:h-6" />
                    <input 
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder="📍 City" 
                      className="w-full pl-12 lg:pl-14 pr-5 lg:pr-6 py-5 lg:py-6 xl:py-7 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:outline-none text-lg lg:text-xl font-bold bg-white/90 hover:bg-white transition-all shadow-xl flex-1"
                    />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-5 bg-orange-100 hover:bg-orange-200 rounded-2xl transition-all shadow-xl flex-shrink-0 flex items-center justify-center"
                  >
                    <Filter className="w-6 h-6 text-orange-600" />
                  </button>
                </div>
              </div>
              <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-orange-100">
                <button 
                  onClick={() => document.getElementById('listings')?.scrollIntoView({behavior: 'smooth'})}
                  className="w-full lg:w-auto lg:min-w-[220px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black uppercase tracking-wide text-xl lg:text-2xl px-12 lg:px-16 py-6 lg:py-7 rounded-3xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 mx-auto lg:ml-0"
                >
                  <Search className="w-6 h-6 lg:w-7 lg:h-7" />
                  <span>Search Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 MOBILE FILTERS - NON-STICKY, REGULAR SECTION */}
      {showFilters && (
        <section className="lg:hidden py-8 pb-4 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => {setActiveFilter("all"); setShowFilters(false);}}
                className={`p-5 rounded-3xl font-bold uppercase tracking-wider text-base transition-all shadow-xl flex flex-col items-center gap-3 h-28 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 scale-105"
                    : "bg-white/95 border-3 border-orange-200 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-2 text-gray-800 hover:bg-white"
                }`}
              >
                <span className="text-3xl">📋</span>
                <span>All ({filteredListings.length})</span>
              </button>
              <button
                onClick={() => {setActiveFilter("selling"); setShowFilters(false);}}
                className={`p-5 rounded-3xl font-bold uppercase tracking-wider text-base transition-all shadow-xl flex flex-col items-center gap-3 h-28 ${
                  activeFilter === "selling"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50 scale-105"
                    : "bg-white/95 border-3 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:-translate-y-2 text-gray-800 hover:bg-white"
                }`}
              >
                <Car className="w-8 h-8" />
                <span>Cars</span>
              </button>
              <button
                onClick={() => {setActiveFilter("business"); setShowFilters(false);}}
                className={`p-5 rounded-3xl font-bold uppercase tracking-wider text-base transition-all shadow-xl flex flex-col items-center gap-3 h-28 ${
                  activeFilter === "business"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50 scale-105"
                    : "bg-white/95 border-3 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 text-gray-800 hover:bg-white"
                }`}
              >
                <Store className="w-8 h-8" />
                <span>Business</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🔥 DESKTOP FILTERS - NON-STICKY, REGULAR SECTION */}
      <section className="lg:block py-12 xl:py-16 bg-gradient-to-r from-orange-50 to-yellow-50 mb-8 lg:mb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-center gap-6 xl:gap-8 max-w-5xl mx-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-12 lg:px-16 xl:px-20 py-8 lg:py-10 xl:py-12 rounded-4xl font-black uppercase tracking-wide text-2xl lg:text-3xl xl:text-4xl transition-all shadow-2xl flex-1 max-w-md h-32 flex items-center justify-center ${
                activeFilter === "all"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 scale-105"
                  : "bg-white/95 border-4 border-orange-200 hover:border-orange-400 hover:shadow-3xl hover:-translate-y-3 text-gray-800 hover:bg-white"
              }`}
            >
              All ({filteredListings.length})
            </button>
            <button
              onClick={() => setActiveFilter("selling")}
              className={`px-12 lg:px-16 xl:px-20 py-8 lg:py-10 xl:py-12 rounded-4xl font-black uppercase tracking-wide text-2xl lg:text-3xl xl:text-4xl transition-all shadow-2xl flex items-center gap-6 flex-1 max-w-md h-32 justify-center ${
                activeFilter === "selling"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50 scale-105"
                  : "bg-white/95 border-4 border-emerald-200 hover:border-emerald-400 hover:shadow-3xl hover:-translate-y-3 text-gray-800 hover:bg-white"
              }`}
            >
              <Car className="w-10 h-10 lg:w-12 lg:h-12" />
              Cars
            </button>
            <button
              onClick={() => setActiveFilter("business")}
              className={`px-12 lg:px-16 xl:px-20 py-8 lg:py-10 xl:py-12 rounded-4xl font-black uppercase tracking-wide text-2xl lg:text-3xl xl:text-4xl transition-all shadow-2xl flex items-center gap-6 flex-1 max-w-md h-32 justify-center ${
                activeFilter === "business"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50 scale-105"
                  : "bg-white/95 border-4 border-blue-200 hover:border-blue-400 hover:shadow-3xl hover:-translate-y-3 text-gray-800 hover:bg-white"
              }`}
            >
              <Store className="w-10 h-10 lg:w-12 lg:h-12" />
              Business
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 LISTINGS SECTION - FULL SPACE NOW */}
      <section id="listings" className="py-16 lg:py-24 xl:py-32 bg-gradient-to-b from-white to-gray-50 pb-32 lg:pb-40 xl:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          
          {premiumListings.length > 0 && (
            <>
              <div className="flex items-center mb-12 lg:mb-20 xl:mb-24">
                <div className="w-3 h-20 lg:w-4 lg:h-28 xl:h-32 bg-gradient-to-b from-orange-500 to-orange-600 rounded-2xl mr-6 lg:mr-8 shadow-2xl"></div>
                <div>
                  <h2 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-gray-900 mb-3 lg:mb-4 leading-tight">
                    ⭐ Premium Deals
                  </h2>
                  <p className="text-xl lg:text-3xl xl:text-4xl text-orange-600 font-bold">Top verified listings</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10 mb-20 lg:mb-32">
                {premiumListings.slice(0, 8).map((item) => (
                  <div key={item.id} className="group">
                    <ListingCard data={item} premium listView />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t-4 border-orange-100/70 pt-16 lg:pt-24 xl:pt-32">
            <div className="flex items-center mb-12 lg:mb-20 xl:mb-24">
              <div className="w-3 h-20 lg:w-4 lg:h-28 xl:h-32 bg-gradient-to-b from-gray-400 to-gray-500 rounded-2xl mr-6 lg:mr-8 shadow-2xl"></div>
              <h2 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-gray-900 leading-tight">
                Latest Listings ({regularListings.length})
              </h2>
            </div>
            
            {regularListings.length === 0 ? (
              <div className="text-center py-24 lg:py-32 xl:py-40 bg-white/80 backdrop-blur-xl rounded-4xl lg:rounded-5xl border-4 border-dashed border-orange-200 shadow-3xl max-w-4xl mx-auto p-12 lg:p-20 xl:p-24">
                <Search className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-12 lg:mb-16 text-gray-300 shadow-3xl" />
                <h3 className="text-3xl lg:text-5xl xl:text-6xl font-black text-gray-700 mb-6 lg:mb-8">No listings match</h3>
                <p className="text-xl lg:text-2xl xl:text-3xl text-gray-500 mb-12 lg:mb-16 max-w-2xl mx-auto leading-relaxed">
                  Try "car service Korba" or clear filters
                </p>
                <button 
                  onClick={() => {setSearchQuery(''); setCityQuery(''); setActiveFilter('all');}}
                  className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 lg:px-16 py-6 lg:py-7 rounded-3xl font-black uppercase tracking-wide text-xl shadow-3xl hover:shadow-4xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10">
                {regularListings.map((item) => (
                  <div key={item.id} className="group">
                    <ListingCard data={item} listView />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🔥 POPULAR CATEGORIES */}
      <section className="py-20 lg:py-28 xl:py-32 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center mb-16 lg:mb-24 xl:mb-28">
            <h2 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-gray-900 mb-6 lg:mb-8">Popular Categories</h2>
            <p className="text-2xl lg:text-4xl xl:text-5xl text-gray-600 font-bold">{carCount + businessCount} Total Listings</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
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
                  className="group relative p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-3xl lg:rounded-4xl bg-white/95 backdrop-blur-xl border-2 border-gray-100 hover:border-orange-400 hover:shadow-3xl hover:-translate-y-3 hover:bg-white transition-all duration-500 h-full shadow-xl lg:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-3xl lg:rounded-4xl transition-all duration-500 ${getColorClass(cat.color)}`}></div>
                  <div className="relative z-10 text-center">
                    <div className={`w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 ${getColorClass(cat.color)} rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-10 xl:mb-12 shadow-2xl mx-auto group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-white" />
                    </div>
                    <h3 className="font-black text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-gray-900 mb-3 lg:mb-6 group-hover:text-gray-800 leading-tight">{cat.label}</h3>
                    <div className="text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-orange-600 mb-2 lg:mb-4">{cat.count}</div>
                    <p className="text-sm lg:text-lg xl:text-xl font-bold text-gray-600 uppercase tracking-widest group-hover:text-orange-600">Verified</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔥 FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 text-white py-16 lg:py-24 xl:py-28 border-t-8 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-center">
          <h3 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-8 lg:mb-12 xl:mb-16 drop-shadow-2xl">UPP-LINK</h3>
          <p className="text-2xl lg:text-4xl xl:text-5xl font-bold text-orange-300 mb-10 lg:mb-16 xl:mb-20">
            🚗 {carCount.toLocaleString()}+ Cars • 🏢 {businessCount.toLocaleString()}+ Businesses
          </p>
          <div className="border-t-2 border-orange-500/50 pt-10 lg:pt-16 xl:pt-20">
            <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-300 mb-8 lg:mb-12 xl:mb-16">© 2026 UPP-LINK | Korba, Chhattisgarh</p>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10 xl:gap-12 text-base lg:text-lg xl:text-xl uppercase tracking-widest font-bold">
              <Link href="/privacy" className="hover:text-orange-400 transition-all px-6 lg:px-8 py-3 hover:bg-white/20 rounded-2xl">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-400 transition-all px-6 lg:px-8 py-3 hover:bg-white/20 rounded-2xl">Terms</Link>
              <Link href="/contact" className="hover:text-orange-400 transition-all px-6 lg:px-8 py-3 hover:bg-white/20 rounded-2xl">Contact</Link>
              <Link href="/advertise" className="hover:text-orange-400 transition-all px-6 lg:px-8 py-3 hover:bg-white/20 rounded-2xl">Advertise</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UplinkHome;
