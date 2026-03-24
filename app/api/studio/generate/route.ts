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
- Self-contained HTML. Inline CSS only (in a <style> tag). No external stylesheets.
- FONTS: Do NOT use Google Fonts @import. Use ONLY system fonts that render synchronously:
  Display/titles: font-family: 'Arial Black', 'Arial Bold', Arial, sans-serif; font-weight: 900; letter-spacing: -0.02em;
  Body text: font-family: Arial, Helvetica, sans-serif;
  Mono/labels: font-family: 'Courier New', Courier, monospace;
  System fonts have zero load time - no race condition on PNG export.
- Company logos via Logo.dev: <img src="https://img.logo.dev/{domain}?token=pk_X0wdB1MQRmWLGQMiPwH2Wg" height="24">
- Exact dimensions: ${dimensions}
- Full height rendering - no cropping
- Theme CSS variables: ${themeCSS}
- For EXPRESSIVE theme: each section gets a different background color, never two adjacent sections with same color, always include one dark section for contrast
- For carousels: generate multiple slides as separate <div class="slide"> elements inside a wrapper, each exactly 1080x1080px

DESIGN QUALITY REQUIREMENTS - NON-NEGOTIABLE:
You are a world-class designer. Every output must look like it was designed by a senior UI/UX professional, not generated by AI.

MANDATORY design elements in every infographic:
1. VISUAL HIERARCHY: Title must be the dominant element. Minimum 80px font size. Takes up significant space - 20-25% of total height.
2. CONTRAST: At least one section must use a dramatically different background from the others. Dark section next to light section. In DARK theme, use #DA4E24 orange as a full section background, not just small accents.
3. DATA CALLOUTS: If there are any numbers in the content, display at least one as a large hero stat (minimum 60px number, small label below).
4. SECTION VARIETY: Never use the same card style for all sections. Mix: full-width section, 2-col grid, single feature card, stat row, comparison panels, callout boxes.
5. SPACING: Generous padding. Minimum 32px inside cards. Minimum 40px between major sections. White space is a design element.
6. TYPOGRAPHY SCALE: Use at least 3 different font sizes: display (80px+), heading (24-32px), body (13-15px). The contrast between sizes creates visual interest.
7. COLOR USAGE: Use the accent color boldly - as full section backgrounds, large icon containers, stat badges. Not just for small text highlights.
8. ICONS: Every list item and feature point gets an inline SVG icon. Size 20-24px. Never use placeholder squares or empty circles.
9. FILL THE CANVAS: Content should fill the entire specified dimension. No large empty gaps at the bottom. If content is short, make elements bigger and more impactful.
10. ASYMMETRY: Avoid symmetric boring layouts where everything is the same size. One dominant element per section. Vary card widths - one large + two small, not three identical.

WHAT TO AVOID:
- All sections looking identical (same background, same layout, same card size)
- Small timid typography where the title is barely larger than body text
- Three identical boxes in a row as the entire layout
- Orange used only for tiny text accents - use it for full section backgrounds, large badges, stat callouts
- Generic "How it works" with 3 identical steps and nothing else
- Flat, monotone designs where everything blends together with no contrast
- Empty white/dark space at the bottom because content ran out early

CRITICAL - ICONS: Do NOT use <iconify-icon> web component tags or any external icon CDN.
They render asynchronously and will appear as empty boxes on PNG export.
Instead, use inline SVG for ALL icons. Examples:

Arrow right: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
Check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 12 4 10"/></svg>
Star: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
Globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
Clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
Robot/AI: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
Dollar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
Brain: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14"/></svg>
Rocket: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
Target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
Chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
Settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
Shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
Link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
Users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
Fire: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>

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
