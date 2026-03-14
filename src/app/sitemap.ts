import { MetadataRoute } from 'next';
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://upp-link.com"; // Apni actual domain yahan dalein

  // 1. Static Routes (Main Navigation)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/business`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // 2. Dynamic Listing Routes (Fetching from Firebase)
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const snapshot = await getDocs(collection(db, "listings"));
    dynamicRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/listings/${data.slug}`,
        lastModified: data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}