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
  numLikes?: number;
  numComments?: number;
  numShares?: number;
  author?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    headline?: string;
    profilePicture?: string;
    profilePictureUrl?: string;
    followersCount?: number;
    followerCount?: number;
  };
  authorName?: string;
  authorProfilePicture?: string;
  authorFollowerCount?: number;
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
        urls: [linkedinUrl],
        limitPerSource: maxPosts,
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

  // Log raw first item so we can see exact field names from Apify
  console.log("APIFY RAW FIRST ITEM:", JSON.stringify(items[0], null, 2));

  // Extract author info from first item — handle multiple field name variants
  const firstItem = items[0];
  const authorObj = firstItem.author;

  const authorName =
    authorObj?.name ||
    (authorObj?.firstName && authorObj?.lastName
      ? `${authorObj.firstName} ${authorObj.lastName}`.trim()
      : null) ||
    (authorObj?.firstName || null) ||
    (firstItem.authorName as string | undefined) ||
    "Unknown";

  const author: ScrapedAuthor = {
    name: authorName,
    headline: authorObj?.headline || null,
    avatar_url:
      authorObj?.profilePicture ||
      authorObj?.profilePictureUrl ||
      (firstItem.authorProfilePicture as string | undefined) ||
      null,
    followers_count:
      authorObj?.followersCount ||
      authorObj?.followerCount ||
      (firstItem.authorFollowerCount as number | undefined) ||
      0,
  };

  // Extract posts — handle multiple field name variants for engagement
  const posts: ScrapedPost[] = items
    .filter((item) => item.text || item.content)
    .map((item) => ({
      content: (item.text || item.content || "").trim(),
      url: item.url || "",
      published_at: item.postedAt || null,
      reactions_count: item.reactionsCount ?? item.numLikes ?? 0,
      comments_count: item.commentsCount ?? item.numComments ?? 0,
      shares_count: item.sharesCount ?? item.numShares ?? 0,
      raw_json: item as Record<string, unknown>,
    }));

  return { posts, author };
}
