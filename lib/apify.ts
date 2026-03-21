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
  postedAtISO?: string;
  postedAtTimestamp?: number;
  numLikes?: number;
  numComments?: number;
  numShares?: number;
  type?: string;
  author?: {
    firstName?: string;
    lastName?: string;
    occupation?: string;
    picture?: string;
    [key: string]: unknown;
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
  post_type: string;
  raw_json: Record<string, unknown>;
}

export interface ScrapedAuthor {
  name: string;
  headline: string | null;
  avatar_url: string | null;
  followers_count: number | null;
}

function parseDate(isoStr?: string, timestamp?: number): string | null {
  // Prefer ISO string
  if (isoStr && typeof isoStr === "string" && isoStr.trim()) {
    const d = new Date(isoStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  // Fall back to Unix timestamp (milliseconds)
  if (timestamp && typeof timestamp === "number") {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    return new Date(ts).toISOString();
  }
  return null;
}

export async function scrapeLinkedInPosts(
  linkedinUrl: string,
  maxPosts: number = 50
): Promise<{ posts: ScrapedPost[]; author: ScrapedAuthor }> {
  // Start the actor run — input field is "maxPosts" (not limitPerSource)
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        urls: [linkedinUrl],
        maxPosts: maxPosts,
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

  // Filter out non-post items (e.g. type: "document" wrappers)
  const postItems = items.filter((item) => {
    if (item.type === "document") return false;
    const text = item.text || item.content;
    return typeof text === "string" && text.trim().length > 0;
  });

  if (!postItems.length) {
    throw new Error("No posts found for this LinkedIn profile");
  }

  // Extract author from items — check all items for author data
  let authorData: ApifyDatasetItem["author"] | null = null;
  for (const item of items) {
    if (item.author?.firstName || item.author?.lastName) {
      authorData = item.author;
      break;
    }
  }
  if (!authorData && postItems[0]?.author) {
    authorData = postItems[0].author;
  }

  const authorName = authorData
    ? [authorData.firstName, authorData.lastName].filter(Boolean).join(" ").trim() || "Unknown"
    : "Unknown";

  const author: ScrapedAuthor = {
    name: authorName,
    headline: authorData?.occupation || null,
    avatar_url: authorData?.picture || null,
    followers_count: null, // Not available in this Apify actor
  };

  // Extract posts using correct Apify field names
  const posts: ScrapedPost[] = postItems.map((item) => ({
    content: (item.text || item.content || "").trim(),
    url: item.url || "",
    published_at: parseDate(item.postedAtISO, item.postedAtTimestamp),
    reactions_count: item.numLikes ?? 0,
    comments_count: item.numComments ?? 0,
    shares_count: item.numShares ?? 0,
    post_type: (item.type as string) || "text",
    raw_json: item as Record<string, unknown>,
  }));

  return { posts, author };
}
