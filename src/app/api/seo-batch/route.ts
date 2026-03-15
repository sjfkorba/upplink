import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://upp-link.com";
  
  // Generate URLs
  const cities = ["Korba", "Raipur", "Bilaspur", "Bhopal", "Indore", "Jabalpur"];
  const services = ["Used Cars", "Mechanic", "Hospital", "Real Estate"];
  
  const batchLinks: string[] = [];
  cities.forEach(city => {
    services.forEach(service => {
      const query = encodeURIComponent(`${service} in ${city}`.toLowerCase());
      batchLinks.push(`${baseUrl}/search?q=${query}`);
    });
  });

  const dailyBatch = batchLinks.slice(0, 5); // Test with 5 first
  let successCount = 0;
  let detailedErrors: string[] = [];

  console.log(`🚀 Testing 5 URLs with detailed logging`);

  // 🔥 TEST ONE URL FIRST with full error details
  for (let i = 0; i < dailyBatch.length; i++) {
    const url = dailyBatch[i];
    
    try {
      console.log(`🔍 Testing URL ${i+1}: ${url}`);
      
      // 1. Check credentials
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (!clientEmail || !privateKey) {
        detailedErrors.push(`❌ Missing credentials for ${url}`);
        continue;
      }

      // 2. Google Auth
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/indexing"],
      });

      console.log(`🔑 Authenticating...`);
      const token = await auth.authorize();
      
      if (!token.access_token) {
        detailedErrors.push(`❌ No access token for ${url}`);
        continue;
      }

      console.log(`✅ Auth success, token received`);

      // 3. Google Indexing API
      const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED",
        }),
      });

      const data = await response.json();
      
      console.log(`🌐 Google Response [${response.status}]:`, data);

      // 4. Detailed success check
      if (response.status === 200) {
        successCount++;
        console.log(`✅ FULL SUCCESS ${successCount}: ${url}`);
      } else {
        detailedErrors.push(`❌ [${response.status}] ${url}: ${JSON.stringify(data)}`);
      }
      
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error: any) {
      console.error(`💥 DETAILED ERROR ${i+1}:`, error);
      detailedErrors.push(`💥 ${error.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    message: `📊 ${successCount}/${dailyBatch.length} URLs indexed! Errors: ${detailedErrors.length}`,
    debug: detailedErrors.slice(0, 3), // First 3 errors only
    stats: { success: successCount, total: dailyBatch.length }
  });
}
