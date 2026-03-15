import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    console.log(`🔥 INDEX-GOOGLE: Processing ${url}`);

    if (!url || typeof url !== 'string') {
      console.error("❌ No valid URL provided");
      return NextResponse.json({ 
        success: false, 
        error: "URL is required and must be a string" 
      }, { status: 400 });
    }

    // 🔥 Environment Variables Check
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      console.error("❌ Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY");
      return NextResponse.json({ 
        success: false, 
        error: "Google credentials missing" 
      }, { status: 500 });
    }

    // ✅ Google Auth (Production Ready)
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    // Get access token
    const authResponse = await auth.authorize();
    if (!authResponse.access_token) {
      console.error("❌ Failed to get Google access token");
      return NextResponse.json({ 
        success: false, 
        error: "Google authentication failed" 
      }, { status: 401 });
    }

    console.log(`🔑 Auth token obtained, indexing: ${url}`);

    // 🔥 Google Indexing API Call
    const googleResponse = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authResponse.access_token}`,
      },
      body: JSON.stringify({
        url: url,
        type: "URL_UPDATED",
      }),
    });

    const googleData = await googleResponse.json();

    console.log(`🌐 Google API Status: ${googleResponse.status}`, googleData);

    // ✅ SUCCESS LOGIC: Google API accepts request OR other 2xx
    if (googleResponse.status >= 200 && googleResponse.status < 300) {
      console.log(`🚀 SUCCESS: ${url}`);
      return NextResponse.json({ 
        success: true, 
        message: "Google indexing request accepted",
        url,
        googleStatus: googleResponse.status
      });
    } else {
      console.error(`❌ Google API Error ${googleResponse.status}:`, googleData);
      return NextResponse.json({ 
        success: false, 
        error: googleData.error?.message || "Google API rejected request",
        details: googleData
      }, { status: googleResponse.status || 502 });
    }

  } catch (error: any) {
    console.error("💥 CRITICAL ERROR in index-google:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal server error",
      code: error.code || "UNKNOWN"
    }, { status: 500 });
  }
}
