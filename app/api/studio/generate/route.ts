import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "claude-sonnet-4-20250514";

function getClient() {
  return new Anthropic();
}

const FORMAT_SCHEMAS: Record<string, string> = {
  infographic: `{
  "eyebrow": "short category label (2-4 words)",
  "title": "bold, compelling headline (5-10 words)",
  "subtitle": "supporting context line",
  "metrics": [
    { "value": "number or short stat", "label": "what it measures" },
    { "value": "number or short stat", "label": "what it measures" },
    { "value": "number or short stat", "label": "what it measures" }
  ],
  "sections": [
    {
      "title": "section heading",
      "bullets": ["actionable point 1", "actionable point 2", "actionable point 3", "actionable point 4"]
    }
  ]
}
Requirements:
- 3 metrics with punchy short values (use %, ×, K+, etc.)
- 3-6 sections, each with exactly 4 bullets
- Bullets should be concise (under 8 words each)
- Title should stop the scroll — bold claim or surprising stat`,

  cheatsheet: `{
  "eyebrow": "short category label",
  "title": "reference-style headline",
  "subtitle": "what this cheatsheet covers",
  "sections": [
    {
      "title": "category name",
      "items": ["tip or fact 1", "tip or fact 2", "tip or fact 3", "tip or fact 4"]
    }
  ],
  "comparison": {
    "headers": ["Feature", "Option A", "Option B"],
    "rows": [
      { "label": "row label", "values": ["value1", "value2"] }
    ]
  },
  "verdict": "one-line summary or recommendation"
}
Requirements:
- 3-4 sections with 3-5 items each
- comparison table is optional — include it when the content naturally involves comparing things
- verdict is optional — include when there's a clear takeaway
- Items should be scannable and reference-ready`,

  carousel: `{
  "title": "carousel cover title (compelling, 6-12 words)",
  "slides": [
    {
      "title": "slide heading (short, punchy)",
      "bullets": ["key point 1", "key point 2", "key point 3"]
    }
  ],
  "cta": {
    "headline": "action-oriented close (3-5 words)",
    "subtext": "motivating sentence that drives engagement"
  }
}
Requirements:
- 4-6 content slides (not counting title and CTA)
- Each slide: 1 clear title + 3-5 bullets
- Bullets should be standalone insights, not just sub-points
- CTA should drive saves, shares, or follows
- Think "one idea per slide" — each slide should be screenshot-worthy on its own`,

  "post-cover": `{
  "eyebrow": "topic tag or category (2-3 words)",
  "title": "bold statement or hot take (4-8 words)",
  "subtitle": "elaboration that adds context (1-2 sentences)"
}
Requirements:
- Title must be a scroll-stopper — provocative, contrarian, or surprising
- Subtitle should make someone want to read the full post
- Eyebrow categorizes the content (e.g., "Leadership", "Hot Take", "Founder Advice")`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      format,
      referenceText,
      referenceImages,
      instructions,
    }: {
      format: string;
      referenceText?: string;
      referenceImages?: { base64: string; mediaType: string }[];
      instructions?: string;
    } = body;

    if (!format || !FORMAT_SCHEMAS[format]) {
      return NextResponse.json(
        { error: "Invalid format" },
        { status: 400 }
      );
    }

    if (!referenceText && (!referenceImages || referenceImages.length === 0)) {
      return NextResponse.json(
        { error: "Provide at least one reference (text or image)" },
        { status: 400 }
      );
    }

    const client = getClient();

    // Build content blocks for the message
    const contentBlocks: Anthropic.Messages.ContentBlockParam[] = [];

    // Add reference images first (Claude vision)
    if (referenceImages && referenceImages.length > 0) {
      for (const img of referenceImages) {
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp",
            data: img.base64,
          },
        });
      }
    }

    // Build the text prompt
    let prompt = `You are a LinkedIn content designer who creates high-performing visual content. You've been given reference material (text and/or images) to use as inspiration and source material.

YOUR TASK: Analyze the references and generate structured content for a LinkedIn ${format.replace("-", " ")}.

`;

    if (referenceText) {
      prompt += `REFERENCE TEXT:
"""
${referenceText}
"""

`;
    }

    if (referenceImages && referenceImages.length > 0) {
      prompt += `REFERENCE IMAGES: I've attached ${referenceImages.length} image(s) above. Extract key ideas, data points, structure, and visual patterns from them.

`;
    }

    if (instructions) {
      prompt += `ADDITIONAL INSTRUCTIONS FROM THE USER:
${instructions}

`;
    }

    prompt += `OUTPUT FORMAT — respond with ONLY valid JSON matching this exact structure:
${FORMAT_SCHEMAS[format]}

IMPORTANT RULES:
1. Extract real insights and data from the references — don't make up statistics
2. Rewrite and restructure the content for LinkedIn visual format — don't copy verbatim
3. Make it more compelling than the source: stronger hooks, punchier language, clearer structure
4. If the reference is about a specific topic, stay on that topic — don't generalize
5. Use numbers, specifics, and concrete examples wherever possible
6. Every bullet should deliver value on its own — no filler
7. Respond with ONLY the JSON object, no markdown fences, no explanation`;

    contentBlocks.push({ type: "text", text: prompt });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Parse JSON — handle potential markdown fencing
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      text,
    ];
    const parsed = JSON.parse(jsonMatch[1]!.trim());

    return NextResponse.json({ content: parsed });
  } catch (error) {
    console.error("Studio generate error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
