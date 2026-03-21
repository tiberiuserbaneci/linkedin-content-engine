import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_content }: { post_content: string } = body;

    if (!post_content) {
      return NextResponse.json(
        { error: "post_content is required" },
        { status: 400 }
      );
    }

    const client = new Anthropic();

    const prompt = `Based on this LinkedIn post, create a professional cheatsheet HTML infographic. Extract the key insights and structure them as: a comparison table OR a numbered framework OR a decision guide OR a carousel-style layout — pick whichever best fits the content.

LINKEDIN POST:
${post_content}

DESIGN REQUIREMENTS:
- Dark background: #0A0A0A
- Accent/highlight color: #DA4E24 (orange)
- Secondary accent for emphasis: #FBBF24 (gold)
- Primary text: #F1F1F1 (white)
- Muted text: #999999
- Border color: #1E1E1E
- Font: 'DM Sans' from Google Fonts (import it via @import url)
- Canvas size: exactly 1080px wide, auto height (optimized for LinkedIn)
- Must look like a professional cheatsheet/infographic, NOT a generic card
- Use structured layouts: tables with colored headers, numbered lists with accent borders, comparison grids, or "Start with X if..." decision boxes
- Add visual hierarchy: large title at top, section dividers, icon-like accent elements using CSS (colored dots, bars, borders)
- Include "ultron.ai" small branding text at bottom right corner, color #666
- Add generous padding (40px outer, 24px inner sections)
- Make it visually striking and scannable — someone should want to save/share it

Output ONLY valid HTML with all CSS embedded in a <style> tag. No markdown, no explanation, no code fences. The HTML must be completely self-contained.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const html = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Generate visual error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate visual" },
      { status: 500 }
    );
  }
}
