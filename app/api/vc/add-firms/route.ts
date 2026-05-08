import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

const APIFY_TOKEN = process.env.APIFY_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkedin_urls }: { linkedin_urls: string[] } = body;

    if (!linkedin_urls?.length) {
      return NextResponse.json(
        { error: "linkedin_urls array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const firms: Record<string, unknown>[] = [];

    for (const url of linkedin_urls) {
      const cleanUrl = url.trim();
      if (!cleanUrl) continue;

      try {
        // Run supreme_coder/linkedin-profile-scraper for company data
        const startRes = await fetch(
          `https://api.apify.com/v2/acts/supreme_coder~linkedin-profile-scraper/runs?token=${APIFY_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: [cleanUrl] }),
          }
        );

        if (!startRes.ok) continue;

        const startData = await startRes.json();
        const runId = startData.data.id;

        // Poll (max 45s per URL)
        const startTime = Date.now();
        let status = startData.data.status;

        while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
          if (Date.now() - startTime > 45000) break;
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
        const item = items[0];
        if (!item) continue;

        firms.push({
          name: item.name || item.companyName || "Unknown",
          linkedin_url: cleanUrl,
          linkedin_handle: cleanUrl.match(/company\/([^/?]+)/)?.[1] || cleanUrl,
          description: item.description || item.about || null,
          focus_areas: item.specialties || item.industries || [],
          location: item.headquarter?.city
            ? `${item.headquarter.city}, ${item.headquarter.country || ""}`
            : item.location || null,
          employee_count: item.staffCount || item.employeeCount || null,
          website: item.website || null,
          follower_count: item.followerCount || null,
          scraped_at: new Date().toISOString(),
        });
      } catch {
        // Skip individual URL failures
      }
    }

    if (firms.length === 0) {
      return NextResponse.json({ firms_added: 0 });
    }

    const { data, error } = await supabase
      .from("vc_firms")
      .upsert(firms, { onConflict: "linkedin_url", ignoreDuplicates: false })
      .select();

    if (error) throw new Error(`Failed to save firms: ${error.message}`);

    return NextResponse.json({ firms_added: data?.length || 0 });
  } catch (error) {
    console.error("Add firms error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add firms" },
      { status: 500 }
    );
  }
}
