import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { scrapeLinkedInPosts } from "@/lib/apify";
import type { Category } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  // Temporary debug: verify all env vars are loaded
  return NextResponse.json({
    debug: {
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) ?? "NOT SET",
      service_key: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) ?? "NOT SET",
      apify_token: process.env.APIFY_TOKEN?.substring(0, 10) ?? "NOT SET",
    },
  });

  try {
    const body = await request.json();
    const {
      linkedin_url,
      category,
      max_posts = 50,
    }: { linkedin_url: string; category: Category; max_posts?: number } = body;

    if (!linkedin_url || !category) {
      return NextResponse.json(
        { error: "linkedin_url and category are required" },
        { status: 400 }
      );
    }

    // Extract handle from URL
    const handleMatch = linkedin_url.match(
      /linkedin\.com\/in\/([^/?]+)/
    );
    const linkedin_handle = handleMatch?.[1] ?? linkedin_url;

    // Scrape posts via Apify
    const { posts, author } = await scrapeLinkedInPosts(linkedin_url, max_posts);

    const supabase = createServerClient();

    // Upsert profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          linkedin_url,
          linkedin_handle,
          full_name: author.name,
          headline: author.headline,
          avatar_url: author.avatar_url,
          followers_count: author.followers_count,
          category,
          scraped_at: new Date().toISOString(),
        },
        { onConflict: "linkedin_url" }
      )
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to save profile: ${profileError?.message}`);
    }

    // Insert posts (skip duplicates)
    const postRecords = posts.map((post) => ({
      profile_id: profile.id,
      linkedin_post_url: post.url || `${linkedin_url}/post-${Date.now()}-${Math.random()}`,
      content: post.content,
      published_at: post.published_at,
      reactions_count: post.reactions_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count,
      post_type: "text" as const,
      word_count: post.content.split(/\s+/).length,
      raw_json: post.raw_json,
    }));

    // Use upsert to skip duplicates
    const { error: postsError } = await supabase
      .from("posts")
      .upsert(postRecords, { onConflict: "linkedin_post_url", ignoreDuplicates: true });

    if (postsError) {
      throw new Error(`Failed to save posts: ${postsError?.message}`);
    }

    return NextResponse.json({
      profile_id: profile.id,
      posts_count: posts.length,
      profile,
    });
  } catch (_err) {
    const err = _err as Error;
    console.error("Scrape error:", err.message);
    return NextResponse.json(
      { error: err.message ?? "Scrape failed" },
      { status: 500 }
    );
  }
}
