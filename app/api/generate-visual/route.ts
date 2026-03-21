import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a professional infographic designer. You generate self-contained HTML cheatsheets optimized for LinkedIn.

MANDATORY DESIGN SYSTEM — follow exactly, no exceptions:

DIMENSIONS:
- Width: exactly 1080px
- Height: exactly 1350px (portrait) unless format=square then 1080px
- Use fixed pixel dimensions, never percentages for the outer container
- overflow: hidden on outer container

COLORS:
- Background: #FFFFFF (white only)
- Primary text: #111111
- Accent: #DA4E24 (orange) — ONLY for: section labels, numbered steps, left border accents, divider lines
- Secondary text: #666666
- Border: #E8E8E8, always 0.5px solid
- Callout box background: #F7F7F7
- NO gradients, NO shadows, NO colored backgrounds except #F7F7F7 callout

TYPOGRAPHY:
- Font: 'DM Sans' via @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap')
- Title: 28-32px, 700 weight
- Subtitle: 14px, 500 weight, #666666, uppercase, letter-spacing: 2px
- Section headers: 18px, 700 weight
- Body: 14-15px, 400 weight, line-height: 1.6
- Numbers/stats: 32px, 700 weight, #DA4E24

SPACING:
- Outer padding: 64px all sides
- Section gap: 32px
- Inner section padding: 24px

FOOTER:
- Bottom right corner: "51ultron.com" in 11px, color #AAAAAA
- No other branding

LAYOUT OPTIONS — pick the best one(s) based on post content. You may combine 2-3 sections:

A — COMPARISON TWO-COLUMN
Left column = bad approach (title with strikethrough text-decoration), right column = good approach (bold 3px left border #DA4E24). Use when post contrasts two approaches.

B — NUMBERED FRAMEWORK
Steps labeled 01, 02, 03... Large orange number (32px, #DA4E24), bold title, description paragraph. Use when post has a process or sequence.

C — DECISION GUIDE
"Use X when..." blocks, each with 3px left border #DA4E24, bold title, bullet points. Use when post helps choose between options.

D — STAT CALLOUTS
Large number (32px, #DA4E24) + label below (14px, #666) + short context. Display 3-4 in a horizontal row. Use when post has data/metrics.

E — TIMELINE
Vertical 2px line with 8px orange dots (#DA4E24), date/phase label on left, description on right. Use for evolution or stages.

F — MATRIX/QUADRANT
2x2 grid with axis labels, each cell has bold title + 2-3 bullet points. Borders: 0.5px #E8E8E8. Use when post maps concepts on two dimensions.

G — CHECKLIST
Grouped items with 12px square checkboxes (border: 2px solid #DA4E24, filled with #DA4E24 for checked). Grouped under bold category headers. Use for lists of things to do/avoid.

H — QUOTE + BREAKDOWN
Large pull quote: 18px italic, #111111, with 3px left border #DA4E24 and 24px left padding. Then bullet breakdown of key points below. Use when post has a strong central insight.

COMBINING SECTIONS:
For complex posts, combine 2-3 layout sections vertically. Example: a title + B (framework) + D (stats) + callout box.
Always end with a #F7F7F7 callout box if the post has a key takeaway (padding: 24px, border-radius: 8px).
Include a table only if the post has comparative data worth tabulating.

CSS TEMPLATE (embed in <style> tag):
* { margin: 0; padding: 0; box-sizing: border-box; }
The outer container must be:
.cheatsheet { width: 1080px; height: 1350px; background: #FFFFFF; padding: 64px; font-family: 'DM Sans', sans-serif; color: #111111; position: relative; overflow: hidden; }

Output ONLY valid HTML with embedded <style>. No markdown, no explanation, no code fences.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      post_content,
      format = "portrait",
    }: { post_content: string; format?: "portrait" | "square" } = body;

    if (!post_content) {
      return NextResponse.json(
        { error: "post_content is required" },
        { status: 400 }
      );
    }

    const height = format === "square" ? 1080 : 1350;

    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Create a cheatsheet from this LinkedIn post. Dimensions: 1080x${height}px. Analyze the content and pick the best layout option(s) from A-H.\n\nLINKEDIN POST:\n${post_content}`,
        },
      ],
    });

    let html = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    // Strip markdown code fences if Claude wraps them anyway
    if (html.startsWith("```")) {
      html = html.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
    }

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Generate visual error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate visual" },
      { status: 500 }
    );
  }
}
