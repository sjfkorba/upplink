import { MetadataRoute } from 'next';
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // FIXED: Abhi ke liye Vercel link use karein, baad mein domain connect hote hi badal dena
  const baseUrl = "https://upplink.vercel.app"; 

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/business`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // 2. Dynamic Real Listings (From Firebase)
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const snapshot = await getDocs(collection(db, "listings"));
    listingRoutes = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      // ID ya Slug jo bhi aap use kar rahe hain
      const identifier = data.slug || docSnap.id; 
      
      return {
        url: `${baseUrl}/listings/${identifier}`,
        lastModified: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error("Firebase Sitemap Error:", e);
  }

  // 3. Programmatic SEO Routes (Advanced Keywords)
  const cities = ["Korba", "Raipur", "Bilaspur", "Bhilai", "Indore", "Bhopal"];
  const services = ["Cab Service", "Taxi Service", "Used Cars", "Car Dealer"];

  const pSeoRoutes: MetadataRoute.Sitemap = [];
  cities.forEach(city => {
    services.forEach(service => {
      const query = encodeURIComponent(`${service} in ${city}`.toLowerCase());
      pSeoRoutes.push({
        url: `${baseUrl}/search?q=${query}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return [...staticRoutes, ...listingRoutes, ...pSeoRoutes];
}