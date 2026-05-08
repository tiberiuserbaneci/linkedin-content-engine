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

    // Get all posts for this profile (by reactions)
    const { data: rawPosts } = await supabase
      .from("posts")
      .select("id, content, reactions_count, comments_count, shares_count, linkedin_post_url, published_at, post_type")
      .eq("profile_id", id)
      .order("reactions_count", { ascending: false });

    // Deduplicate by first 120 chars of content (same post scraped as text+image variants)
    const seenContent = new Set<string>();
    const allPosts = (rawPosts || []).filter(post => {
      const key = post.content.trim().slice(0, 120);
      if (seenContent.has(key)) return false;
      seenContent.add(key);
      return true;
    });

    const topPosts = allPosts.slice(0, 5);

    const totalReactions = allPosts.reduce((sum, p) => sum + p.reactions_count, 0);
    const totalComments = allPosts.reduce((sum, p) => sum + p.comments_count, 0);
    const avgReactions = allPosts.length ? Math.round(totalReactions / allPosts.length) : 0;
    const avgComments = allPosts.length ? Math.round(totalComments / allPosts.length) : 0;

    return NextResponse.json({
      analysis,
      ideas: ideas || [],
      top_posts: topPosts,
      all_posts: allPosts,
      engagement_stats: {
        total_posts: allPosts.length,
        total_reactions: totalReactions,
        total_comments: totalComments,
        avg_reactions: avgReactions,
        avg_comments: avgComments,
      },
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
