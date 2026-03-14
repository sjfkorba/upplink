// app/api/seo-keywords/route.ts (bilkul yehi file banao)
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { serviceCategory, city, businessName } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY missing in .env.local");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const prompt = `Generate exactly 25 SEO keywords for Indian local business:
- Category: "${serviceCategory}"
- City: "${city}"
- Name: "${businessName || ''}"

Return ONLY valid JSON array like: ["keyword1", "keyword2"]

Examples for "Car Service & Repair" in "Korba":
["car ac repair korba", "best car mechanic korba", "toyota service korba"]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    // Parse keywords from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let keywords: string[] = [];
    
    try {
      // Extract JSON array
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }

    // Clean and limit
    keywords = (keywords || [])
      .filter((k: any) => typeof k === 'string' && k.trim().length > 2)
      .map((k: string) => k.trim().toLowerCase())
      .slice(0, 25);

    return NextResponse.json({ keywords });
  } catch (error: any) {
    console.error("SEO API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
