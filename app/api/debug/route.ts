import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
    anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
    service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    apify: process.env.APIFY_TOKEN ? "SET" : "MISSING",
  });
}
