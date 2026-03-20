import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Get latest analysis for this profile
    const { data: analysis, error: analysisError } = await supabase
      .from("content_analyses")
      .select("*")
      .eq("profile_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (analysisError) {
      return NextResponse.json(
        { error: "No analysis found for this profile" },
        { status: 404 }
      );
    }

    // Get ideas for this analysis
    const { data: ideas, error: ideasError } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("analysis_id", analysis.id)
      .order("position", { ascending: true });

    if (ideasError) {
      throw new Error(`Failed to fetch ideas: ${ideasError.message}`);
    }

    return NextResponse.json({
      analysis,
      ideas: ideas || [],
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
