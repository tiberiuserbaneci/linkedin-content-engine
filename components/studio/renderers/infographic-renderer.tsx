"use client";

import { InfographicContent } from "@/lib/studio-types";
import { Theme, HANDWRITING_SECTION_COLORS } from "@/lib/studio-themes";

interface Props {
  content: InfographicContent;
  theme: Theme;
}

export function InfographicRenderer({ content, theme }: Props) {
  const isHandwriting = theme.key === "handwriting";

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
        {/* Eyebrow */}
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

        {/* Title */}
        <div
          style={{
            fontSize: isHandwriting ? 80 : 96,
            fontFamily: theme.headingFont,
            color: theme.text,
            lineHeight: 1.0,
            letterSpacing: isHandwriting ? "0.01em" : "0.02em",
            marginBottom: 16,
          }}
        >
          {content.title}
        </div>

        {/* Subtitle */}
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
          const hwColor =
            HANDWRITING_SECTION_COLORS[i % HANDWRITING_SECTION_COLORS.length];
          return (
            <div
              key={i}
              style={{
                width: "calc(50% - 12px)",
                backgroundColor: isHandwriting ? hwColor.bg : theme.cardBg,
                border: `2px solid ${isHandwriting ? hwColor.border : theme.border}`,
                borderRadius: isHandwriting ? 16 : 8,
                padding: "24px 28px",
                boxSizing: "border-box",
                boxShadow: isHandwriting
                  ? "3px 3px 0px rgba(0,0,0,0.08)"
                  : "none",
              }}
            >
              {/* Section title */}
              <div
                style={{
                  fontSize: isHandwriting ? 22 : 18,
                  fontFamily: isHandwriting ? theme.headingFont : theme.bodyFont,
                  fontWeight: isHandwriting ? 400 : 700,
                  color: isHandwriting ? hwColor.text : theme.text,
                  marginBottom: 14,
                  borderBottom: `2px solid ${isHandwriting ? hwColor.border : theme.accent}`,
                  paddingBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {isHandwriting && (
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: hwColor.badge,
                      color: "#FFFFFF",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      fontSize: 13,
                      fontFamily: theme.bodyFont,
                      fontWeight: 700,
                      textAlign: "center",
                      lineHeight: "24px",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                {section.title}
              </div>

              {/* Bullets */}
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
                  {isHandwriting ? (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        border: `2px solid ${hwColor.badge}`,
                        borderRadius: 4,
                        flexShrink: 0,
                        marginTop: 2,
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: hwColor.badge,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  ) : (
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
                  )}
                  <span
                    style={{
                      fontSize: 15,
                      color: isHandwriting ? hwColor.text : theme.text,
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
