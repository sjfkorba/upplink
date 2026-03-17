import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; city?: string };
}): Promise<Metadata> {
  const q = searchParams?.q || "Business";
  const city = searchParams?.city || "Korba";
  
  const title = `Best ${q} in ${city} | UPP-LINK - #1 Chhattisgarh & MP Local Search`;
  const description = `✅ 100% Verified ${q} in ${city}, Raipur, Bhopal. FREE Listing. 24x7 Support. Local ${q.toLowerCase()} near me - Korba No.1.`;

  return {
    title,
    description,
    keywords: [
      `${q.toLowerCase()} ${city.toLowerCase()}`,
      `${q.toLowerCase()} near me`,
      `${q.toLowerCase()} korba`,
      `${q.toLowerCase()} raipur`,
      `${q.toLowerCase()} bhopal`,
      `${q.toLowerCase()} indore`,
      "verified business listing",
      "local search chhattisgarh",
      "mp business directory",
      "free business listing",
      "car service korba",
      "taxi raipur",
      "restaurant bhopal"
    ].join(', '),
    
    openGraph: {
      title: `Best ${q} in ${city} | UPP-LINK Local Search`,
      description: `✅ REAL Verified ${q} in ${city}. FREE Premium Listing. Fastest Response. Korba #1 Local Search.`,
      images: ["/og-upplink-marketplace.jpg"],
      type: "website",
      locale: "en_IN",
      siteName: "UPP-LINK"
    },
    
    // 🔥 GOOGLE RICH SNIPPETS - NO COMPETITOR NAMES
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UPP-LINK",
        "description": "#1 Verified Local Business Directory - Chhattisgarh & MP",
        "url": "https://upplink.in",
        "logo": "https://upplink.in/logo.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Korba",
          "addressRegion": "Chhattisgarh",
          "addressCountry": "IN"
        },
        "areaServed": ["Korba", "Raipur", "Bilaspur", "Bhopal", "Indore", "Jabalpur"],
        "priceRange": "FREE",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2500"
        }
      })
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-upplink.jpg"]
    }
  };
}

export default function SearchLayout({
  children,
  searchParams
}: {
  children: React.ReactNode;
  searchParams: { q?: string; city?: string };
}) {
  const q = searchParams?.q || "Marketplace";
  const city = searchParams?.city || "Korba";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* 🔥 100% LEGAL - NO TRADEMARK ISSUES */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000ms"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000ms"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <nav className="flex items-center text-sm text-white/90 mb-8">
            <span className="flex items-center mr-3">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              UPP-LINK Korba
            </span>
            <svg className="w-4 h-4 mx-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-bold">{city}</span> → <span className="font-bold text-white/90">{q}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pr-16">
              {/* 🔥 LEGAL BADGES */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/30 mb-8">
                <div className="w-3 h-12 bg-white rounded-xl mr-4"></div>
                <span className="font-black text-xl uppercase tracking-widest text-white drop-shadow-lg">#1 Korba Local Directory</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                Best {q} in {city}
                <span className="block text-4xl lg:text-6xl text-yellow-200 font-light tracking-tight">✅ Verified Results</span>
              </h1>
              
              {/* 🔥 OUR UNIQUE SELLING POINTS */}
              <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6 mb-12">
                <div className="flex items-start p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-emerald-400/30 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white mb-2">100% Verified</h3>
                    <p className="text-white/90 text-lg">Video verified owners • Real photos • Direct contact</p>
                  </div>
                </div>
                
                <div className="flex items-start p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-400/30 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020 18a9.001 9.001 0 10-9-9.945z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white mb-2">FREE Forever</h3>
                    <p className="text-white/90 text-lg">No paid plans • No hidden charges • Premium features free</p>
                  </div>
                </div>
              </div>

              {/* 🔥 COMPARISON TABLE - GENERIC & LEGAL */}
              <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 mb-12">
                <h4 className="text-2xl font-black text-white mb-6 text-center">Why Local Businesses Choose UPP-LINK</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/30">
                        <th className="py-4 pr-8 font-black text-white text-lg">Feature</th>
                        <th className="py-4 px-8 font-black text-emerald-300 text-lg text-center">UPP-LINK</th>
                        <th className="py-4 px-8 font-black text-orange-300 text-lg text-center">Others</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/90">
                      <tr className="border-b border-white/20 hover:bg-white/10">
                        <td className="py-4 pr-8 font-semibold">Verification</td>
                        <td className="py-4 px-8 text-center"><span className="text-emerald-400 font-black text-xl">✅ VIDEO</span></td>
                        <td className="py-4 px-8 text-center">📞 Basic</td>
                      </tr>
                      <tr className="border-b border-white/20 hover:bg-white/10">
                        <td className="py-4 pr-8 font-semibold">Cost</td>
                        <td className="py-4 px-8 text-center"><span className="text-emerald-400 font-black text-xl">🆓 FREE</span></td>
                        <td className="py-4 px-8 text-center">💰 Paid</td>
                      </tr>
                      <tr className="hover:bg-white/10">
                        <td className="py-4 pr-8 font-semibold">Local Focus</td>
                        <td className="py-4 px-8 text-center"><span className="text-emerald-400 font-black text-xl">🏆 MP/CG #1</span></td>
                        <td className="py-4 px-8 text-center">📍 National</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#listings"
                  className="flex-1 bg-white text-orange-600 font-black text-xl py-8 px-12 rounded-3xl text-center uppercase tracking-widest shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 hover:bg-orange-50"
                >
                  🔍 View Verified {q} in {city}
                </a>
                <a 
                  href="/signup"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xl py-8 px-12 rounded-3xl text-center uppercase tracking-widest shadow-2xl hover:shadow-3xl hover:-translate-y-1 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                >
                  🚀 List Your Business FREE
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center lg:text-left">
              <div className="p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30">
                <div className="text-4xl lg:text-5xl font-black text-yellow-300 mb-4">24x7</div>
                <div className="text-xl font-bold text-white uppercase tracking-widest">Support</div>
              </div>
              <div className="p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30">
                <div className="text-4xl lg:text-5xl font-black text-yellow-300 mb-4">10K+</div>
                <div className="text-xl font-bold text-white uppercase tracking-widest">Users</div>
              </div>
              <div className="p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30">
                <div className="text-4xl lg:text-5xl font-black text-yellow-300 mb-4">4.9⭐</div>
                <div className="text-xl font-bold text-white uppercase tracking-widest">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>{children}</main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000ms { animation-delay: 2s; }
        .animation-delay-4000ms { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
