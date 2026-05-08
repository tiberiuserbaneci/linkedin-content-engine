import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateIdeas } from "@/lib/claude";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      analysis_id,
      profile_id,
      research_space,
    }: { analysis_id: string; profile_id: string; research_space?: string } = body;

    if (!analysis_id || !profile_id) {
      return NextResponse.json(
        { error: "analysis_id and profile_id are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("content_analyses")
      .select("*")
      .eq("id", analysis_id)
      .single();

    if (analysisError || !analysis) {
      throw new Error(`Failed to fetch analysis: ${analysisError?.message || "not found"}`);
    }

    // Fetch top 10 posts by reactions for this profile
    const { data: topPosts } = await supabase
      .from("posts")
      .select("content, reactions_count, comments_count")
      .eq("profile_id", profile_id)
      .order("reactions_count", { ascending: false })
      .limit(10);

    // Generate ideas with Claude, including real post examples
    const ideasData = await generateIdeas(analysis, research_space, topPosts || []);

    // Save ideas
    const ideaRecords = ideasData.map((idea) => ({
      analysis_id,
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
      ideas,
    });
  } catch (error) {
    console.error("Ideas generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ideas generation failed" },
      { status: 500 }
    );
  }
}
