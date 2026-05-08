import Anthropic from "@anthropic-ai/sdk";
import type { ContentAnalysis, ContentIdea, PatternMatch } from "./database.types";

const MODEL = "claude-sonnet-4-6";

function repairTruncatedJSON(str: string): string {
  // Close unterminated strings
  let inString = false;
  let escaped = false;
  for (let i = 0; i < str.length; i++) {
    if (escaped) { escaped = false; continue; }
    if (str[i] === "\\") { escaped = true; continue; }
    if (str[i] === '"') inString = !inString;
  }
  if (inString) str += '"';

  // Remove trailing partial key-value (after last comma outside a complete value)
  str = str.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*$/, "");
  str = str.replace(/,\s*$/, "");

  // Count and close open brackets/braces
  let braces = 0, brackets = 0;
  inString = false;
  escaped = false;
  for (let i = 0; i < str.length; i++) {
    if (escaped) { escaped = false; continue; }
    if (str[i] === "\\") { escaped = true; continue; }
    if (str[i] === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (str[i] === "{") braces++;
    if (str[i] === "}") braces--;
    if (str[i] === "[") brackets++;
    if (str[i] === "]") brackets--;
  }
  while (brackets-- > 0) str += "]";
  while (braces-- > 0) str += "}";

  return str;
}

function extractJSON(text: string): unknown {
  let str = text.trim();
  if (str.startsWith("```")) {
    str = str.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  try {
    return JSON.parse(str);
  } catch {
    // Attempt repair on truncated JSON
    const repaired = repairTruncatedJSON(str);
    return JSON.parse(repaired);
  }
}

function getClient() {
  return new Anthropic();
}

interface LightPost {
  content: string;
  reactions_count: number;
  comments_count: number;
}

interface TieredPost {
  content: string;
  reactions: number;
  comments: number;
  tier: "TOP_PERFORMER" | "BASELINE" | "LOW_PERFORMER";
}

function tierPosts(posts: LightPost[]): TieredPost[] {
  const sorted = [...posts].sort((a, b) => b.reactions_count - a.reactions_count);
  const top30 = Math.ceil(sorted.length * 0.3);
  const bottom30 = Math.floor(sorted.length * 0.3);

  return sorted.map((post, i) => ({
    content: post.content.slice(0, 300),
    reactions: post.reactions_count,
    comments: post.comments_count,
    tier:
      i < top30
        ? ("TOP_PERFORMER" as const)
        : i >= sorted.length - bottom30
        ? ("LOW_PERFORMER" as const)
        : ("BASELINE" as const),
  }));
}

const ANALYSIS_SYSTEM_PROMPT = `You are an expert LinkedIn content strategist. Analyse the following LinkedIn posts from a single creator. Each post is labelled with its performance tier: TOP_PERFORMER (top 30% by reactions), BASELINE (middle 40%), or LOW_PERFORMER (bottom 30%).

Your task: Generate a comprehensive Winning Content Profile with exactly these 10 sections. Be specific, data-driven, and actionable.

CRITICAL RULES FOR HOOK ANALYSIS:
- For "top_hooks": You MUST copy-paste the EXACT opening line (first sentence) from actual TOP_PERFORMER posts verbatim. Do NOT paraphrase or summarize. Quote them exactly as written.
- For "patterns": Describe the pattern AND include the EXACT verbatim text from the post that exemplifies it in quotes.
- For "opening_patterns" in structural_dna: Quote EXACT opening lines from top posts.

CRITICAL RULE FOR EXAMPLE POSTS:
- Every section (hook_formula, emotional_playbook, winning_format, structural_dna, specificity, close_patterns, what_doesnt_work) MUST include an "example_posts" array with exactly 3 brief post opener suggestions (1-2 sentences each) that follow the winning patterns described in that section. These should be NEW, original suggestions that a creator could use as inspiration.

Respond with valid JSON matching this exact structure:
{
  "overview": "2-3 sentence summary of this creator's content identity and what makes them unique",
  "topic_clusters": [
    {
      "name": "cluster name",
      "description": "what this cluster covers",
      "frequency": 0.25,
      "avg_engagement": 150,
      "examples": ["brief example 1", "brief example 2"]
    }
  ],
  "hook_formula": {
    "patterns": ["Pattern name: 'EXACT QUOTED TEXT from post' — explanation of why it works"],
    "top_hooks": ["EXACT verbatim first sentence copied from a top performing post", "EXACT verbatim first sentence from another top post"],
    "what_works": "summary of effective hook strategies",
    "what_fails": "summary of ineffective hook strategies",
    "example_posts": ["Example post opener following this hook pattern 1", "Example post opener 2", "Example post opener 3"]
  },
  "emotional_playbook": {
    "primary_emotions": ["emotion1", "emotion2"],
    "emotional_arc": "description of typical emotional journey in posts",
    "top_performer_emotions": ["emotions that drive top posts"],
    "avoid": ["emotions that underperform"],
    "example_posts": ["Example post opener with this emotional register 1", "Example 2", "Example 3"]
  },
  "winning_format": {
    "best_formats": [{"format": "format name", "avg_engagement": 200, "frequency": 0.3}],
    "optimal_length": {"min_words": 100, "max_words": 300, "sweet_spot": 200},
    "structure_notes": "how the best posts are structured",
    "example_posts": ["Example post opener in winning format 1", "Example 2", "Example 3"]
  },
  "structural_dna": {
    "opening_patterns": ["EXACT verbatim opening line from a top post — explanation"],
    "body_patterns": ["how top posts develop their message"],
    "paragraph_style": "short/medium/long paragraphs",
    "use_of_lists": true,
    "use_of_whitespace": "description",
    "signature_elements": ["unique structural elements"],
    "example_posts": ["Example post opener following structural DNA 1", "Example 2", "Example 3"]
  },
  "specificity": {
    "data_usage": "how often and how they use numbers/data",
    "story_vs_advice": "ratio and style",
    "personal_vs_general": "how personal the content is",
    "examples_style": "how they use examples",
    "specificity_score": 8,
    "example_posts": ["Example post opener with right specificity level 1", "Example 2", "Example 3"]
  },
  "close_patterns": {
    "cta_styles": ["call to action patterns"],
    "question_endings": ["example questions used to close"],
    "best_performing_closes": ["EXACT verbatim close from a top post"],
    "engagement_drivers": "what drives comments",
    "example_posts": ["Example post with this close pattern 1", "Example 2", "Example 3"]
  },
  "what_doesnt_work": {
    "underperforming_topics": ["topics that get low engagement"],
    "failed_formats": ["formats that don't work for this creator"],
    "common_mistakes": ["patterns seen in low performers"],
    "avoid_list": ["specific things to avoid"],
    "example_posts": ["Example of what TO DO instead (corrected version) 1", "Example 2", "Example 3"]
  },
  "winning_formula": "A single paragraph capturing the exact recipe for this creator's best content",
  "winning_checklist": [
    "Checklist item 1 - specific and actionable",
    "Checklist item 2 - specific and actionable"
  ]
}`;

export async function analyzeProfile(
  posts: LightPost[]
): Promise<Omit<ContentAnalysis, "id" | "profile_id" | "created_at">> {
  const client = getClient();
  const tieredPosts = tierPosts(posts);

  const postsText = tieredPosts
    .map(
      (p, i) =>
        `--- POST ${i + 1} [${p.tier}] (${p.reactions} reactions, ${p.comments} comments) ---\n${p.content}`
    )
    .join("\n\n");

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ["prompt-caching-2024-07-31"],
    system: [
      {
        type: "text",
        text: ANALYSIS_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `POSTS DATA:\n${postsText}`,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => {
      if (block.type === "text") return block.text;
      return "";
    })
    .join("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = extractJSON(text) as any;

  return {
    posts_analysed: posts.length,
    overview: parsed.overview,
    topic_clusters: parsed.topic_clusters,
    structural_dna: parsed.structural_dna,
    hook_formula: parsed.hook_formula,
    emotional_playbook: parsed.emotional_playbook,
    winning_format: parsed.winning_format,
    specificity: parsed.specificity,
    close_patterns: parsed.close_patterns,
    what_doesnt_work: parsed.what_doesnt_work,
    winning_formula: parsed.winning_formula,
    winning_checklist: parsed.winning_checklist,
    model_used: MODEL,
  };
}

interface RealPost {
  content: string;
  reactions_count: number;
  comments_count: number;
}

const IDEAS_PROMPT_FAST = `Generate 10 LinkedIn content ideas for a creator. Study their winning formula AND their real top-performing posts below carefully. Your ideas must replicate their EXACT tone, voice, hook style, and writing patterns.

WINNING FORMULA:
`;

const IDEAS_SUFFIX = `

Each idea must have: position (1-10), title, topic, pattern_matches (array of {type, label} where type is one of: topic/format/hook/emotion/specificity), angle, hook_draft (a REAL usable first sentence that matches this creator's exact voice and hook style — study the real posts above), format (narrative/how_to/opinion/data_driven), emotional_register, trending_signal.

CRITICAL: The hook_draft must sound like it was written by THIS creator. Copy their sentence structure, tone, and style from the real posts above. Do NOT write generic LinkedIn hooks.

Respond with ONLY valid JSON, no markdown:
{"ideas":[{...}]}`;

export async function generateIdeas(
  analysis: ContentAnalysis,
  researchSpace?: string,
  realPosts?: RealPost[]
): Promise<Omit<ContentIdea, "id" | "analysis_id" | "profile_id" | "created_at">[]> {
  const client = getClient();

  // Only send winning_formula + top 3 topic cluster names
  const topicNames = Array.isArray(analysis.topic_clusters)
    ? (analysis.topic_clusters as { name: string }[]).slice(0, 3).map((c) => c.name).join(", ")
    : "";

  const spaceNote = researchSpace ? `\nFocus area: ${researchSpace}` : "";

  // Include real top posts for voice/tone matching (truncate to stay within limits)
  let realPostsSection = "";
  if (realPosts && realPosts.length > 0) {
    const postTexts = realPosts
      .slice(0, 10)
      .map((p, i) => `--- TOP POST ${i + 1} (${p.reactions_count} reactions, ${p.comments_count} comments) ---\n${p.content.slice(0, 500)}`)
      .join("\n\n");
    realPostsSection = `\n\nREAL TOP-PERFORMING POSTS (study these for voice, tone, hooks):\n${postTexts}`;
  }

  const prompt =
    IDEAS_PROMPT_FAST +
    analysis.winning_formula +
    `\n\nTop topics: ${topicNames}` +
    realPostsSection +
    spaceNote +
    IDEAS_SUFFIX;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract text blocks from the response
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => {
      if (block.type === "text") return block.text;
      return "";
    })
    .join("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = extractJSON(text) as any;

  return parsed.ideas.map(
    (idea: {
      position: number;
      title: string;
      topic: string;
      pattern_matches: PatternMatch[];
      angle: string;
      hook_draft: string;
      format: string;
      emotional_register: string;
      trending_signal: string;
    }) => ({
      position: idea.position,
      title: idea.title,
      topic: idea.topic,
      pattern_matches: idea.pattern_matches,
      angle: idea.angle,
      hook_draft: idea.hook_draft,
      format: idea.format as ContentIdea["format"],
      emotional_register: idea.emotional_register,
      trending_signal: idea.trending_signal,
      status: "idea" as const,
    })
  );
}
