import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch all profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    // Get counts for each profile
    const profilesWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        const [postsResult, analysisResult, ideasResult] = await Promise.all([
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("profile_id", profile.id),
          supabase
            .from("content_analyses")
            .select("created_at")
            .eq("profile_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1),
          supabase
            .from("content_ideas")
            .select("id", { count: "exact", head: true })
            .eq("profile_id", profile.id),
        ]);

        return {
          ...profile,
          posts_count: postsResult.count || 0,
          last_analysis_at:
            analysisResult.data && analysisResult.data.length > 0
              ? analysisResult.data[0].created_at
              : null,
          ideas_count: ideasResult.count || 0,
        };
      })
    );

    return NextResponse.json(profilesWithStats);
  } catch (error) {
    console.error("Profiles error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
