"use client";

import { useState } from "react";
import Link from "next/link"; 
import HeroSearch from "@/components/HeroSearch";
import CategoryBar from "@/components/CategoryBar";
import ListingCard from "@/components/ListingCard";
import { SearchX } from "lucide-react";

// Professional Fix: Destructuring with a default value [] prevents 'undefined' crash
export default function MainMarketplace({ allListings = [] }: { allListings?: any[] }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Safety Logic: Ensure allListings is always an array
  const safeListings = Array.isArray(allListings) ? allListings : [];

  // Filtering Logic with Safety Checks (?.)
  const filtered = safeListings.filter((item) => {
    if (!item) return false;

    // Check category/type against the active filter
    const matchesCategory = 
      filter === "all" || 
      item.type?.toLowerCase() === filter.toLowerCase() || 
      item.category?.toLowerCase() === filter.toLowerCase() ||
      item.bizCategory?.toLowerCase() === filter.toLowerCase();

    // Check title against search query safely
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const premium = filtered.filter((l: any) => l.isPremium);
  const regular = filtered.filter((l: any) => !l.isPremium);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="bg-white py-24 px-4 overflow-hidden relative border-b border-slate-50">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-slate-900">
            Find. Buy. <br /> <span className="text-indigo-600">Upgrade.</span>
          </h1>
          <p className="mt-8 text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
            Experience the next generation of marketplace
          </p>
          
          <HeroSearch onSearch={(val: string) => setSearchQuery(val)} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
      </section>

      {/* 2. SMART CATEGORY BAR */}
      <CategoryBar activeFilter={filter} onFilterChange={(val: string) => setFilter(val)} />

      {/* 3. CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        
        {/* FEATURED / PREMIUM SECTION */}
        {premium.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-12 border-l-4 border-indigo-600 pl-6">
              <div>
                <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">Top Tier Deals</span>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Elite Collections</h2>
              </div>
              <Link href="/featured" className="text-xs font-black uppercase underline decoration-indigo-200 underline-offset-8 hover:text-indigo-600 transition-all">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {premium.map((item) => (
                <ListingCard key={item.id} data={item} premium={true} />
              ))}
            </div>
          </section>
        )}

        {/* NATIVE AD SLOT */}
        <div className="h-60 bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center relative group overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Google Adsense Slot</p>
            <p className="text-xs text-slate-200 italic mt-2 font-bold italic">Premium Monetization Area</p>
            <div className="absolute inset-0 bg-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* REGULAR LISTINGS SECTION */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Recent Adds</h2>
            <div className="h-[2px] flex-1 bg-slate-100"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Units</span>
          </div>
          
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <SearchX size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">No listings match your search.</p>
              <button 
                onClick={() => {setFilter("all"); setSearchQuery("");}}
                className="mt-6 text-xs font-black uppercase text-indigo-600 underline underline-offset-8"
              >
                Reset Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {regular.map((item) => (
                <ListingCard key={item.id} data={item} premium={false} />
              ))}
            </div>
          )}
          
          <div className="mt-20 flex justify-center">
            <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
                Explore Global Listings
            </button>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-white py-24 px-4 border-t border-slate-100">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-6">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">UPP-LINK <span className="text-indigo-600">.</span></h3>
                <p className="text-slate-400 max-w-sm font-medium leading-relaxed uppercase text-[10px] tracking-widest">
                  The ultimate destination for luxury wheels and verified local services. Precision curated for the elite users of Chhattisgarh.
                </p>
            </div>
            <div className="flex flex-col items-center md:items-end justify-center space-y-4">
               <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.5em]">© 2026 UPP-LINK MARKETPLACE</p>
               <div className="flex gap-6 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
                  <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
                  <Link href="/support" className="hover:text-indigo-600">Support</Link>
               </div>
            </div>
         </div>
      </footer>
    </>
  );
}