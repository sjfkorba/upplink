import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { notFound } from "next/navigation";
import CallButton from "@/components/CallButton";
import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";
import { 
  ChevronLeft, Heart, Share2, Star, MapPin, Phone, ShieldCheck, 
  Car, Store, Crown, Clock 
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
  
  const data = { 
    id: querySnapshot.docs[0].id, 
    ...querySnapshot.docs[0].data() 
  } as any;
  
  const isCar = data.type === 'selling';
  const title = isCar ? data.listingTitle || data.businessName : data.businessName || data.listingTitle;
  const rating = Number(data.rating) || 4.5;
  const reviews = Number(data.reviews) || 120;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-1 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          
          <div className="flex-1 px-4 text-center">
            <h1 className="text-lg font-semibold text-gray-900 truncate leading-tight">{title}</h1>
            <p className="text-xs text-gray-600 mt-1">{data.location}</p>
          </div>
          
          <div className="flex gap-1.5">
            <button className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-8 lg:space-y-12">
            
            {/* Hero Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8 lg:p-10 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                  
                  {/* Content */}
                  <div className="lg:w-3/4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                      {isCar ? <Car className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                      <span>{isCar ? 'Vehicle Listing' : 'Business Directory'}</span>
                      {data.isPremium && (
                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-6">
                      {title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 px-4 py-2.5 rounded-xl font-semibold">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-yellow-700 font-normal">({reviews.toLocaleString()})</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-green-50 text-green-800 px-4 py-2.5 rounded-xl font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Owner
                      </div>
                    </div>
                  </div>
                  
                  {/* Price & Location */}
                  <div className="lg:w-1/4 lg:text-right mt-8 lg:mt-0">
                    {data.price && (
                      <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-lg mb-6 mx-auto lg:mx-0 max-w-max">
                        ₹{data.price}
                      </div>
                    )}
                    <div className="flex items-center justify-center lg:justify-end gap-2 text-sm bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{data.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="aspect-video lg:aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                {data.images && data.images.length > 0 ? (
                  <ImageGallery images={data.images} />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      {isCar ? (
                        <Car className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500" />
                      ) : (
                        <Store className="w-12 h-12 lg:w-16 lg:h-16 text-gray-500" />
                      )}
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                      High Quality Photos
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600">
                      Available on request
                    </p>
                  </div>
                )}
                
                {data.images && data.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs font-medium shadow-2xl">
                    1 of {data.images.length}
                  </div>
                )}
              </div>
              
              {/* Action Bar */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200">
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={`tel:${data.contact}`}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm whitespace-nowrap"
                  >
                    📞 Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Details Section */}
            {(data.description || data.servicesOffered) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-10">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  {isCar ? 'Vehicle Details' : 'Service Information'}
                </h2>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-700 leading-relaxed">
                  <p>{data.description || data.servicesOffered}</p>
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:max-h-screen lg:overflow-y-auto space-y-6">
            
            {/* Primary CTA */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-1">
              <a 
                href={`tel:${data.contact}`}
                className="block p-8 text-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
              >
                <Phone className="w-16 h-16 mx-auto mb-4 text-white/90 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500" />
                <div className="text-2xl font-bold mb-2">Call Owner Directly</div>
                <div className="text-sm opacity-90 font-medium">10 second connect</div>
              </a>
            </div>

            {/* Price Card */}
            {data.price && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-700 mb-3">
                  ₹{data.price}
                </div>
                <div className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
                  Best Available Price
                </div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">Negotiable</div>
              </div>
            )}

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-orange-500" />
                Location Details
              </h3>
              <div className="space-y-3">
                <div className="font-bold text-lg text-gray-900 truncate">{data.location}</div>
                {data.address && (
                  <p className="text-sm text-gray-600 leading-relaxed">{data.address}</p>
                )}
              </div>
            </div>

            {/* Premium Badge */}
            {data.isPremium && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-8 rounded-2xl text-center shadow-xl border-2 border-yellow-300/50">
                <Crown className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-xl font-bold mb-2">Premium Verified</div>
                <div className="text-sm opacity-90">Admin Approved Listing</div>
              </div>
            )}

            {/* Quick Info */}
            {!isCar && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 text-sm font-medium text-green-800">
                  <Clock className="w-5 h-5" />
                  <span>Service Available 24/7</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CallButton phoneNumber={data.contact} />
    </div>
  );
}
