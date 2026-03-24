import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { BREW360_SKILL } from "@/lib/360brew-skill";

const MODEL = "claude-sonnet-4-20250514";

function getClient() {
  return new Anthropic();
}

type VoiceMode = "tested" | "framework" | "contrarian";
type CtaMode = "in_post" | "first_comment" | "none";

const VOICE_INSTRUCTIONS: Record<VoiceMode, string> = {
  tested: `Write in first person as someone who has personally tested/experienced this. Use phrases like:
- "I tested this for 30 days..."
- "Here's what actually happened when I..."
- "I was skeptical, but after trying..."
Be specific about YOUR results. Include numbers from your experience.`,

  framework: `Write as an expert sharing a proven framework. Use phrases like:
- "Here's the exact framework..."
- "The 3-step process that works..."
- "Most people do X. Top performers do Y."
Be structured, methodical. Use numbered steps or clear categories.`,

  contrarian: `Write a contrarian take that challenges conventional wisdom. Use phrases like:
- "Unpopular opinion:"
- "Everyone is doing X. They're wrong."
- "The advice you keep hearing about X? It's outdated."
Be bold, back it up with specifics, and offer the alternative.`,
};

function getLeadMagnetUrl(contentText: string): string {
  const lower = contentText.toLowerCase();
  if (
    lower.includes("automat") ||
    lower.includes("agent") ||
    lower.includes("workflow") ||
    lower.includes("n8n") ||
    lower.includes("zapier")
  ) {
    return "51ultron.com/blueprint/";
  }
  if (
    lower.includes("cost") ||
    lower.includes("roi") ||
    lower.includes("saving") ||
    lower.includes("budget") ||
    lower.includes("revenue") ||
    lower.includes("pricing")
  ) {
    return "51ultron.com/calculator/";
  }
  if (
    lower.includes("competitor") ||
    lower.includes("intel") ||
    lower.includes("rival") ||
    lower.includes("vs") ||
    lower.includes("compare")
  ) {
    return "51ultron.com/competitor/";
  }
  if (
    lower.includes("tool") ||
    lower.includes("stack") ||
    lower.includes("software") ||
    lower.includes("app")
  ) {
    return "51ultron.com/stack/";
  }
  return "51ultron.com";
}

function getCtaVerb(contentText: string): string {
  const lower = contentText.toLowerCase();
  if (lower.includes("automat") || lower.includes("workflow"))
    return "automates this";
  if (lower.includes("agent")) return "deploys AI agents for this";
  if (lower.includes("content") || lower.includes("post"))
    return "generates content like this";
  if (lower.includes("sales") || lower.includes("outreach"))
    return "handles outbound for this";
  if (lower.includes("data") || lower.includes("analyt"))
    return "tracks all of this";
  if (lower.includes("competitor") || lower.includes("intel"))
    return "monitors competitors for this";
  return "does this at scale";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contentJson,
      format,
      voice,
      ctaMode,
    }: {
      contentJson: Record<string, unknown>;
      format: string;
      voice: VoiceMode;
      ctaMode: CtaMode;
    } = body;

    if (!contentJson || !format) {
      return NextResponse.json(
        { error: "Missing content or format" },
        { status: 400 }
      );
    }

    const client = getClient();

    const voiceInstruction =
      VOICE_INSTRUCTIONS[voice] || VOICE_INSTRUCTIONS.framework;

    // Serialize the visual content for the prompt
    const contentStr = JSON.stringify(contentJson, null, 2);
    const contentTextFlat = JSON.stringify(contentJson);

    const ctaUrl = getLeadMagnetUrl(contentTextFlat);
    const ctaVerb = getCtaVerb(contentTextFlat);

    let ctaInstruction = "";
    if (ctaMode === "in_post") {
      ctaInstruction = `Include a CTA at the end of the post: "Ultron ${ctaVerb} -> See how at ${ctaUrl}"`;
    } else if (ctaMode === "first_comment") {
      ctaInstruction =
        "Do NOT include any CTA in the post itself. End with an easy question or save prompt instead.";
    } else {
      ctaInstruction =
        "Do NOT include any CTA. End with an educational takeaway, easy question, or save prompt.";
    }

    const prompt = `${BREW360_SKILL}

You are writing a LinkedIn post to accompany a visual (${format.replace("-", " ")}) that contains this content:

VISUAL CONTENT:
${contentStr}

VOICE MODE:
${voiceInstruction}

CTA INSTRUCTIONS:
${ctaInstruction}

RULES — follow ALL of these precisely:
1. Hook: first 2 lines MUST stop the scroll. Use a contrarian statement, surprising data point, or specific situation
2. Length: 1,242-2,500 characters total
3. Structure: 14+ short paragraphs, each 10-19 words
4. NO hashtags
5. NO external links in the post body
6. NO AI slop: never use "delve", "moreover", "it's worth noting", "landscape", "game-changer", em dashes, or curly quotes
7. Use straight quotes only
8. Write like a human — conversational, punchy, specific
9. Add the visual content's insights but don't just repeat them — add context, stories, or contrarian angles
10. End with ONE of: easy question, save prompt ("Save this for later"), or repost prompt

Respond with ONLY the post text. No markdown, no explanation.`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const postText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    // Generate first comment if needed
    let firstComment: string | null = null;
    if (ctaMode === "first_comment") {
      firstComment = `Ultron ${ctaVerb} -> See how at ${ctaUrl}`;
    }

    return NextResponse.json({ post: postText, firstComment });
  } catch (error) {
    console.error("Post generate error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
