'use client';
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useParams } from "next/navigation";
import CallButton from "@/components/CallButton";
import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";
import { 
  ChevronLeft, Heart, Share2, Star, MapPin, Phone, ShieldCheck, 
  Car, Store, Crown, Clock, Zap, Wrench, Navigation2, Utensils, 
  Building2, Stethoscope, ThumbsUp, Award, Users, CheckCircle,
  Gauge, Fuel 
} from "lucide-react";

export default function ListingDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchListing() {
      try {
        const q = query(collection(db, "listings"), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setData(null);
          return;
        }
        
        const listingData = { 
          id: querySnapshot.docs[0].id, 
          ...querySnapshot.docs[0].data() 
        };
        setData(listingData);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchListing();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-emerald-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-emerald-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <Link href="/listings" className="bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
            Browse Listings
          </Link>
        </div>
      </div>
    );
  }

  const isCar = data.type === 'selling';
  const title = isCar ? data.listingTitle || data.businessName : data.businessName || data.listingTitle;
  const rating = Number(data.rating) || 4.5;
  const reviews = Number(data.reviews) || 120;
  const imagesLength = data.images?.length || 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | UPP-LINK`,
          text: `Check out this ${isCar ? 'car' : 'business'} on UPP-LINK!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const handleHeartClick = () => {
    alert('Added to favorites! ❤️');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-emerald-50">
      {/* 🔥 UPP-LINK BRAND HEADER */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-emerald-500 text-white shadow-2xl border-b-4 border-orange-400">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-base">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-orange-500 font-black text-xl">U</span>
              </div>
              UPP-LINK
            </Link>
            <div className="hidden md:flex items-center gap-3 text-sm font-semibold">
              <span className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">📱 Korba Marketplace</span>
              <Link href="/listings" className="px-4 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-all">Browse All</Link>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MOBILE HEADER */}
      <header className="lg:hidden sticky top-14 z-40 bg-white/95 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg hover:scale-105 transition-all shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 px-2 text-center min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate leading-tight">{title}</h1>
            <p className="text-xs text-gray-500">{data.location}</p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={handleHeartClick}
              className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-105 shadow-sm flex-1 max-w-[44px]"
              aria-label="Add to favorites"
            >
              <Heart className="w-5 h-5 mx-auto" />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all hover:scale-105 shadow-sm flex-1 max-w-[44px]"
              aria-label="Share listing"
            >
              <Share2 className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-3 lg:py-6">
        <div className="grid lg:grid-cols-12 gap-3 lg:gap-6">
          {/* 🔥 MAIN CONTENT */}
          <main className="lg:col-span-8 space-y-3 lg:space-y-6">
            
            {/* 🔥 HERO SECTION */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 lg:p-10 border-b border-gray-100 bg-gradient-to-r from-orange-50/70 to-emerald-50/70">
                <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-6">
                  <div className="flex items-center gap-2 p-2.5 lg:p-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg lg:rounded-xl border flex-shrink-0">
                    <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-md">
                      {isCar ? <Car className="w-4.5 h-4.5 lg:w-6 lg:h-6" /> : <Store className="w-4.5 h-4.5 lg:w-6 lg:h-6" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-base lg:text-3xl xl:text-4xl font-black text-gray-900 leading-tight mb-2 lg:mb-3 line-clamp-2 lg:line-clamp-none">
                      {title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm shadow-md">
                        <Star className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 fill-current" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-yellow-100 font-normal">({reviews}+)</span>
                      </div>
                      {data.isPremium && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 lg:px-4 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm shadow-md">
                          <Crown className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5" />
                          PREMIUM
                        </div>
                      )}
                    </div>
                  </div>

                  {data.price && (
                    <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-1.5 lg:min-w-[160px]">
                      <div className="text-xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white px-3 lg:px-6 py-2.5 lg:py-4 rounded-xl shadow-xl ring-2 ring-emerald-200/50">
                        ₹{data.price}
                      </div>
                      <div className="text-xs lg:text-sm text-emerald-700 font-bold uppercase tracking-wider bg-emerald-100 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg">
                        Best Price
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔥 IMAGE GALLERY */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-gray-100 overflow-hidden">
              <div className="relative">
                {data.images && data.images.length > 0 ? (
                  <ImageGallery images={data.images} />
                ) : (
                  <div className="h-60 lg:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6 lg:p-8 text-center relative overflow-hidden">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/80 rounded-xl flex items-center justify-center shadow-lg z-10 relative mb-3">
                      {isCar ? <Car className="w-10 h-10 lg:w-14 lg:h-14 text-gray-400" /> : <Store className="w-10 h-10 lg:w-14 lg:h-14 text-gray-400" />}
                    </div>
                    <h3 className="text-base lg:text-xl font-bold text-gray-700 mb-1.5 bg-white/90 px-4 py-2.5 rounded-xl shadow-lg">
                      Photos Available
                    </h3>
                    <p className="text-sm text-gray-500">Contact seller</p>
                  </div>
                )}
                {imagesLength > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl text-center">
                    {imagesLength} Photos
                  </div>
                )}
              </div>

              {/* 🔥 ACTION BAR */}
              <div className="px-3 lg:px-4 py-3.5 lg:py-4 bg-gradient-to-r from-orange-50 to-emerald-50 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5 sm:gap-0 sm:justify-between sm:items-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={handleHeartClick}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs"
                  >
                    <Heart className="w-4 h-4" />
                    Save
                  </button>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white/80 px-3 py-2 rounded-lg backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span>{rating.toFixed(1)} ({reviews}+)</span>
                  </div>
                </div>
                <a 
                  href={`tel:${data.contact || data.phone}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-2.5 lg:py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm w-full sm:w-auto"
                >
                  <Phone className="w-4.5 h-4.5" />
                  Call Now
                </a>
              </div>
            </div>

            {/* 🔥 SPECS GRID */}
            {(isCar && data.kmDriven) || (isCar && data.fuel) || data.serviceCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {isCar && data.kmDriven && (
                  <div className="group bg-white/90 p-4 lg:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg mb-2.5 lg:mb-3 group-hover:scale-110 transition-all">
                      <Gauge className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <h4 className="font-bold text-base lg:text-lg text-gray-900 mb-1">{data.kmDriven}</h4>
                    <p className="text-xs text-gray-600">KM Driven</p>
                  </div>
                )}
                {isCar && data.fuel && (
                  <div className="group bg-white/90 p-4 lg:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg mb-2.5 lg:mb-3 group-hover:scale-110 transition-all">
                      <Fuel className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <h4 className="font-bold text-base lg:text-lg text-gray-900 mb-1 capitalize">{data.fuel}</h4>
                    <p className="text-xs text-gray-600">Fuel Type</p>
                  </div>
                )}
                {data.serviceCategory && (
                  <div className="group bg-white/90 p-4 lg:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-center">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg mb-2.5 lg:mb-3 group-hover:scale-110 transition-all">
                      {data.serviceCategory === 'car-service' && <Wrench className="w-5 h-5 lg:w-6 lg:h-6" />}
                      {data.serviceCategory === 'taxi-services' && <Navigation2 className="w-5 h-5 lg:w-6 lg:h-6" />}
                      {data.serviceCategory === 'restaurant' && <Utensils className="w-5 h-5 lg:w-6 lg:h-6" />}
                      {data.serviceCategory === 'hospital' && <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6" />}
                      <Store className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <h4 className="font-bold text-base lg:text-lg text-gray-900 mb-1 capitalize">{data.serviceCategory.replace(/-/g, ' ')}</h4>
                    <p className="text-xs text-gray-600">{isCar ? 'Condition' : 'Category'}</p>
                  </div>
                )}
              </div>
            ) : null}

            {/* 🔥 DESCRIPTION */}
            {(data.description || data.servicesOffered) && (
              <div className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl border border-gray-100 p-5 lg:p-8 lg:p-10">
                <h2 className="text-lg lg:text-2xl xl:text-3xl font-black text-gray-900 flex items-center gap-2.5 lg:gap-3 mb-3 lg:mb-5">
                  <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-emerald-500 flex-shrink-0" />
                  {isCar ? 'Vehicle Details' : 'Service Info'}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-700 leading-relaxed">
                  <p>{data.description || data.servicesOffered}</p>
                </div>
              </div>
            )}
          </main>

          {/* 🔥 SIDEBAR */}
          <aside className="lg:col-span-4 space-y-3 lg:space-y-4 lg:sticky lg:top-20 lg:max-h-screen lg:overflow-y-auto">
            {/* 🔥 PRIMARY CTA */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl lg:rounded-2xl shadow-xl p-1 ring-4 ring-emerald-200/50 hover:shadow-2xl transition-all">
              <a 
                href={`tel:${data.contact || data.phone}`}
                className="block p-5 lg:p-6 text-center rounded-lg lg:rounded-xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all hover:shadow-xl hover:-translate-y-0.5 group"
              >
                <Phone className="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-3 text-white/90 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                <div className="text-lg lg:text-xl font-black mb-1.5">Call Seller</div>
                <div className="text-sm opacity-90 font-semibold">⭐ {rating.toFixed(1)} Rated</div>
                <div className="text-xs opacity-80 mt-1.5 flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  Instant Connect
                </div>
              </a>
            </div>

            {/* 🔥 LOCATION */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border p-5 lg:p-6 text-center">
              <div className="w-12 h-12 lg:w-14 lg:h-14 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2.5">📍 {data.location}</h3>
              {data.address && (
                <p className="text-xs lg:text-sm text-gray-700 leading-relaxed bg-white/80 px-3 py-2 rounded-lg">{data.address}</p>
              )}
            </div>

            {/* 🔥 TRUST BADGES */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border p-5 lg:p-6 space-y-3">
              <h4 className="text-base lg:text-lg font-bold text-gray-900 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500" />
                Trusted Seller
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0 mt-0.5">
                    <Users className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm lg:text-base text-gray-900">{reviews}+ Happy Customers</div>
                    <div className="text-xs text-gray-600">Community trusted</div>
                  </div>
                </div>
                {data.isPremium && (
                  <div className="flex items-start gap-2.5 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0 mt-0.5">
                      <Award className="w-4.5 h-4.5 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm lg:text-base text-gray-900">Premium Verified</div>
                      <div className="text-xs text-gray-600">Admin approved</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 🔥 HOURS */}
            {!isCar && (
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border rounded-xl p-5 text-center shadow-lg">
                <Clock className="w-12 h-12 mx-auto mb-2.5 text-blue-500 bg-white rounded-lg p-2.5 shadow-lg" />
                <div className="text-lg font-bold text-gray-900 mb-1.5">24/7 Available</div>
                <div className="text-blue-700 font-semibold bg-white px-3.5 py-2 rounded-lg shadow-md text-xs">Fast Response</div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CallButton phoneNumber={data.contact || data.phone} />
    </div>
  );
}
