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

export function InfographicRenderer({ content, theme }: Props) {
  const isExpressive = theme.key === "expressive";

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
            fontSize: isExpressive ? 72 : 96,
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
        {content.sections.map((section, i) => {
          if (isExpressive) {
            return (
              <ExpressiveCard
                key={i}
                index={i}
                title={section.title}
                items={section.bullets}
                theme={theme}
              />
            );
          }

          return (
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
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 72px",
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isExpressive ? "#1A1A1A" : theme.secondary,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: isExpressive ? "#FFFFFF" : theme.muted,
            fontFamily: theme.bodyFont,
          }}
        >
          LinkedIn Content Engine
        </div>
        {isExpressive ? (
          <div
            style={{
              padding: "6px 16px",
              backgroundColor: theme.accent,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: theme.bodyFont,
            }}
          >
            Follow for more
          </div>
        ) : (
          <div
            style={{
              width: 32,
              height: 6,
              backgroundColor: theme.accent,
              borderRadius: 3,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Expressive Card Component ── */

function ExpressiveCard({
  index,
  title,
  items,
  theme,
}: {
  index: number;
  title: string;
  items: string[];
  theme: Theme;
}) {
  const style = getCardStyle(index);
  const color = getCardColor(index);
  const iconName = getIconForKeyword(title);

  switch (style) {
    case "A":
      // Solid colored background
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: color.bg,
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            boxShadow: `0 4px 16px ${color.shadow}`,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: color.title,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `2px solid rgba(0,0,0,0.1)`,
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <Icon icon={iconName} width={16} height={16} style={{ flexShrink: 0, marginTop: 3, color: color.title }} />
              <span style={{ fontSize: 14, color: color.title, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "B":
      // Dark background with orange title
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#DA4E24",
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "2px solid #333",
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <Icon icon={iconName} width={16} height={16} style={{ flexShrink: 0, marginTop: 3, color: "#DA4E24" }} />
              <span style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "C":
      // Large faded number in background
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: "#FFFFFF",
            border: "2px solid #E5E5E5",
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 12,
              top: -10,
              fontSize: 120,
              fontFamily: theme.headingFont,
              color: "rgba(0,0,0,0.05)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `2px solid ${theme.accent}`,
              position: "relative",
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, position: "relative" }}>
              <Icon icon={iconName} width={16} height={16} style={{ flexShrink: 0, marginTop: 3, color: theme.accent }} />
              <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "D":
      // Two-column mini-table style
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: "#F7F7F7",
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: `2px solid ${theme.accent}`,
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div
              key={j}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: j < items.filter(Boolean).length - 1 ? "1px solid #E5E5E5" : "none",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  backgroundColor: theme.accent,
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginRight: 12,
                }}
              >
                {j + 1}
              </div>
              <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.4, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "E":
      // Icon-heavy: large icon centered top
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: "#FFFFFF",
            border: "2px solid #E5E5E5",
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
            <Icon icon={iconName} width={48} height={48} style={{ color: theme.accent }} />
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 14,
              fontFamily: theme.bodyFont,
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).slice(0, 4).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, textAlign: "left" }}>
              <Icon icon={iconName} width={14} height={14} style={{ flexShrink: 0, marginTop: 4, color: theme.accent }} />
              <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    case "F":
      // Quote/callout style
      return (
        <div
          style={{
            width: "calc(50% - 12px)",
            backgroundColor: color.bg,
            borderRadius: 16,
            padding: "24px 28px",
            boxSizing: "border-box",
            borderLeft: `6px solid ${theme.accent}`,
            boxShadow: `0 4px 16px ${color.shadow}`,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontFamily: theme.headingFont,
              color: theme.accent,
              lineHeight: 1,
              marginBottom: 4,
              opacity: 0.6,
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: color.title,
              marginBottom: 14,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          {items.filter(Boolean).map((item, j) => (
            <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <Icon icon={iconName} width={16} height={16} style={{ flexShrink: 0, marginTop: 3, color: color.title }} />
              <span style={{ fontSize: 14, color: color.title, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

// Force client to suppress unused import warnings
void CARD_STYLE_ROTATION;
