import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {

  const q = searchParams?.q || "Marketplace";

  const title =
    `${q.charAt(0).toUpperCase() + q.slice(1)} | UPP-LINK Chhattisgarh & MP`;

  return {
    title,
    description: `Find the best ${q} in Korba, Raipur, Bilaspur and across Madhya Pradesh & Chhattisgarh. Verified listings on UPP-LINK.`,
    openGraph: {
      title,
      description: `Verified results for ${q} on UPP-LINK Marketplace.`,
      images: ["/og-image.jpg"],
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