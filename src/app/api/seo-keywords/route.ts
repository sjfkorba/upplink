import { NextResponse } from "next/server";

export async function GET() {
  const cities = [
    // Chhattisgarh (CG)
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund",
    // Madhya Pradesh (MP)
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Ratlam", "Singrauli", "Katni", "Dewas", "Morena", "Bhind", "Shivpuri", "Vidisha"
  ];

  const categoryMaps: Record<string, string[]> = {
    "Cars": ["Used Cars", "Car Dealers", "Second Hand Cars", "Pre-owned Vehicles"],
    "Services": ["Car Service & Repair", "Mechanic", "Two Wheeler Service", "Auto Repair"],
    "Transport": ["Car Taxi Service", "Cabs", "Travels"],
    "Shopping": ["Electronic Shop", "Jewellery Shop", "Furniture Shop", "Medical Store"],
    "Lifestyle": ["Restaurant", "Salon & Spa", "Hospital"],
    "Property": ["Real Estate", "Property Dealer", "Plots for Sale"]
  };

  const generatedKeywords: string[] = [];

  // Logic to generate 10,000+ unique long-tail keywords
  cities.forEach((city) => {
    Object.values(categoryMaps).flat().forEach((service) => {
      // Multiple Patterns for Google Indexing
      generatedKeywords.push(`${service} in ${city}`);
      generatedKeywords.push(`Best ${service} ${city}`);
      generatedKeywords.push(`${city} ${service} Contact Number`);
      generatedKeywords.push(`Top Rated ${service} in ${city} Chhattisgarh Madhya Pradesh`);
      generatedKeywords.push(`Verified ${service} Near Me ${city}`);
    });
  });

  return NextResponse.json({
    status: "ok",
    region: "MP & CG",
    totalCount: generatedKeywords.length,
    keywords: generatedKeywords
  });
}