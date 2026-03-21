import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

const APIFY_TOKEN = process.env.APIFY_TOKEN!;

async function runApifyActor(actorId: string, input: Record<string, unknown>, timeoutMs = 50000) {
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!startRes.ok) return [];

  const startData = await startRes.json();
  const runId = startData.data.id;
  const startTime = Date.now();
  let status = startData.data.status;

  while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
    if (Date.now() - startTime > timeoutMs) break;
    await new Promise((r) => setTimeout(r, 3000));
    const pollRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const pollData = await pollRes.json();
    status = pollData.data.status;
  }

  if (status !== "SUCCEEDED") return [];

  const dataRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
  );
  return dataRes.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firm_ids,
      titles = ["GP", "MP", "Partner", "Principal", "Associate"],
    }: { firm_ids: string[]; titles: string[] } = body;

    if (!firm_ids?.length) {
      return NextResponse.json(
        { error: "firm_ids array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get firm data
    const { data: firms } = await supabase
      .from("vc_firms")
      .select("*")
      .in("id", firm_ids);

    if (!firms?.length) {
      return NextResponse.json({ error: "No firms found" }, { status: 404 });
    }

    const titleWords = titles.map((t) => t.toLowerCase());
    let totalContacts = 0;
    let activeContacts = 0;

    for (const firm of firms) {
      if (!firm.linkedin_url) continue;

      // Scrape employees
      const employees = await runApifyActor(
        "harvestapi~linkedin-company-employees",
        { companyUrl: firm.linkedin_url }
      );

      // Filter by title and current position
      const matchingEmployees = employees.filter((emp: Record<string, unknown>) => {
        const empTitle = ((emp.title || emp.position || emp.headline || "") as string).toLowerCase();
        const isCurrent = emp.has_current_position !== false && emp.isCurrentEmployee !== false;
        const titleMatch = titleWords.some((tw) => empTitle.includes(tw));
        return isCurrent && titleMatch;
      });

      // Save contacts
      for (const emp of matchingEmployees) {
        const contactUrl = (emp.linkedinUrl || emp.profileUrl || emp.url || "") as string;
        if (!contactUrl) continue;

        const contactData = {
          firm_id: firm.id,
          linkedin_url: contactUrl,
          full_name: (emp.name || emp.fullName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Unknown") as string,
          title: (emp.title || emp.position || emp.headline || "") as string,
          avatar_url: (emp.profilePicture || emp.avatar || emp.picture || null) as string | null,
          followers_count: (emp.followerCount || emp.followersCount || null) as number | null,
          has_current_position: true,
          about: (emp.about || emp.summary || null) as string | null,
          location: (emp.location || null) as string | null,
          raw_json: emp,
        };

        // Check activity — get last 3 posts
        try {
          const posts = await runApifyActor(
            "supreme_coder~linkedin-post",
            { urls: [contactUrl], limitPerSource: 3 },
            30000
          );

          const postItems = (posts as Record<string, unknown>[]).filter(
            (p) => p.type !== "document" && ((p.text || p.content) as string)?.trim()
          );

          if (postItems.length > 0) {
            const latestPost = postItems[0];
            const postDate = (latestPost.postedAtISO as string) ||
              (latestPost.postedAtTimestamp ? new Date(latestPost.postedAtTimestamp as number).toISOString() : null);

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            Object.assign(contactData, {
              last_post_date: postDate,
              last_post_content: ((latestPost.text || latestPost.content || "") as string).slice(0, 200),
              is_active: postDate ? new Date(postDate) > thirtyDaysAgo : false,
            });

            if ((contactData as Record<string, unknown>).is_active) activeContacts++;
          }
        } catch {
          // Activity check failed — skip, default is_active=false
        }

        const { error } = await supabase
          .from("vc_contacts")
          .upsert(contactData, { onConflict: "linkedin_url", ignoreDuplicates: false });

        if (!error) totalContacts++;
      }
    }

    return NextResponse.json({
      contacts_found: totalContacts,
      active_contacts: activeContacts,
    });
  } catch (error) {
    console.error("Scrape people error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scrape people" },
      { status: 500 }
    );
  }
}
