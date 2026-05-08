import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { analyzeProfile } from "@/lib/claude";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile_id }: { profile_id: string } = body;

    if (!profile_id) {
      return NextResponse.json(
        { error: "profile_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch top 15 posts by reactions, only content + counts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("content, reactions_count, comments_count")
      .eq("profile_id", profile_id)
      .order("reactions_count", { ascending: false })
      .limit(15);

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: "No posts found for this profile. Scrape first." },
        { status: 400 }
      );
    }

    // Analyze posts with Claude (profile only, no ideas)
    const analysisData = await analyzeProfile(posts);

    // Save analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("content_analyses")
      .insert({
        profile_id,
        ...analysisData,
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error(`Failed to save analysis: ${analysisError.message}`);
    }

    return NextResponse.json({
      analysis_id: analysis.id,
      analysis,
    });
  } catch (error) {
    console.error("Profile analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Profile analysis failed" },
      { status: 500 }
    );
  }
}
