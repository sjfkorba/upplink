import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || "Marketplace";
  
  // Format Title: "Used Cars in Korba | UPP-LINK Chhattisgarh"
  const title = `${query.charAt(0).toUpperCase() + query.slice(1)} | UPP-LINK Chhattisgarh & MP`;
  
  return {
    title: title,
    description: `Find the best ${query} in Korba, Raipur, Bilaspur and across Madhya Pradesh & Chhattisgarh. Verified listings on UPP-LINK.`,
    openGraph: {
      title: title,
      description: `Verified results for ${query} on UPP-LINK Marketplace.`,
      images: ['/og-image.jpg'], // Agar aapke paas logo hai toh
    },
  };
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}