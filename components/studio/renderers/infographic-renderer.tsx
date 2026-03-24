"use client";

import { InfographicContent } from "@/lib/studio-types";
import { Theme } from "@/lib/studio-themes";
import {
  getCardStyle,
  getCardColor,
  CARD_STYLE_ROTATION,
} from "@/lib/layout-engine";
import { getIconForKeyword } from "@/lib/icons";
import { Icon } from "@iconify/react";

interface Props {
  content: InfographicContent;
  theme: Theme;
}

// Suppress unused import warning
void CARD_STYLE_ROTATION;

export function InfographicRenderer({ content, theme }: Props) {
  const isExpressive = theme.key === "expressive";

  if (isExpressive) {
    return <ExpressiveInfographic content={content} theme={theme} />;
  }

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        backgroundColor: theme.bg,
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Accent bar at top */}
      <div style={{ width: "100%", height: 8, backgroundColor: theme.accent }} />

      {/* Header */}
      <div
        style={{
          padding: "48px 72px 32px",
          borderBottom: `2px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
            fontFamily: theme.bodyFont,
          }}
        >
          {content.eyebrow}
        </div>
        <div
          style={{
            fontSize: 96,
            fontFamily: theme.headingFont,
            color: theme.text,
            lineHeight: 1.0,
            letterSpacing: "0.02em",
            marginBottom: 16,
          }}
        >
          {content.title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: theme.muted,
            lineHeight: 1.5,
            fontFamily: theme.bodyFont,
            maxWidth: 700,
          }}
        >
          {content.subtitle}
        </div>
      </div>

      {/* Metrics row */}
      {content.metrics && content.metrics.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "32px 72px",
            gap: 0,
            borderBottom: `2px solid ${theme.border}`,
            backgroundColor: theme.secondary,
          }}
        >
          {content.metrics.map((metric, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight:
                  i < content.metrics.length - 1
                    ? `1px solid ${theme.border}`
                    : "none",
                paddingLeft: i > 0 ? 32 : 0,
                paddingRight: i < content.metrics.length - 1 ? 32 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontFamily: theme.headingFont,
                  color: theme.accent,
                  lineHeight: 1.0,
                  letterSpacing: "0.02em",
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: theme.muted,
                  marginTop: 8,
                  fontFamily: theme.bodyFont,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sections grid */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: "32px 72px",
          gap: 24,
          alignContent: "flex-start",
        }}
      >
        {content.sections.map((section, i) => (
          <div
            key={i}
            style={{
              width: "calc(50% - 12px)",
              backgroundColor: theme.cardBg,
              border: `2px solid ${theme.border}`,
              borderRadius: 8,
              padding: "24px 28px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontFamily: theme.bodyFont,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 14,
                borderBottom: `2px solid ${theme.accent}`,
                paddingBottom: 10,
              }}
            >
              {section.title}
            </div>
            {section.bullets.filter(Boolean).map((bullet, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: theme.accent,
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                <span
                  style={{
                    fontSize: 15,
                    color: theme.text,
                    lineHeight: 1.5,
                    fontFamily: theme.bodyFont,
                  }}
                >
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 72px",
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.secondary,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: theme.muted,
            fontFamily: theme.bodyFont,
          }}
        >
          LinkedIn Content Engine
        </div>
        <div
          style={{
            width: 32,
            height: 6,
            backgroundColor: theme.accent,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPRESSIVE — Viral Infographic Template
   Multi-style cards, gradient header, icon-heavy, numbered sections
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpressiveInfographic({ content, theme }: Props) {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        backgroundColor: "#FFFFFF",
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Gradient Header Block ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D1810 60%, #1A1A1A 100%)",
          padding: "52px 72px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative large number */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: -20,
            fontSize: 240,
            fontFamily: theme.headingFont,
            color: "rgba(218, 78, 36, 0.08)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {content.sections.length}
        </div>

        {/* Eyebrow pill */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(218, 78, 36, 0.2)",
            border: "1px solid rgba(218, 78, 36, 0.4)",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            fontWeight: 700,
            color: "#DA4E24",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          {content.eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontFamily: theme.headingFont,
            color: "#FFFFFF",
            lineHeight: 1.0,
            letterSpacing: "0.02em",
            marginBottom: 14,
            maxWidth: 800,
          }}
        >
          {content.title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          {content.subtitle}
        </div>
      </div>

      {/* ── Metrics Bar ── */}
      {content.metrics && content.metrics.length > 0 && (
        <div
          style={{
            display: "flex",
            padding: "0 72px",
            marginTop: -24,
            gap: 20,
            position: "relative",
            zIndex: 1,
          }}
        >
          {content.metrics.map((metric, i) => {
            const colors = [
              { bg: "#DA4E24", text: "#FFF" },
              { bg: "#1A1A1A", text: "#FFF" },
              { bg: "#FFE5D9", text: "#7C2D12" },
            ];
            const c = colors[i % colors.length];
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: c.bg,
                  borderRadius: 16,
                  padding: "20px 24px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontFamily: theme.headingFont,
                    color: c.text,
                    lineHeight: 1.0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: c.text,
                    opacity: 0.7,
                    marginTop: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Section Cards Grid ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: "28px 72px 20px",
          gap: 20,
          alignContent: "flex-start",
        }}
      >
        {content.sections.map((section, i) => (
          <ExpressiveSection
            key={i}
            index={i}
            title={section.title}
            items={section.bullets}
            theme={theme}
            total={content.sections.length}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "16px 72px",
          backgroundColor: "#1A1A1A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          LinkedIn Content Engine
        </div>
        <div
          style={{
            padding: "6px 18px",
            backgroundColor: "#DA4E24",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          Save this for later →
        </div>
      </div>
    </div>
  );
}

/* ── Expressive Section Card ── */

function ExpressiveSection({
  index,
  title,
  items,
  theme,
  total,
}: {
  index: number;
  title: string;
  items: string[];
  theme: Theme;
  total: number;
}) {
  const style = getCardStyle(index);
  const color = getCardColor(index);
  const iconName = getIconForKeyword(title);
  const num = String(index + 1).padStart(2, "0");

  // Use full-width for odd last card
  const isLastOdd = total % 2 === 1 && index === total - 1;
  const cardWidth = isLastOdd ? "100%" : "calc(50% - 10px)";

  switch (style) {
    case "A":
      // Colored bg with icon header bar
      return (
        <div
          style={{
            width: cardWidth,
            backgroundColor: color.bg,
            borderRadius: 20,
            padding: "28px 28px 24px",
            boxSizing: "border-box",
            boxShadow: `0 6px 24px ${color.shadow}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Icon + Number header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon icon={iconName} width={24} height={24} style={{ color: color.title }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: color.title, opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>{num}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: color.title, lineHeight: 1.2 }}>{title}</div>
            </div>
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color.title, flexShrink: 0, marginTop: 7, opacity: 0.5 }} />
              <span style={{ fontSize: 13, color: color.title, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "E":
      // Centered icon with accent ring
      return (
        <div
          style={{
            width: cardWidth,
            backgroundColor: "#FFFFFF",
            border: "2px solid #E8E8E8",
            borderRadius: 20,
            padding: "28px 28px 24px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #DA4E24", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(218,78,36,0.06)" }}>
              <Icon icon={iconName} width={22} height={22} style={{ color: "#DA4E24" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em" }}>STEP {num}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{title}</div>
            </div>
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <Icon icon="tabler:circle-check" width={16} height={16} style={{ flexShrink: 0, marginTop: 2, color: "#DA4E24" }} />
              <span style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "B":
      // Dark card
      return (
        <div
          style={{
            width: cardWidth,
            backgroundColor: "#1A1A1A",
            borderRadius: 20,
            padding: "28px 28px 24px",
            boxSizing: "border-box",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(218,78,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon icon={iconName} width={24} height={24} style={{ color: "#DA4E24" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em" }}>{num}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>{title}</div>
            </div>
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <Icon icon={iconName} width={14} height={14} style={{ flexShrink: 0, marginTop: 3, color: "#DA4E24" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "C":
      // Large faded number background
      return (
        <div
          style={{
            width: cardWidth,
            backgroundColor: "#F7F7F7",
            borderRadius: 20,
            padding: "28px 28px 24px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", right: 10, top: -16, fontSize: 140, fontFamily: theme.headingFont, color: "rgba(218,78,36,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
            {num}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#DA4E24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon icon={iconName} width={22} height={22} style={{ color: "#FFF" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{title}</div>
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7, position: "relative" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: "#DA4E24", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                {j + 1}
              </div>
              <span style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "D":
      // Striped rows table style
      return (
        <div
          style={{
            width: cardWidth,
            backgroundColor: "#FFFFFF",
            border: "2px solid #E5E5E5",
            borderRadius: 20,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div style={{ padding: "18px 24px", backgroundColor: color.bg, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon icon={iconName} width={20} height={20} style={{ color: color.title }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: color.title }}>{title}</div>
          </div>
          {/* Rows */}
          {items.filter(Boolean).map((item, j) => (
            <div
              key={j}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 24px",
                backgroundColor: j % 2 === 0 ? "#FFFFFF" : "#F9F9F9",
                borderTop: "1px solid #F0F0F0",
                gap: 12,
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: color.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: color.title, flexShrink: 0 }}>
                {j + 1}
              </div>
              <span style={{ fontSize: 13, color: theme.text, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "F":
      // Quote/callout with gradient accent bar
      return (
        <div
          style={{
            width: cardWidth,
            background: `linear-gradient(135deg, ${color.bg} 0%, #FFFFFF 100%)`,
            borderRadius: 20,
            padding: "28px 28px 24px",
            boxSizing: "border-box",
            borderLeft: "6px solid #DA4E24",
            boxShadow: `0 6px 24px ${color.shadow}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 40, fontFamily: theme.headingFont, color: "#DA4E24", lineHeight: 1, opacity: 0.4 }}>&ldquo;</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em" }}>KEY INSIGHT</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: color.title, lineHeight: 1.2 }}>{title}</div>
            </div>
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
              <Icon icon="tabler:arrow-right" width={14} height={14} style={{ flexShrink: 0, marginTop: 3, color: "#DA4E24" }} />
              <span style={{ fontSize: 13, color: color.title, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
