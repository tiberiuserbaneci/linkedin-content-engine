"use client";

import { use, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { THEMES, ThemeKey } from "@/lib/studio-themes";
import {
  InfographicContent,
  CheatsheetContent,
  CarouselContent,
  PostCoverContent,
} from "@/lib/studio-types";
import { InfographicRenderer } from "@/components/studio/renderers/infographic-renderer";
import { CheatsheetRenderer } from "@/components/studio/renderers/cheatsheet-renderer";
import { CarouselRenderer } from "@/components/studio/renderers/carousel-renderer";
import { PostCoverRenderer } from "@/components/studio/renderers/post-cover-renderer";
import { AIGeneratePanel } from "@/components/studio/ai-generate-panel";

// ─── Default content ────────────────────────────────────────────────────────

const DEFAULT_INFOGRAPHIC: InfographicContent = {
  eyebrow: "LinkedIn Strategy",
  title: "5 Habits of Top Creators",
  subtitle: "What separates 1% creators from everyone else",
  metrics: [
    { value: "3×", label: "More Reach" },
    { value: "87%", label: "Consistency" },
    { value: "10K+", label: "Followers" },
  ],
  sections: [
    {
      title: "Post Consistently",
      bullets: [
        "Same days every week",
        "Batch-create content",
        "Use a content calendar",
        "Never miss a week",
      ],
    },
    {
      title: "Write Strong Hooks",
      bullets: [
        "First line stops the scroll",
        "Lead with a bold claim",
        "Use numbers & specifics",
        "Ask a provocative question",
      ],
    },
    {
      title: "Engage Authentically",
      bullets: [
        "Reply to every comment",
        "Comment on others' posts",
        "Share personal stories",
        "Build real relationships",
      ],
    },
    {
      title: "Optimize for Algorithm",
      bullets: [
        "Post in peak hours",
        "Use native content",
        "Encourage comments",
        "Avoid external links",
      ],
    },
  ],
};

const DEFAULT_CHEATSHEET: CheatsheetContent = {
  eyebrow: "Quick Reference",
  title: "LinkedIn Post Formats",
  subtitle: "Choose the right format for maximum engagement",
  sections: [
    {
      title: "Text Posts",
      items: [
        "1300 character sweet spot",
        "Use line breaks liberally",
        "End with a clear CTA",
        "3–5 relevant hashtags",
      ],
    },
    {
      title: "Carousel Posts",
      items: [
        "7–10 slides is optimal",
        "Hook on slide 1",
        "One idea per slide",
        "Strong CTA on last slide",
      ],
    },
    {
      title: "Image Posts",
      items: [
        "1200×627 for covers",
        "Bold, readable text",
        "High contrast colors",
        "Brand consistently",
      ],
    },
    {
      title: "Video Posts",
      items: [
        "Under 3 minutes",
        "Add captions always",
        "Hook in first 3 seconds",
        "Square format works best",
      ],
    },
  ],
  verdict:
    "Carousels drive the most saves and shares. Text posts drive the most comments. Mix both for a balanced strategy.",
};

const DEFAULT_CAROUSEL: CarouselContent = {
  title: "How to Grow on LinkedIn in 2025",
  slides: [
    {
      title: "Write Every Day",
      bullets: [
        "Build the writing muscle over time",
        "Ideas compound — one leads to the next",
        "Consistency signals credibility",
      ],
    },
    {
      title: "Niche Down Hard",
      bullets: [
        "Be the go-to person for one topic",
        "Generalists are forgettable",
        "Specialists get opportunities",
      ],
    },
    {
      title: "Engage Before You Post",
      bullets: [
        "Comment on 5 posts first",
        "Warm up the algorithm",
        "Build goodwill in advance",
      ],
    },
    {
      title: "Repurpose Everything",
      bullets: [
        "One idea → text, carousel, video",
        "Different formats reach different people",
        "Your best posts deserve a remix",
      ],
    },
  ],
  cta: {
    headline: "Start Today",
    subtext:
      "One post this week. Then another. That's how 10K followers happen.",
  },
};

const DEFAULT_POST_COVER: PostCoverContent = {
  eyebrow: "Hot Take",
  title: "Consistency Beats Talent Every Time",
  subtitle:
    "The creators winning on LinkedIn aren't the most gifted — they're the most relentless.",
};

// ─── Types ───────────────────────────────────────────────────────────────────

type FormatType = "infographic" | "cheatsheet" | "carousel" | "post-cover";

type ContentMap = {
  infographic: InfographicContent;
  cheatsheet: CheatsheetContent;
  carousel: CarouselContent;
  "post-cover": PostCoverContent;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDefaultContent(format: FormatType): ContentMap[FormatType] {
  switch (format) {
    case "infographic":
      return DEFAULT_INFOGRAPHIC;
    case "cheatsheet":
      return DEFAULT_CHEATSHEET;
    case "carousel":
      return DEFAULT_CAROUSEL;
    case "post-cover":
      return DEFAULT_POST_COVER;
  }
}

function isValidFormat(f: string): f is FormatType {
  return ["infographic", "cheatsheet", "carousel", "post-cover"].includes(f);
}

function getExportType(format: FormatType) {
  return format === "carousel" ? "PDF" : "PNG";
}

function getPreviewScale(format: FormatType) {
  switch (format) {
    case "infographic":
      return 500 / 1080;
    case "cheatsheet":
      return 500 / 900;
    case "carousel":
      return 460 / 1080;
    case "post-cover":
      return 500 / 1200;
  }
}

// ─── Sub-form components ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1A1A1A",
  border: "1px solid #2A2A2A",
  borderRadius: 6,
  color: "#F1F1F1",
  fontSize: 13,
  padding: "8px 10px",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 5,
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#DA4E24",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: 10,
  marginTop: 20,
};

function InfographicForm({
  content,
  onChange,
}: {
  content: InfographicContent;
  onChange: (c: InfographicContent) => void;
}) {
  const update = (patch: Partial<InfographicContent>) =>
    onChange({ ...content, ...patch });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Eyebrow</label>
        <input
          style={inputStyle}
          value={content.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Title</label>
        <textarea
          style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
          value={content.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Subtitle</label>
        <textarea
          style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
          value={content.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
        />
      </div>

      <div style={sectionHeaderStyle}>Metrics (3 stats)</div>
      {content.metrics.map((m, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Value</label>
            <input
              style={inputStyle}
              value={m.value}
              onChange={(e) => {
                const metrics = [...content.metrics];
                metrics[i] = { ...metrics[i], value: e.target.value };
                update({ metrics });
              }}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Label</label>
            <input
              style={inputStyle}
              value={m.label}
              onChange={(e) => {
                const metrics = [...content.metrics];
                metrics[i] = { ...metrics[i], label: e.target.value };
                update({ metrics });
              }}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={sectionHeaderStyle}>Sections</div>
        {content.sections.length < 7 && (
          <button
            onClick={() =>
              update({
                sections: [
                  ...content.sections,
                  { title: "New Section", bullets: ["", "", "", ""] },
                ],
              })
            }
            style={{
              fontSize: 11,
              color: "#DA4E24",
              background: "none",
              border: "1px solid #DA4E24",
              borderRadius: 4,
              padding: "3px 8px",
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        )}
      </div>

      {content.sections.map((sec, si) => (
        <div
          key={si}
          style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <label style={labelStyle}>Section {si + 1} Title</label>
          <input
            style={{ ...inputStyle, marginBottom: 8 }}
            value={sec.title}
            onChange={(e) => {
              const sections = [...content.sections];
              sections[si] = { ...sections[si], title: e.target.value };
              update({ sections });
            }}
          />
          {sec.bullets.map((b, bi) => (
            <input
              key={bi}
              style={{ ...inputStyle, marginBottom: 4 }}
              placeholder={`Bullet ${bi + 1}`}
              value={b}
              onChange={(e) => {
                const sections = [...content.sections];
                const bullets = [...sections[si].bullets];
                bullets[bi] = e.target.value;
                sections[si] = { ...sections[si], bullets };
                update({ sections });
              }}
            />
          ))}
          {content.sections.length > 1 && (
            <button
              onClick={() => {
                const sections = content.sections.filter((_, idx) => idx !== si);
                update({ sections });
              }}
              style={{
                fontSize: 11,
                color: "#666",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Remove section
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function CheatsheetForm({
  content,
  onChange,
}: {
  content: CheatsheetContent;
  onChange: (c: CheatsheetContent) => void;
}) {
  const update = (patch: Partial<CheatsheetContent>) =>
    onChange({ ...content, ...patch });
  const [showComparison, setShowComparison] = useState(
    !!content.comparison
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Eyebrow</label>
        <input
          style={inputStyle}
          value={content.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Title</label>
        <textarea
          style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
          value={content.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Subtitle</label>
        <textarea
          style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
          value={content.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={sectionHeaderStyle}>Sections</div>
        {content.sections.length < 4 && (
          <button
            onClick={() =>
              update({
                sections: [
                  ...content.sections,
                  { title: "New Section", items: ["", "", ""] },
                ],
              })
            }
            style={{
              fontSize: 11,
              color: "#DA4E24",
              background: "none",
              border: "1px solid #DA4E24",
              borderRadius: 4,
              padding: "3px 8px",
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        )}
      </div>

      {content.sections.map((sec, si) => (
        <div
          key={si}
          style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <label style={labelStyle}>Section {si + 1} Title</label>
          <input
            style={{ ...inputStyle, marginBottom: 8 }}
            value={sec.title}
            onChange={(e) => {
              const sections = [...content.sections];
              sections[si] = { ...sections[si], title: e.target.value };
              update({ sections });
            }}
          />
          <label style={labelStyle}>Items (one per line)</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={sec.items.join("\n")}
            onChange={(e) => {
              const sections = [...content.sections];
              sections[si] = {
                ...sections[si],
                items: e.target.value.split("\n"),
              };
              update({ sections });
            }}
          />
          {content.sections.length > 1 && (
            <button
              onClick={() => {
                const sections = content.sections.filter(
                  (_, idx) => idx !== si
                );
                update({ sections });
              }}
              style={{
                fontSize: 11,
                color: "#666",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Remove section
            </button>
          )}
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id="comparison"
          checked={showComparison}
          onChange={(e) => {
            setShowComparison(e.target.checked);
            if (!e.target.checked) update({ comparison: undefined });
            else
              update({
                comparison: {
                  headers: ["Feature", "Option A", "Option B"],
                  rows: [{ label: "Example", values: ["Yes", "No"] }],
                },
              });
          }}
        />
        <label
          htmlFor="comparison"
          style={{ fontSize: 13, color: "#888", cursor: "pointer" }}
        >
          Show comparison table
        </label>
      </div>

      {showComparison && content.comparison && (
        <div
          style={{
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <label style={labelStyle}>
            Headers (comma-separated)
          </label>
          <input
            style={{ ...inputStyle, marginBottom: 8 }}
            value={content.comparison.headers.join(", ")}
            onChange={(e) => {
              update({
                comparison: {
                  ...content.comparison!,
                  headers: e.target.value.split(",").map((h) => h.trim()),
                },
              });
            }}
          />
          <label style={labelStyle}>
            Rows (format: Label | Val1 | Val2)
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={content.comparison.rows
              .map((r) => `${r.label} | ${r.values.join(" | ")}`)
              .join("\n")}
            onChange={(e) => {
              const rows = e.target.value
                .split("\n")
                .filter(Boolean)
                .map((line) => {
                  const parts = line.split("|").map((p) => p.trim());
                  return {
                    label: parts[0] || "",
                    values: parts.slice(1),
                  };
                });
              update({
                comparison: { ...content.comparison!, rows },
              });
            }}
          />
        </div>
      )}

      <div>
        <label style={labelStyle}>Verdict (optional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          value={content.verdict || ""}
          onChange={(e) =>
            update({ verdict: e.target.value || undefined })
          }
        />
      </div>
    </div>
  );
}

function CarouselForm({
  content,
  onChange,
  onSlideSelect,
  selectedSlide,
}: {
  content: CarouselContent;
  onChange: (c: CarouselContent) => void;
  onSlideSelect: (i: number) => void;
  selectedSlide: number;
}) {
  const update = (patch: Partial<CarouselContent>) =>
    onChange({ ...content, ...patch });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Carousel Title (Title Slide)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 56, resize: "vertical" }}
          value={content.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>

      {/* Slide tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={() => onSlideSelect(0)}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            border: `1px solid ${selectedSlide === 0 ? "#DA4E24" : "#2A2A2A"}`,
            backgroundColor: selectedSlide === 0 ? "#DA4E24" : "transparent",
            color: selectedSlide === 0 ? "#fff" : "#888",
            cursor: "pointer",
          }}
        >
          Title
        </button>
        {content.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => onSlideSelect(i + 1)}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 4,
              border: `1px solid ${
                selectedSlide === i + 1 ? "#DA4E24" : "#2A2A2A"
              }`,
              backgroundColor:
                selectedSlide === i + 1 ? "#DA4E24" : "transparent",
              color: selectedSlide === i + 1 ? "#fff" : "#888",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onSlideSelect(content.slides.length + 1)}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            border: `1px solid ${
              selectedSlide === content.slides.length + 1
                ? "#DA4E24"
                : "#2A2A2A"
            }`,
            backgroundColor:
              selectedSlide === content.slides.length + 1
                ? "#DA4E24"
                : "transparent",
            color:
              selectedSlide === content.slides.length + 1 ? "#fff" : "#888",
            cursor: "pointer",
          }}
        >
          CTA
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={sectionHeaderStyle}>
          Content Slides ({content.slides.length})
        </div>
        {content.slides.length < 7 && (
          <button
            onClick={() => {
              update({
                slides: [
                  ...content.slides,
                  {
                    title: "New Slide",
                    bullets: ["", "", "", "", ""],
                  },
                ],
              });
            }}
            style={{
              fontSize: 11,
              color: "#DA4E24",
              background: "none",
              border: "1px solid #DA4E24",
              borderRadius: 4,
              padding: "3px 8px",
              cursor: "pointer",
            }}
          >
            + Add Slide
          </button>
        )}
      </div>

      {content.slides.map((slide, si) => (
        <div
          key={si}
          style={{
            backgroundColor: "#111",
            border: `1px solid ${
              selectedSlide === si + 1 ? "#DA4E24" : "#222"
            }`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <label style={labelStyle}>Slide {si + 1} Title</label>
          <input
            style={{ ...inputStyle, marginBottom: 8 }}
            value={slide.title}
            onChange={(e) => {
              const slides = [...content.slides];
              slides[si] = { ...slides[si], title: e.target.value };
              update({ slides });
            }}
          />
          {slide.bullets.map((b, bi) => (
            <input
              key={bi}
              style={{ ...inputStyle, marginBottom: 4 }}
              placeholder={`Bullet ${bi + 1}`}
              value={b}
              onChange={(e) => {
                const slides = [...content.slides];
                const bullets = [...slides[si].bullets];
                bullets[bi] = e.target.value;
                slides[si] = { ...slides[si], bullets };
                update({ slides });
              }}
            />
          ))}
          {content.slides.length > 1 && (
            <button
              onClick={() => {
                const slides = content.slides.filter((_, idx) => idx !== si);
                update({ slides });
              }}
              style={{
                fontSize: 11,
                color: "#666",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Remove slide
            </button>
          )}
        </div>
      ))}

      <div style={sectionHeaderStyle}>CTA Slide</div>
      <div>
        <label style={labelStyle}>Headline</label>
        <input
          style={{ ...inputStyle, marginBottom: 8 }}
          value={content.cta.headline}
          onChange={(e) =>
            update({ cta: { ...content.cta, headline: e.target.value } })
          }
        />
      </div>
      <div>
        <label style={labelStyle}>Subtext</label>
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          value={content.cta.subtext}
          onChange={(e) =>
            update({ cta: { ...content.cta, subtext: e.target.value } })
          }
        />
      </div>
    </div>
  );
}

function PostCoverForm({
  content,
  onChange,
}: {
  content: PostCoverContent;
  onChange: (c: PostCoverContent) => void;
}) {
  const update = (patch: Partial<PostCoverContent>) =>
    onChange({ ...content, ...patch });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label style={labelStyle}>Eyebrow</label>
        <input
          style={inputStyle}
          value={content.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Title</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          value={content.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>
      <div>
        <label style={labelStyle}>Subtitle</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          value={content.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
        />
      </div>
    </div>
  );
}

// ─── Preview panel ────────────────────────────────────────────────────────────

function PreviewPanel({
  format,
  theme,
  content,
  carouselSlide,
}: {
  format: FormatType;
  theme: (typeof THEMES)[ThemeKey];
  content: ContentMap[FormatType];
  carouselSlide: number;
}) {
  const scale = getPreviewScale(format);

  let renderedWidth = 1080;
  let renderedHeight: number | "auto" = 1350;
  if (format === "cheatsheet") {
    renderedWidth = 900;
    renderedHeight = "auto";
  } else if (format === "carousel") {
    renderedWidth = 1080;
    renderedHeight = 1080;
  } else if (format === "post-cover") {
    renderedWidth = 1200;
    renderedHeight = 627;
  }

  const containerWidth = Math.round(renderedWidth * scale);

  return (
    <div
      style={{
        width: containerWidth,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: renderedWidth,
        }}
      >
        {format === "infographic" && (
          <InfographicRenderer
            content={content as InfographicContent}
            theme={theme}
          />
        )}
        {format === "cheatsheet" && (
          <CheatsheetRenderer
            content={content as CheatsheetContent}
            theme={theme}
          />
        )}
        {format === "carousel" && (
          <CarouselRenderer
            content={content as CarouselContent}
            theme={theme}
            slideIndex={carouselSlide}
          />
        )}
        {format === "post-cover" && (
          <PostCoverRenderer
            content={content as PostCoverContent}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CreatePage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format: rawFormat } = use(params);
  const router = useRouter();

  const format: FormatType = isValidFormat(rawFormat)
    ? rawFormat
    : "infographic";

  const [theme, setTheme] = useState<ThemeKey>("light");
  const [content, setContent] = useState<ContentMap[FormatType]>(
    () => getDefaultContent(format) as ContentMap[FormatType]
  );
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme];
  const exportType = getExportType(format);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const titleField =
        "title" in content
          ? (content as { title: string }).title
          : "Untitled";
      await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          theme,
          title: titleField || "Untitled",
          content_json: content,
        }),
      });
    } catch {
      // silently fail if no supabase
    } finally {
      setSaving(false);
    }
  }, [content, format, theme]);

  const handleExportPNG = useCallback(async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${format}-${theme}.png`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setExporting(false);
    }
  }, [format, theme]);

  const handleExportPDF = useCallback(async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      const carouselContent = content as CarouselContent;
      const totalSlides = carouselContent.slides.length + 2; // title + content + cta

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1080],
      });

      for (let si = 0; si < totalSlides; si++) {
        setCarouselSlide(si);
        await new Promise((r) => setTimeout(r, 500));
        if (!exportRef.current) break;
        const canvas = await html2canvas(exportRef.current, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        if (si > 0) pdf.addPage([1080, 1080]);
        pdf.addImage(imgData, "JPEG", 0, 0, 1080, 1080);
      }

      pdf.save(`carousel-${theme}.pdf`);
    } catch (e) {
      console.error("Export PDF failed", e);
    } finally {
      setExporting(false);
      setCarouselSlide(0);
    }
  }, [content, theme]);

  const previewScale = getPreviewScale(format);

  // Calculate preview container dimensions for the offscreen export div
  let exportWidth = 1080;
  let exportHeight: number | undefined = 1350;
  if (format === "cheatsheet") {
    exportWidth = 900;
    exportHeight = undefined;
  } else if (format === "carousel") {
    exportWidth = 1080;
    exportHeight = 1080;
  } else if (format === "post-cover") {
    exportWidth = 1200;
    exportHeight = 627;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#F1F1F1",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #1E1E1E",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "#0A0A0A",
        }}
      >
        <button
          onClick={() => router.push("/studio")}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Studio
        </button>
        <span style={{ color: "#333" }}>|</span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#F1F1F1",
            textTransform: "capitalize",
          }}
        >
          {format.replace("-", " ")}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Theme switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["light", "dark", "handwriting"] as ThemeKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "5px 12px",
                borderRadius: 6,
                border: `1px solid ${theme === t ? "#DA4E24" : "#2A2A2A"}`,
                backgroundColor: theme === t ? "#DA4E24" : "transparent",
                color: theme === t ? "#FFFFFF" : "#888",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {THEMES[t].label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: "7px 16px",
            borderRadius: 6,
            border: "1px solid #2A2A2A",
            backgroundColor: "transparent",
            color: "#F1F1F1",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>

        <button
          onClick={exportType === "PDF" ? handleExportPDF : handleExportPNG}
          disabled={exporting}
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: "7px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#DA4E24",
            color: "#FFFFFF",
            cursor: exporting ? "not-allowed" : "pointer",
            opacity: exporting ? 0.5 : 1,
          }}
        >
          {exporting ? "Exporting…" : `Export ${exportType}`}
        </button>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel - form */}
        <div
          style={{
            width: 360,
            borderRight: "1px solid #1E1E1E",
            overflowY: "auto",
            padding: "24px 20px",
            flexShrink: 0,
          }}
        >
          <AIGeneratePanel
            format={format}
            onGenerated={(generated) =>
              setContent(generated as unknown as ContentMap[FormatType])
            }
          />

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
            }}
          >
            Content
          </div>

          {format === "infographic" && (
            <InfographicForm
              content={content as InfographicContent}
              onChange={(c) => setContent(c)}
            />
          )}
          {format === "cheatsheet" && (
            <CheatsheetForm
              content={content as CheatsheetContent}
              onChange={(c) => setContent(c)}
            />
          )}
          {format === "carousel" && (
            <CarouselForm
              content={content as CarouselContent}
              onChange={(c) => setContent(c)}
              onSlideSelect={setCarouselSlide}
              selectedSlide={carouselSlide}
            />
          )}
          {format === "post-cover" && (
            <PostCoverForm
              content={content as PostCoverContent}
              onChange={(c) => setContent(c)}
            />
          )}
        </div>

        {/* Right panel - preview */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "32px 24px",
            backgroundColor: "#050505",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 16,
              alignSelf: "flex-start",
            }}
          >
            Preview — {Math.round(previewScale * 100)}% scale
          </div>

          {/* Scaled preview */}
          <PreviewPanel
            format={format}
            theme={currentTheme}
            content={content}
            carouselSlide={carouselSlide}
          />
        </div>
      </div>

      {/* Hidden export div at full size */}
      <div
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: exportWidth,
          height: exportHeight,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div ref={exportRef}>
          {format === "infographic" && (
            <InfographicRenderer
              content={content as InfographicContent}
              theme={currentTheme}
            />
          )}
          {format === "cheatsheet" && (
            <CheatsheetRenderer
              content={content as CheatsheetContent}
              theme={currentTheme}
            />
          )}
          {format === "carousel" && (
            <CarouselRenderer
              content={content as CarouselContent}
              theme={currentTheme}
              slideIndex={carouselSlide}
            />
          )}
          {format === "post-cover" && (
            <PostCoverRenderer
              content={content as PostCoverContent}
              theme={currentTheme}
            />
          )}
        </div>
      </div>
    </div>
  );
}
