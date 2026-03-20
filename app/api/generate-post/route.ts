import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      topic,
      angle,
      hook_draft,
      format,
      emotional_register,
      winning_formula,
      generate_visual_prompt,
    }: {
      title: string;
      topic: string;
      angle: string;
      hook_draft: string;
      format: string;
      emotional_register: string;
      winning_formula: string;
      generate_visual_prompt?: boolean;
    } = body;

    if (!title || !winning_formula) {
      return NextResponse.json(
        { error: "title and winning_formula are required" },
        { status: 400 }
      );
    }

    const client = new Anthropic();
    const seed = Math.floor(Math.random() * 1000000);

    let prompt = `You are an expert LinkedIn ghostwriter. Generate a complete, ready-to-publish LinkedIn post.

WINNING FORMULA FOR THIS CREATOR:
${winning_formula}

POST BRIEF:
- Title/Topic: ${title}
- Topic: ${topic}
- Angle: ${angle}
- Hook Draft: ${hook_draft}
- Format: ${format}
- Emotional Register: ${emotional_register}
- Random Seed: ${seed} (use this to make the post unique)

RULES:
1. Start with a strong hook (use the hook draft as inspiration, don't copy it exactly)
2. Follow the winning formula above
3. Keep it authentic and conversational
4. Include line breaks for readability
5. End with a strong CTA or question
6. Do NOT use hashtags
7. Output ONLY the post text, no explanations or meta-commentary`;

    if (generate_visual_prompt) {
      prompt += `

ALSO: After the post, on a new line, write "---VISUAL_PROMPT---" followed by an optimized image generation prompt (for Ideogram/DALL-E) that would create a compelling visual to accompany this post. The visual prompt should:
- Be 1-3 sentences
- Describe a clean, professional visual
- Include style keywords (e.g. "minimal illustration", "flat design", "photo-realistic")
- Match the post's theme and emotional tone`;
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    let post = text.trim();
    let visual_prompt: string | null = null;

    if (generate_visual_prompt && text.includes("---VISUAL_PROMPT---")) {
      const parts = text.split("---VISUAL_PROMPT---");
      post = parts[0].trim();
      visual_prompt = parts[1].trim();
    }

    return NextResponse.json({ post, visual_prompt });
  } catch (error) {
    console.error("Generate post error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate post" },
      { status: 500 }
    );
  }
}
