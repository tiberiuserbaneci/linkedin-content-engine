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

    // Step 3: Upsert profile (check-then-update/insert to avoid duplicates)
    steps.push("checking for existing profile");
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("linkedin_url", linkedin_url)
      .maybeSingle();

    let profile;
    if (existing) {
      steps.push(`found existing profile ${existing.id}, updating`);
      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({
          linkedin_handle,
          full_name: author.name,
          headline: author.headline,
          avatar_url: author.avatar_url,
          followers_count: author.followers_count ?? 0,
          category,
          scraped_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: `Failed to update profile: ${updateError.message}`, steps },
          { status: 500 }
        );
      }
      profile = updated;
    } else {
      steps.push("no existing profile, inserting new");
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({
          linkedin_url,
          linkedin_handle,
          full_name: author.name,
          headline: author.headline,
          avatar_url: author.avatar_url,
          followers_count: author.followers_count ?? 0,
          category,
          scraped_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: `Failed to insert profile: ${insertError.message}`, steps },
          { status: 500 }
        );
      }
      profile = inserted;
    }
    steps.push(`profile saved: ${profile.id}`);

    // Step 4: Insert posts — deduplicate against existing URLs
    steps.push("fetching existing post URLs for deduplication");
    const { data: existingPosts } = await supabase
      .from("posts")
      .select("linkedin_post_url")
      .eq("profile_id", profile.id);

    const existingUrls = new Set(
      (existingPosts || []).map((p) => p.linkedin_post_url)
    );

    const postRecords = posts
      .map((post) => ({
        profile_id: profile.id,
        linkedin_post_url: post.url || `${linkedin_url}/post-${Date.now()}-${Math.random()}`,
        content: post.content,
        published_at: post.published_at,
        reactions_count: post.reactions_count,
        comments_count: post.comments_count,
        shares_count: post.shares_count,
        post_type: post.post_type || "text",
        word_count: post.content.split(/\s+/).length,
        raw_json: post.raw_json,
      }))
      .filter((record) => !existingUrls.has(record.linkedin_post_url));

    steps.push(`${posts.length} scraped, ${postRecords.length} new (${posts.length - postRecords.length} duplicates skipped)`);

    if (postRecords.length > 0) {
      const { error: postsError } = await supabase
        .from("posts")
        .insert(postRecords);

      if (postsError) {
        return NextResponse.json(
          { error: `Failed to save posts: ${postsError.message}`, steps },
          { status: 500 }
        );
      }
    }
    steps.push(`posts saved: ${postRecords.length}`);

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
