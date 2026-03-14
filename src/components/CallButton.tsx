"use client";

import { Phone } from "lucide-react";

export default function CallButton({ phoneNumber }: { phoneNumber: string }) {
  if (!phoneNumber) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6 md:hidden">
      <a
        href={`tel:${phoneNumber}`}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-lg font-bold text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform active:scale-95"
      >
        <Phone size={20} fill="currentColor" />
        Call Now
      </a>
    </div>
  );
}