import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

const APIFY_TOKEN = process.env.APIFY_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      keywords,
      max_results = 10,
    }: { keywords: string[]; max_results?: number } = body;

    if (!keywords?.length) {
      return NextResponse.json(
        { error: "keywords array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const allFirms: Record<string, unknown>[] = [];

    for (const keyword of keywords) {
      // Run harvestapi/linkedin-profile-search
      const startRes = await fetch(
        `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/runs?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword,
            maxResults: Math.min(max_results, 25),
            type: "company",
          }),
        }
      );

      if (!startRes.ok) continue;

      const startData = await startRes.json();
      const runId = startData.data.id;

      // Poll for completion (max 60s)
      const startTime = Date.now();
      let status = startData.data.status;

      while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
        if (Date.now() - startTime > 55000) break;
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

      // Filter to companies only
      for (const item of items) {
        if (item.type !== "company" && item.companyUrl == null && item.linkedinUrl == null) continue;
        const url = item.linkedinUrl || item.companyUrl || item.url;
        if (!url) continue;

        allFirms.push({
          name: item.name || item.title || "Unknown",
          linkedin_url: url,
          linkedin_handle: url.match(/company\/([^/?]+)/)?.[1] || url,
          description: item.description || item.headline || null,
          focus_areas: item.industries || item.specialties || [],
          location: item.location || null,
          employee_count: item.employeeCount || item.staffCount || null,
          website: item.website || null,
          follower_count: item.followerCount || null,
          scraped_at: new Date().toISOString(),
        });
      }
    }

    // Deduplicate by linkedin_url
    const uniqueFirms = Object.values(
      allFirms.reduce<Record<string, Record<string, unknown>>>((acc, firm) => {
        acc[firm.linkedin_url as string] = firm;
        return acc;
      }, {})
    );

    if (uniqueFirms.length === 0) {
      return NextResponse.json({ firms_found: 0, firms: [] });
    }

    // Upsert to DB
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
