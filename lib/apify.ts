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

function parseDate(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "number") {
    // Unix timestamp — could be seconds or milliseconds
    const ts = val < 1e12 ? val * 1000 : val;
    return new Date(ts).toISOString();
  }
  if (typeof val === "string" && val.trim()) {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
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

  // Filter out non-post items (e.g. type: "document" wrappers)
  const postItems = items.filter((item) => {
    if ((item as Record<string, unknown>).type === "document") return false;
    const text = item.text || item.content;
    return typeof text === "string" && text.trim().length > 0;
  });

  if (!postItems.length) {
    throw new Error("No posts found for this LinkedIn profile");
  }

  // Extract author from ALL items (including document-type wrappers that may have author data)
  // Try each item until we find one with author info
  function extractAuthorFromItem(item: ApifyDatasetItem): { authorObj: ApifyDatasetItem["author"]; raw: Record<string, unknown> } | null {
    const r = item as Record<string, unknown>;
    const a = item.author;
    if (a?.name || a?.firstName || a?.followersCount || a?.followerCount || r.authorName || r.fullName) {
      return { authorObj: a, raw: r };
    }
    return null;
  }

  // Check ALL items first (unfiltered), then fall back to filtered post items
  let authorSource: { authorObj: ApifyDatasetItem["author"]; raw: Record<string, unknown> } | null = null;
  for (const item of items) {
    authorSource = extractAuthorFromItem(item);
    if (authorSource) break;
  }
  if (!authorSource) {
    authorSource = { authorObj: postItems[0].author, raw: postItems[0] as Record<string, unknown> };
  }

  const { authorObj, raw } = authorSource;

  // Log raw author fields for debugging
  console.log("APIFY AUTHOR FIELDS:", JSON.stringify({
    itemCount: items.length,
    postItemCount: postItems.length,
    author: authorObj,
    topLevel: {
      authorName: raw.authorName,
      fullName: raw.fullName,
      followerCount: raw.followerCount,
      followersCount: raw.followersCount,
      followers: raw.followers,
      connectionsCount: raw.connectionsCount,
    },
  }));

  const authorName =
    authorObj?.name ||
    (raw.fullName as string | undefined) ||
    (authorObj?.firstName && authorObj?.lastName
      ? `${authorObj.firstName} ${authorObj.lastName}`.trim()
      : null) ||
    (authorObj?.firstName || null) ||
    (raw.authorName as string | undefined) ||
    "Unknown";

  const author: ScrapedAuthor = {
    name: authorName,
    headline: authorObj?.headline || null,
    avatar_url:
      authorObj?.profilePicture ||
      authorObj?.profilePictureUrl ||
      (raw.authorProfilePicture as string | undefined) ||
      null,
    followers_count:
      authorObj?.followerCount ||
      authorObj?.followersCount ||
      (authorObj as Record<string, unknown> | undefined)?.followers as number | undefined ||
      (authorObj as Record<string, unknown> | undefined)?.connectionsCount as number | undefined ||
      (raw.authorFollowerCount as number | undefined) ||
      (raw.followerCount as number | undefined) ||
      (raw.followersCount as number | undefined) ||
      (raw.followers as number | undefined) ||
      (raw.connectionsCount as number | undefined) ||
      0,
  };

  // Extract posts — handle multiple field name variants for engagement
  const posts: ScrapedPost[] = postItems
    .map((item) => ({
      content: (item.text || item.content || "").trim(),
      url: item.url || "",
      published_at: parseDate(item.postedAt || (item as Record<string, unknown>).publishedAt || (item as Record<string, unknown>).date),
      reactions_count: item.reactionsCount ?? item.numLikes ?? 0,
      comments_count: item.commentsCount ?? item.numComments ?? 0,
      shares_count: item.sharesCount ?? item.numShares ?? 0,
      raw_json: item as Record<string, unknown>,
    }));

  return { posts, author };
}
