import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { scrapeLinkedInPosts } from "@/lib/apify";
import type { Category } from "@/lib/database.types";

export async function POST(request: NextRequest) {
  const steps: string[] = [];

  try {
    steps.push("parsing request body");
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

    // Step 1: Supabase client init
    steps.push("creating supabase client");
    let supabase;
    try {
      supabase = createServerClient();
      steps.push("supabase client created OK");
    } catch (e) {
      return NextResponse.json(
        { error: "Supabase init failed", detail: String(e), steps },
        { status: 500 }
      );
    }

    // Step 2: Scrape posts via Apify
    steps.push("starting apify scrape");
    const { posts, author } = await scrapeLinkedInPosts(linkedin_url, max_posts);
    steps.push(`apify scrape done: ${posts.length} posts`);

    // Step 3: Upsert profile
    steps.push("upserting profile to supabase");
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
      return NextResponse.json(
        { error: `Failed to save profile: ${profileError.message}`, steps },
        { status: 500 }
      );
    }
    steps.push(`profile upserted: ${profile.id}`);

    // Step 4: Insert posts (skip duplicates)
    steps.push("upserting posts to supabase");
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

    const { error: postsError } = await supabase
      .from("posts")
      .upsert(postRecords, { onConflict: "linkedin_post_url", ignoreDuplicates: true });

    if (postsError) {
      return NextResponse.json(
        { error: `Failed to save posts: ${postsError.message}`, steps },
        { status: 500 }
      );
    }
    steps.push(`posts upserted: ${posts.length}`);

    return NextResponse.json({
      profile_id: profile.id,
      posts_count: posts.length,
      profile,
      steps,
    });
  } catch (_err) {
    const err = _err as Error;
    console.error("Scrape error:", err.message);
    return NextResponse.json(
      { error: err.message ?? "Scrape failed", steps },
      { status: 500 }
    );
  }
}
