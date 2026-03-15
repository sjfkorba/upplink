"use client";

export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import ListingCard from "@/components/ListingCard";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

// 1. Search Content ko alag component mein rakhein
function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const listingsRef = collection(db, "listings");
        const snapshot = await getDocs(listingsRef);
        const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const searchTerms = q.toLowerCase().split(" ");
        const filtered = allData.filter((item: any) => {
          const content = `${item.listingTitle || ""} ${item.businessName || ""} ${item.location || ""} ${item.serviceCategory || ""} ${item.make || ""}`.toLowerCase();
          return searchTerms.every(term => content.includes(term));
        });

        setResults(filtered);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (q) fetchSearchResults();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-4 hover:gap-4 transition-all">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Results for: <span className="text-indigo-600">"{q}"</span>
          </h1>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
          {results.length} Verified Matches Found
        </p>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-40 text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-black uppercase tracking-widest text-slate-300">Scanning Database...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {results.map((item) => (
            <ListingCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-50 flex flex-col items-center">
          <Search size={40} className="text-slate-200 mb-8" />
          <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-400">No results found</h3>
          <Link href="/" className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
            Reset Global Feed
          </Link>
        </div>
      )}
    </div>
  );
}

// 2. Main Page component jo Suspense use karega
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20 px-6">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}