import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firm_id = searchParams.get("firm_id");
    const status = searchParams.get("status");
    const is_active = searchParams.get("is_active");
    const title_filter = searchParams.get("title_filter");

    const supabase = createServerClient();

    let query = supabase
      .from("vc_contacts")
      .select("*, vc_firms(name, focus_areas), vc_outreach(id, status, dm_text, dm_generated_at, notes)")
      .eq("has_current_position", true)
      .order("is_active", { ascending: false })
      .order("last_post_date", { ascending: false, nullsFirst: false });

    if (firm_id) {
      query = query.eq("firm_id", firm_id);
    }

    if (is_active === "true") {
      query = query.eq("is_active", true);
    }

    if (title_filter) {
      query = query.ilike("title", `%${title_filter}%`);
    }

    const { data: contacts, error } = await query;

    if (error) throw new Error(`Failed to fetch contacts: ${error.message}`);

    // Filter by outreach status if specified
    let filtered = contacts || [];
    if (status && status !== "all") {
      filtered = filtered.filter((c) => {
        const outreach = (c.vc_outreach as Record<string, unknown>[])?.[0];
        if (status === "to_contact") return !outreach || outreach.status === "to_contact";
        return outreach?.status === status;
      });
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
