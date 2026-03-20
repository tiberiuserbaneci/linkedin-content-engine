import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { analyzeProfile, generateIdeas } from "@/lib/claude";

export const maxDuration = 120; // Allow up to 2 minutes for Claude API calls

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profile_id,
      research_space,
    }: { profile_id: string; research_space?: string } = body;

    if (!profile_id) {
      return NextResponse.json(
        { error: "profile_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch top 30 posts by reactions for analysis (limits Claude API payload)
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("profile_id", profile_id)
      .order("reactions_count", { ascending: false })
      .limit(30);

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: "No posts found for this profile. Scrape first." },
        { status: 400 }
      );
    }

    // Step 1: Analyze posts with Claude
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

    // Step 2: Generate ideas with Claude + web search
    const ideasData = await generateIdeas(analysis, research_space);

    // Save ideas
    const ideaRecords = ideasData.map((idea) => ({
      analysis_id: analysis.id,
      profile_id,
      ...idea,
    }));

    const { data: ideas, error: ideasError } = await supabase
      .from("content_ideas")
      .insert(ideaRecords)
      .select();

    if (ideasError) {
      throw new Error(`Failed to save ideas: ${ideasError.message}`);
    }

    return NextResponse.json({
      analysis_id: analysis.id,
      analysis,
      ideas,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
