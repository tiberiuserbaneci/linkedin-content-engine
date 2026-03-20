const APIFY_TOKEN = process.env.APIFY_TOKEN!;
const ACTOR_ID = "supreme_coder~linkedin-post";
const POLL_INTERVAL_MS = 5000;
const MAX_TIMEOUT_MS = 180000; // 3 minutes

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

interface ApifyDatasetItem {
  text?: string;
  content?: string;
  url?: string;
  postedAt?: string;
  reactionsCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  author?: {
    name?: string;
    headline?: string;
    profilePicture?: string;
    followersCount?: number;
  };
  [key: string]: unknown;
}

export interface ScrapedPost {
  content: string;
  url: string;
  published_at: string | null;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  raw_json: Record<string, unknown>;
}

export interface ScrapedAuthor {
  name: string;
  headline: string | null;
  avatar_url: string | null;
  followers_count: number;
}

export async function scrapeLinkedInPosts(
  linkedinUrl: string,
  maxPosts: number = 50
): Promise<{ posts: ScrapedPost[]; author: ScrapedAuthor }> {
  // Start the actor run
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileUrls: [linkedinUrl],
        maxPosts,
      }),
    }
  );

  if (!startRes.ok) {
    const err = await startRes.text();
    throw new Error(`Failed to start Apify actor: ${err}`);
  }

  const startData: ApifyRunResponse = await startRes.json();
  const runId = startData.data.id;

  // Poll for completion
  const startTime = Date.now();
  let status = startData.data.status;

  while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
    if (Date.now() - startTime > MAX_TIMEOUT_MS) {
      throw new Error("Apify actor run timed out after 3 minutes");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const pollRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    );
    const pollData: ApifyRunResponse = await pollRes.json();
    status = pollData.data.status;
  }

  if (status !== "SUCCEEDED") {
    throw new Error(`Apify actor run ${status}`);
  }

  // Fetch the dataset
  const datasetRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
  );
  const items: ApifyDatasetItem[] = await datasetRes.json();

  if (!items.length) {
    throw new Error("No posts found for this LinkedIn profile");
  }

  // Extract author info from first item
  const firstItem = items[0];
  const author: ScrapedAuthor = {
    name: firstItem.author?.name || "Unknown",
    headline: firstItem.author?.headline || null,
    avatar_url: firstItem.author?.profilePicture || null,
    followers_count: firstItem.author?.followersCount || 0,
  };

  // Extract posts
  const posts: ScrapedPost[] = items
    .filter((item) => item.text || item.content)
    .map((item) => ({
      content: (item.text || item.content || "").trim(),
      url: item.url || "",
      published_at: item.postedAt || null,
      reactions_count: item.reactionsCount || 0,
      comments_count: item.commentsCount || 0,
      shares_count: item.sharesCount || 0,
      raw_json: item as Record<string, unknown>,
    }));

  return { posts, author };
}
