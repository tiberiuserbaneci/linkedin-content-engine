"use client";

import { CheatsheetContent } from "@/lib/studio-types";
import { Theme, HANDWRITING_SECTION_COLORS } from "@/lib/studio-themes";

interface Props {
  content: CheatsheetContent;
  theme: Theme;
}

export function CheatsheetRenderer({ content, theme }: Props) {
  const isHandwriting = theme.key === "handwriting";
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
            fontSize: isHandwriting ? 64 : 76,
            fontFamily: theme.headingFont,
            color: theme.text,
            lineHeight: 1.0,
            letterSpacing: isHandwriting ? "0.01em" : "0.02em",
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
          const hwColor =
            HANDWRITING_SECTION_COLORS[i % HANDWRITING_SECTION_COLORS.length];
          const colWidth =
            useGrid
              ? numSections === 4
                ? "calc(50% - 10px)"
                : "100%"
              : "100%";
          return (
            <div
              key={i}
              style={{
                width: colWidth,
                backgroundColor: isHandwriting ? hwColor.bg : theme.cardBg,
                border: `2px solid ${isHandwriting ? hwColor.border : theme.border}`,
                borderRadius: isHandwriting ? 16 : 8,
                padding: "24px 28px",
                boxSizing: "border-box",
                boxShadow: isHandwriting
                  ? "3px 3px 0px rgba(0,0,0,0.07)"
                  : "none",
              }}
            >
              <div
                style={{
                  fontSize: isHandwriting ? 22 : 17,
                  fontFamily: isHandwriting ? theme.headingFont : theme.bodyFont,
                  fontWeight: isHandwriting ? 400 : 700,
                  color: isHandwriting ? hwColor.text : theme.text,
                  marginBottom: 14,
                  borderBottom: `2px solid ${
                    isHandwriting ? hwColor.border : theme.accent
                  }`,
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
                  {isHandwriting ? (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: `2px solid ${hwColor.badge}`,
                        borderRadius: 4,
                        flexShrink: 0,
                        marginTop: 3,
                        backgroundColor: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
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
                        marginTop: 7,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      color: isHandwriting ? hwColor.text : theme.text,
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
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Header row */}
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
              {/* Data rows */}
              {content.comparison.rows.map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "flex",
                    backgroundColor:
                      ri % 2 === 0 ? theme.cardBg : theme.secondary,
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
              backgroundColor: isHandwriting
                ? HANDWRITING_SECTION_COLORS[0].bg
                : theme.secondary,
              border: `2px solid ${
                isHandwriting ? HANDWRITING_SECTION_COLORS[0].border : theme.accent
              }`,
              borderRadius: 10,
              padding: "20px 24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span
              style={{
                fontSize: 22,
                flexShrink: 0,
                lineHeight: 1,
                marginTop: 2,
              }}
            >
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
          backgroundColor: isHandwriting
            ? HANDWRITING_SECTION_COLORS[0].bg
            : theme.secondary,
        }}
      >
        <div
          style={{
            fontSize: 13,
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
