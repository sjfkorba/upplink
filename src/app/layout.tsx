import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UPPLINK: Verified Business Listings & Used Cars in CG & MP",
  description: "UPPLINK is India's most elite marketplace to buy/sell cars & discover verified businesses in Chhattisgarh & Madhya Pradesh. List your business for free today!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-[#FAFAFA] text-slate-900 antialiased`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}