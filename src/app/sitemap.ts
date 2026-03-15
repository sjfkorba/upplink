import { MetadataRoute } from 'next';
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upp-link.com";

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
    listingRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/listings/${data.slug}`,
        lastModified: data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error("Firebase Sitemap Error:", e);
  }

  // 3. Programmatic SEO Routes (From your Keyword Strategy)
  // Hum in keywords ko /search?q=... routes mein convert karenge
  const cities = [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Raigarh",
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Rewa"
  ];

  const services = [
    "Used Cars", "Car Dealer", "Mechanic", "Hospital", 
    "Electronic Shop", "Real Estate", "Jewellery Shop", "Salon"
  ];

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

  // Combine All: Total URLs can reach 10k+ easily
  return [...staticRoutes, ...listingRoutes, ...pSeoRoutes];
}