export default function StickyCall({ phoneNumber }: { phoneNumber: string }) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 md:hidden">
      <a 
        href={`tel:${phoneNumber}`}
        className="flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-lg font-bold text-white shadow-2xl active:scale-95 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        Call Now
      </a>
    </div>
  );
}