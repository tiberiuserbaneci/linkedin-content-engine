import Anthropic from "@anthropic-ai/sdk";
import type { Post, ContentAnalysis, ContentIdea, PatternMatch } from "./database.types";

const MODEL = "claude-sonnet-4-20250514";

function getClient() {
  return new Anthropic();
}

interface TieredPost {
  content: string;
  reactions: number;
  comments: number;
  tier: "TOP_PERFORMER" | "BASELINE" | "LOW_PERFORMER";
  word_count: number;
  post_type: string;
}

function tierPosts(posts: Post[]): TieredPost[] {
  const sorted = [...posts].sort((a, b) => b.reactions_count - a.reactions_count);
  const top30 = Math.ceil(sorted.length * 0.3);
  const bottom30 = Math.floor(sorted.length * 0.3);

  return sorted.map((post, i) => ({
    content: post.content,
    reactions: post.reactions_count,
    comments: post.comments_count,
    tier:
      i < top30
        ? ("TOP_PERFORMER" as const)
        : i >= sorted.length - bottom30
        ? ("LOW_PERFORMER" as const)
        : ("BASELINE" as const),
    word_count: post.word_count,
    post_type: post.post_type,
  }));
}

const ANALYSIS_PROMPT = `You are an expert LinkedIn content strategist. Analyse the following LinkedIn posts from a single creator. Each post is labelled with its performance tier: TOP_PERFORMER (top 30% by reactions), BASELINE (middle 40%), or LOW_PERFORMER (bottom 30%).

Your task: Generate a comprehensive Winning Content Profile with exactly these 10 sections. Be specific, data-driven, and actionable.

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
    "patterns": ["pattern 1 with example", "pattern 2 with example"],
    "top_hooks": ["actual hook from top posts"],
    "what_works": "summary of effective hook strategies",
    "what_fails": "summary of ineffective hook strategies"
  },
  "emotional_playbook": {
    "primary_emotions": ["emotion1", "emotion2"],
    "emotional_arc": "description of typical emotional journey in posts",
    "top_performer_emotions": ["emotions that drive top posts"],
    "avoid": ["emotions that underperform"]
  },
  "winning_format": {
    "best_formats": [{"format": "format name", "avg_engagement": 200, "frequency": 0.3}],
    "optimal_length": {"min_words": 100, "max_words": 300, "sweet_spot": 200},
    "structure_notes": "how the best posts are structured"
  },
  "structural_dna": {
    "opening_patterns": ["how top posts start"],
    "body_patterns": ["how top posts develop their message"],
    "paragraph_style": "short/medium/long paragraphs",
    "use_of_lists": true,
    "use_of_whitespace": "description",
    "signature_elements": ["unique structural elements"]
  },
  "specificity": {
    "data_usage": "how often and how they use numbers/data",
    "story_vs_advice": "ratio and style",
    "personal_vs_general": "how personal the content is",
    "examples_style": "how they use examples",
    "specificity_score": 8
  },
  "close_patterns": {
    "cta_styles": ["call to action patterns"],
    "question_endings": ["example questions used to close"],
    "best_performing_closes": ["actual closes from top posts"],
    "engagement_drivers": "what drives comments"
  },
  "what_doesnt_work": {
    "underperforming_topics": ["topics that get low engagement"],
    "failed_formats": ["formats that don't work for this creator"],
    "common_mistakes": ["patterns seen in low performers"],
    "avoid_list": ["specific things to avoid"]
  },
  "winning_formula": "A single paragraph capturing the exact recipe for this creator's best content",
  "winning_checklist": [
    "Checklist item 1 - specific and actionable",
    "Checklist item 2 - specific and actionable"
  ]
}

POSTS DATA:
`;

export async function analyzeProfile(
  posts: Post[]
): Promise<Omit<ContentAnalysis, "id" | "profile_id" | "created_at">> {
  const client = getClient();
  const tieredPosts = tierPosts(posts);

  const postsText = tieredPosts
    .map(
      (p, i) =>
        `--- POST ${i + 1} [${p.tier}] (${p.reactions} reactions, ${p.comments} comments, ${p.word_count} words, type: ${p.post_type}) ---\n${p.content}`
    )
    .join("\n\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: ANALYSIS_PROMPT + postsText,
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

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const parsed = JSON.parse(jsonMatch[1]!.trim());

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

const IDEAS_PROMPT = `You are an expert LinkedIn content strategist. Based on the Winning Content Profile below, generate 10 content ideas calibrated to this creator's winning patterns.

IMPORTANT RULES:
1. First, use the web_search tool to find 3-5 trending topics in the creator's space
2. Each idea MUST match at least 3 out of 5 pattern types: topic cluster, format, hook style, emotion, specificity level
3. Each hook_draft must be a REAL, USABLE first sentence (not a placeholder)
4. Each idea should leverage a trending signal from your research

WINNING CONTENT PROFILE:
`;

const IDEAS_SCHEMA = `
Respond with valid JSON:
{
  "ideas": [
    {
      "position": 1,
      "title": "Short compelling title",
      "topic": "The core topic",
      "pattern_matches": [
        {"type": "topic", "label": "matching cluster name"},
        {"type": "format", "label": "matching format"},
        {"type": "hook", "label": "hook pattern used"},
        {"type": "emotion", "label": "primary emotion"},
        {"type": "specificity", "label": "specificity element"}
      ],
      "angle": "The unique angle or perspective for this piece",
      "hook_draft": "The actual first sentence of the post, ready to use",
      "format": "narrative|how_to|opinion|data_driven",
      "emotional_register": "The emotional tone",
      "trending_signal": "Why this is timely - reference to trend found"
    }
  ]
}`;

export async function generateIdeas(
  analysis: ContentAnalysis,
  researchSpace?: string
): Promise<Omit<ContentIdea, "id" | "analysis_id" | "profile_id" | "created_at">[]> {
  const client = getClient();

  const profileSummary = JSON.stringify(
    {
      overview: analysis.overview,
      topic_clusters: analysis.topic_clusters,
      hook_formula: analysis.hook_formula,
      emotional_playbook: analysis.emotional_playbook,
      winning_format: analysis.winning_format,
      structural_dna: analysis.structural_dna,
      specificity: analysis.specificity,
      close_patterns: analysis.close_patterns,
      winning_formula: analysis.winning_formula,
      winning_checklist: analysis.winning_checklist,
    },
    null,
    2
  );

  const spaceNote = researchSpace
    ? `\n\nFOCUS AREA FOR TRENDING RESEARCH: ${researchSpace}`
    : "";

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 5,
      },
    ],
    messages: [
      {
        role: "user",
        content:
          IDEAS_PROMPT +
          profileSummary +
          spaceNote +
          "\n\n" +
          IDEAS_SCHEMA,
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

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  const parsed = JSON.parse(jsonMatch[1]!.trim());

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
