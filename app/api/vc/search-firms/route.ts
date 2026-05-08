import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

const APIFY_TOKEN = process.env.APIFY_TOKEN!;
const COMPANY_SEARCH_ACTOR = "apimaestro~linkedin-companies-search-scraper";
const MAX_UNIQUE_FIRMS = 50;

// Parse numeric values from strings like "556 followers" or "1,200 employees"
function parseNumber(val: unknown): number | null {
  if (!val) return null;
  const num = parseInt(String(val).replace(/[^0-9]/g, ""));
  return isNaN(num) ? null : num;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      keywords,
    }: { keywords: string[] } = body;

    if (!keywords?.length) {
      return NextResponse.json(
        { error: "keywords array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    // Deduplicate by linkedin_url as we go
    const firmsByUrl: Record<string, Record<string, unknown>> = {};

    // Run keywords sequentially — one Apify call at a time
    for (const keyword of keywords) {
      // Stop if we already have enough
      if (Object.keys(firmsByUrl).length >= MAX_UNIQUE_FIRMS) break;

      const startRes = await fetch(
        `https://api.apify.com/v2/acts/${COMPANY_SEARCH_ACTOR}/runs?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword,
            page_number: 1,
          }),
        }
      );

      if (!startRes.ok) continue;

      const startData = await startRes.json();
      const runId = startData.data.id;

      // Poll for completion (max 50s per keyword)
      const startTime = Date.now();
      let status = startData.data.status;

      while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
        if (Date.now() - startTime > 50000) break;
        await new Promise((r) => setTimeout(r, 3000));
        const pollRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
        );
        const pollData = await pollRes.json();
        status = pollData.data.status;
      }

      if (status !== "SUCCEEDED") continue;

      const dataRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
      );
      const items = await dataRes.json();

      for (const item of items) {
        if (Object.keys(firmsByUrl).length >= MAX_UNIQUE_FIRMS) break;

        const url = item.linkedinUrl || item.linkedin_url || item.companyUrl || item.url || item.company_url;
        if (!url || typeof url !== "string") continue;
        if (!url.includes("linkedin.com/company/")) continue;

        // Skip if already seen
        if (firmsByUrl[url]) continue;

        firmsByUrl[url] = {
          name: item.name || item.companyName || item.company_name || item.title || "Unknown",
          linkedin_url: url,
          linkedin_handle: url.match(/company\/([^/?]+)/)?.[1] || url,
          description: item.description || item.about || item.headline || null,
          focus_areas: item.industries || item.specialties || item.industry
            ? (Array.isArray(item.industries || item.specialties) ? (item.industries || item.specialties) : [item.industry])
            : [],
          location: item.location || item.headquarters || null,
          employee_count: parseNumber(item.employeeCount || item.staffCount || item.employee_count),
          website: item.website || null,
          follower_count: parseNumber(item.followerCount || item.follower_count),
          scraped_at: new Date().toISOString(),
        };
      }
    }

    const uniqueFirms = Object.values(firmsByUrl);

    if (uniqueFirms.length === 0) {
      return NextResponse.json({ firms_found: 0, firms: [] });
    }

    const { data: firms, error } = await supabase
      .from("vc_firms")
      .upsert(uniqueFirms, { onConflict: "linkedin_url", ignoreDuplicates: false })
      .select();

    if (error) throw new Error(`Failed to save firms: ${error.message}`);

    return NextResponse.json({ firms_found: firms?.length || 0, firms: firms || [] });
  } catch (error) {
    console.error("Search firms error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    );
  }
}
