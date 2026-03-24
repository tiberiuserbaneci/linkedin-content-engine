import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { BREW360_SKILL } from "@/lib/360brew-skill";

const MODEL = "claude-sonnet-4-20250514";

function getClient() {
  return new Anthropic();
}

const FORMAT_DIMENSIONS: Record<string, string> = {
  infographic: "1080px wide x 1350px tall (portrait, maximizes mobile screen)",
  cheatsheet: "900px wide, height auto (full content, no cropping)",
  carousel: "1080px x 1080px per slide (square, standard LinkedIn carousel)",
  poster: "1080px x 1080px (square, maximum visual impact)",
};

const SKILL_DESIGN_ARCHITECT = `YOU ARE A WORLD-CLASS DESIGN ARCHITECT.

You do not fill templates. You analyze information and design the optimal visual experience for that specific content.

ANALYSIS BEFORE DESIGN (mandatory):
1. What type is this information? (list / process / comparison / framework / data / story / hierarchy)
2. How much information? (3 items vs 10 items = different layout)
3. What is the dominant visual idea? (one thing must dominate)
4. What action do I want from the viewer? (save / share / comment)

LAYOUT SELECTION (automatic, based on content type):
List -> HERO_GRID or ICON_GRID
Process -> TIMELINE or FLOWCHART
Comparison -> COMPARISON_TABLE with winner
Hierarchy -> PYRAMID
Data -> DASHBOARD with callout metrics
Framework -> ACROSTIC or MODULAR_CARDS
Complex -> MOSAIC or MAGAZINE

DESIGN PRINCIPLES (non-negotiable):
- Every layout is different - no two materials look the same
- Typography as design: titles at 72-120px minimum
- Maximum contrast: dark section next to light section
- One dominant visual element per section
- Skimmable in 3 seconds, saveable for 30 minutes
- No lorem ipsum, no placeholder images
- Iconify icons on every bullet point (tabler set preferred)
- Company logos via Logo.dev when tool names appear

VISUAL HIERARCHY:
LEVEL 1 - HOOK VISUAL (0.3 seconds): Title dominant. Font 72-120px. Contrast maxim.
LEVEL 2 - ORIENTING ELEMENTS (1-3 seconds): Main sections, big metrics, overall structure.
LEVEL 3 - DETAIL LAYER (30+ seconds): Actual content, bullet points, explanations.

CONTRAST AS DESIGN INSTRUMENT:
Dark section next to light section = contrast that guides the eye
Big number (80px) next to small text (13px) = clear hierarchy
Colored card next to neutral card = visual rhythm that prevents fatigue`;

const SKILL_COPY = `BANNED WORDS (immediate disqualification):
delve, testament, moreover, tapestry, synergy, paradigm, game-changer, landscape, it's worth noting, in conclusion, to summarize, excited to share, let's dive in

BANNED PUNCTUATION: em dash, en dash, curly quotes, ellipsis character

VOICE: First person, active, specific. Short sentences. Every sentence earns its place.
Numbers always specific: "8 hours" not "several hours".`;

const SKILL_ICP = `TARGET AUDIENCE:
Solo founders and 1-10 person team founders. Building in SaaS, services, agencies, consulting.
Adopting AI to replace or delay headcount. LinkedIn-active, technically curious.
WHAT MAKES THEM SAVE: Specific frameworks, exact tool names, real numbers, honest analysis.
WHAT MAKES THEM SCROLL PAST: Generic AI enthusiasm, content that could apply to anyone, lists without context.`;

function getThemeCSS(theme: string): string {
  if (theme === "light") {
    return `--bg: #F8F6F1; --accent: #C94A22; --text: #111111; --text-secondary: #666666; --border: #E0DDD6; --card-bg: #FFFFFF; --card-dark: #111111;`;
  }
  if (theme === "dark") {
    return `--bg: #0A0A0A; --accent: #DA4E24; --text: #FFFFFF; --text-secondary: #AAAAAA; --card-bg: #1A1A1A; --card-border: #2A2A2A; --highlight: #DA4E24;`;
  }
  // expressive
  return `--bg: #FFFFFF; --accent: #DA4E24; --text: #111111; --text-secondary: #666666;
  --section-a: #FFE5D9; --section-b: #D4F1F4; --section-c: #FFF3CD; --section-d: #D5F5E3; --section-e: #E8DAEF; --section-dark: #1A1A1A;`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rawContent,
      format,
      theme,
      direction,
      referenceImages,
    }: {
      rawContent: string;
      format: string;
      theme: string;
      direction?: string;
      referenceImages?: { base64: string; mediaType: string }[];
    } = body;

    if (!rawContent || !format || !theme) {
      return NextResponse.json(
        { error: "Missing required fields: rawContent, format, theme" },
        { status: 400 }
      );
    }

    if (!FORMAT_DIMENSIONS[format]) {
      return NextResponse.json(
        { error: `Invalid format. Use: ${Object.keys(FORMAT_DIMENSIONS).join(", ")}` },
        { status: 400 }
      );
    }

    const client = getClient();
    const contentBlocks: Anthropic.Messages.ContentBlockParam[] = [];

    // Add reference images if provided
    if (referenceImages && referenceImages.length > 0) {
      for (const img of referenceImages) {
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: img.base64,
          },
        });
      }
    }

    const themeCSS = getThemeCSS(theme);
    const dimensions = FORMAT_DIMENSIONS[format];

    const systemPrompt = `You are a Design Architect and front-end engineer. You produce self-contained HTML+CSS documents that are visually stunning, algorithm-optimized LinkedIn content assets.

${BREW360_SKILL}

${SKILL_DESIGN_ARCHITECT}

${SKILL_COPY}

${SKILL_ICP}

Technical requirements:
- Self-contained HTML. Inline CSS only (in a <style> tag). No external stylesheets except Google Fonts.
- Google Fonts via @import in style tag (use Bebas Neue for display, DM Sans for body, DM Mono for technical labels)
- Iconify via CDN: <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
- Company logos via Logo.dev: <img src="https://img.logo.dev/{domain}?token=pk_X0wdB1MQRmWLGQMiPwH2Wg" height="24">
- Exact dimensions: ${dimensions}
- Full height rendering - no cropping
- Theme CSS variables: ${themeCSS}
- For EXPRESSIVE theme: each section gets a different background color, never two adjacent sections with same color, always include one dark section for contrast
- For carousels: generate multiple slides as separate <div class="slide"> elements inside a wrapper, each exactly 1080x1080px

ICON MAPPING (use these Iconify icons):
research: tabler:search, email: tabler:mail, revenue: tabler:trending-up, agents: tabler:robot,
content: tabler:writing, monitor: tabler:activity, sales: tabler:currency-dollar, code: tabler:code,
data: tabler:database, users: tabler:users, time: tabler:clock, check: tabler:circle-check,
warning: tabler:alert-triangle, growth: tabler:chart-line, brain: tabler:brain, rocket: tabler:rocket,
fire: tabler:flame, lock: tabler:lock, globe: tabler:world, lightning: tabler:bolt,
target: tabler:target, layers: tabler:stack, settings: tabler:settings, star: tabler:star,
shield: tabler:shield, dollar: tabler:coin, chart: tabler:chart-bar, calendar: tabler:calendar,
api: tabler:api, flow: tabler:hierarchy, compare: tabler:columns, tool: tabler:tool

OUTPUT: Complete self-contained HTML starting with <!DOCTYPE html>. No explanations. No markdown wrapper. Raw HTML only.`;

    let userPrompt = `RAW CONTENT:
"""
${rawContent}
"""

FORMAT: ${format} (${dimensions})
THEME: ${theme.toUpperCase()}`;

    if (referenceImages && referenceImages.length > 0) {
      userPrompt += `\n\nREFERENCE IMAGES: I've attached ${referenceImages.length} image(s). Extract key ideas, data points, structure, and visual patterns from them.`;
    }

    if (direction) {
      userPrompt += `\n\nADDITIONAL DIRECTION FROM USER:\n${direction}`;
    }

    userPrompt += `\n\nAnalyze this content. Determine the optimal layout. Generate the complete HTML document. Output ONLY the raw HTML.`;

    contentBlocks.push({ type: "text", text: userPrompt });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: "user", content: contentBlocks }],
    });

    let html = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Strip markdown fences if present
    const fenceMatch = html.match(/```(?:html)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      html = fenceMatch[1]!.trim();
    }

    // Ensure it starts with <!DOCTYPE html> or <html
    if (!html.startsWith("<!DOCTYPE") && !html.startsWith("<html")) {
      // Try to find the HTML start
      const docIdx = html.indexOf("<!DOCTYPE");
      const htmlIdx = html.indexOf("<html");
      const startIdx = docIdx >= 0 ? docIdx : htmlIdx;
      if (startIdx > 0) {
        html = html.substring(startIdx);
      }
    }

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Studio generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
