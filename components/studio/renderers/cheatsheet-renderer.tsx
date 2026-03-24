"use client";

import { CheatsheetContent } from "@/lib/studio-types";
import { Theme } from "@/lib/studio-themes";
import { getCardStyle, getCardColor } from "@/lib/layout-engine";
import { getIconForKeyword } from "@/lib/icons";
import { Icon } from "@iconify/react";

interface Props {
  content: CheatsheetContent;
  theme: Theme;
}

export function CheatsheetRenderer({ content, theme }: Props) {
  const isExpressive = theme.key === "expressive";
  const numSections = content.sections.length;
  const useGrid = numSections >= 3;

  return (
    <div
      style={{
        width: 900,
        backgroundColor: theme.bg,
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Accent bar */}
      <div style={{ width: "100%", height: 8, backgroundColor: theme.accent }} />

      {/* Header */}
      <div
        style={{
          padding: "48px 64px 32px",
          borderBottom: `2px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: theme.bodyFont,
          }}
        >
          {content.eyebrow}
        </div>
        <div
          style={{
            fontSize: isExpressive ? 64 : 76,
            fontFamily: theme.headingFont,
            color: theme.text,
            lineHeight: 1.0,
            letterSpacing: "0.02em",
            marginBottom: 12,
          }}
        >
          {content.title}
        </div>
        <div
          style={{
            fontSize: 18,
            color: theme.muted,
            lineHeight: 1.5,
            fontFamily: theme.bodyFont,
            maxWidth: 600,
          }}
        >
          {content.subtitle}
        </div>
      </div>

      {/* Sections */}
      <div
        style={{
          padding: "32px 64px",
          display: "flex",
          flexDirection: useGrid ? "row" : "column",
          flexWrap: useGrid ? "wrap" : "nowrap",
          gap: 20,
        }}
      >
        {content.sections.map((section, i) => {
          const colWidth =
            useGrid
              ? numSections === 4
                ? "calc(50% - 10px)"
                : "100%"
              : "100%";

          if (isExpressive) {
            const style = getCardStyle(i);
            const color = getCardColor(i);
            const iconName = getIconForKeyword(section.title);

            if (style === "B") {
              return (
                <div
                  key={i}
                  style={{
                    width: colWidth,
                    backgroundColor: "#1A1A1A",
                    borderRadius: 16,
                    padding: "24px 28px",
                    boxSizing: "border-box",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#DA4E24", marginBottom: 14, paddingBottom: 10, borderBottom: "2px solid #333" }}>
                    {section.title}
                  </div>
                  {section.items.filter(Boolean).map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <Icon icon={iconName} width={14} height={14} style={{ flexShrink: 0, marginTop: 3, color: "#DA4E24" }} />
                      <span style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
                    </div>
                  ))}
                </div>
              );
            }

            if (style === "E") {
              return (
                <div
                  key={i}
                  style={{
                    width: colWidth,
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #E5E5E5",
                    borderRadius: 16,
                    padding: "24px 28px",
                    boxSizing: "border-box",
                    textAlign: "center",
                  }}
                >
                  <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
                    <Icon icon={iconName} width={40} height={40} style={{ color: theme.accent }} />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
                    {section.title}
                  </div>
                  {section.items.filter(Boolean).map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, textAlign: "left" }}>
                      <Icon icon={iconName} width={14} height={14} style={{ flexShrink: 0, marginTop: 3, color: theme.accent }} />
                      <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
                    </div>
                  ))}
                </div>
              );
            }

            // Default colored card (A, C, D, F)
            return (
              <div
                key={i}
                style={{
                  width: colWidth,
                  backgroundColor: color.bg,
                  borderRadius: 16,
                  padding: "24px 28px",
                  boxSizing: "border-box",
                  boxShadow: `0 4px 16px ${color.shadow}`,
                  position: "relative",
                  overflow: "hidden",
                  borderLeft: style === "F" ? `6px solid ${theme.accent}` : "none",
                }}
              >
                {style === "C" && (
                  <div style={{ position: "absolute", right: 12, top: -10, fontSize: 100, fontFamily: theme.headingFont, color: "rgba(0,0,0,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
                {style === "F" && (
                  <div style={{ fontSize: 36, fontFamily: theme.headingFont, color: theme.accent, lineHeight: 1, marginBottom: 4, opacity: 0.6 }}>
                    &ldquo;
                  </div>
                )}
                <div style={{ fontSize: 17, fontWeight: 700, color: color.title, marginBottom: 14, paddingBottom: 10, borderBottom: "2px solid rgba(0,0,0,0.1)", position: "relative" }}>
                  {section.title}
                </div>
                {section.items.filter(Boolean).map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8, position: "relative" }}>
                    <Icon icon={iconName} width={14} height={14} style={{ flexShrink: 0, marginTop: 3, color: color.title }} />
                    <span style={{ fontSize: 14, color: color.title, lineHeight: 1.5, fontFamily: theme.bodyFont }}>{item}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Light/Dark theme
          return (
            <div
              key={i}
              style={{
                width: colWidth,
                backgroundColor: theme.cardBg,
                border: `2px solid ${theme.border}`,
                borderRadius: 8,
                padding: "24px 28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 17,
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
              {section.items.filter(Boolean).map((item, j) => (
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
                      marginTop: 7,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: theme.text,
                      lineHeight: 1.5,
                      fontFamily: theme.bodyFont,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {content.comparison &&
        content.comparison.headers.length > 0 && (
          <div style={{ padding: "0 64px 32px" }}>
            <div
              style={{
                border: `2px solid ${theme.border}`,
                borderRadius: isExpressive ? 16 : 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  backgroundColor: theme.accent,
                }}
              >
                {content.comparison.headers.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: i === 0 ? 1.5 : 1,
                      padding: "12px 16px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      fontFamily: theme.bodyFont,
                      borderRight:
                        i < content.comparison!.headers.length - 1
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "none",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {content.comparison.rows.map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "flex",
                    backgroundColor: ri % 2 === 0 ? theme.cardBg : theme.secondary,
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    style={{
                      flex: 1.5,
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.text,
                      fontFamily: theme.bodyFont,
                      borderRight: `1px solid ${theme.border}`,
                    }}
                  >
                    {row.label}
                  </div>
                  {row.values.map((v, vi) => (
                    <div
                      key={vi}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        fontSize: 13,
                        color: theme.muted,
                        fontFamily: theme.bodyFont,
                        borderRight:
                          vi < row.values.length - 1
                            ? `1px solid ${theme.border}`
                            : "none",
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Verdict */}
      {content.verdict && (
        <div style={{ padding: "0 64px 32px" }}>
          <div
            style={{
              backgroundColor: isExpressive ? "#FFF3CD" : theme.secondary,
              border: `2px solid ${isExpressive ? "#F9E784" : theme.accent}`,
              borderRadius: isExpressive ? 16 : 10,
              padding: "20px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>
              💡
            </span>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: theme.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Verdict
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: theme.text,
                  lineHeight: 1.6,
                  fontFamily: theme.bodyFont,
                }}
              >
                {content.verdict}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: "16px 64px",
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isExpressive ? "#1A1A1A" : theme.secondary,
        }}
      >
        <div
          style={{
            fontSize: 13,
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
