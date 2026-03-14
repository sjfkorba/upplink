import { NextResponse } from "next/server";

export async function GET() {
  const keywords = [
    "used cars bhopal",
    "car dealers indore",
    "mechanics korba",
    "hospitals raipur",
    "car service gwalior"
  ];

  return NextResponse.json({
    success: true,
    keywords
  });
}