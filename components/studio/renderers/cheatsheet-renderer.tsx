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

  if (isExpressive) {
    return <ExpressiveCheatsheet content={content} theme={theme} />;
  }

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
      <div style={{ width: "100%", height: 8, backgroundColor: theme.accent }} />

      {/* Header */}
      <div style={{ padding: "48px 64px 32px", borderBottom: `2px solid ${theme.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
          {content.eyebrow}
        </div>
        <div style={{ fontSize: 76, fontFamily: theme.headingFont, color: theme.text, lineHeight: 1.0, letterSpacing: "0.02em", marginBottom: 12 }}>
          {content.title}
        </div>
        <div style={{ fontSize: 18, color: theme.muted, lineHeight: 1.5, maxWidth: 600 }}>
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
          const colWidth = useGrid ? (numSections === 4 ? "calc(50% - 10px)" : "100%") : "100%";
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
              <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 14, borderBottom: `2px solid ${theme.accent}`, paddingBottom: 10 }}>
                {section.title}
              </div>
              {section.items.filter(Boolean).map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: theme.accent, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {content.comparison && content.comparison.headers.length > 0 && (
        <div style={{ padding: "0 64px 32px" }}>
          <div style={{ border: `2px solid ${theme.border}`, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ display: "flex", backgroundColor: theme.accent }}>
              {content.comparison.headers.map((h, i) => (
                <div key={i} style={{ flex: i === 0 ? 1.5 : 1, padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#FFFFFF", borderRight: i < content.comparison!.headers.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
                  {h}
                </div>
              ))}
            </div>
            {content.comparison.rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", backgroundColor: ri % 2 === 0 ? theme.cardBg : theme.secondary, borderTop: `1px solid ${theme.border}` }}>
                <div style={{ flex: 1.5, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: theme.text, borderRight: `1px solid ${theme.border}` }}>
                  {row.label}
                </div>
                {row.values.map((v, vi) => (
                  <div key={vi} style={{ flex: 1, padding: "10px 16px", fontSize: 13, color: theme.muted, borderRight: vi < row.values.length - 1 ? `1px solid ${theme.border}` : "none" }}>
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
          <div style={{ backgroundColor: theme.secondary, border: `2px solid ${theme.accent}`, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>💡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Verdict</div>
              <div style={{ fontSize: 15, color: theme.text, lineHeight: 1.6 }}>{content.verdict}</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: "16px 64px", borderTop: `2px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: theme.secondary }}>
        <div style={{ fontSize: 13, color: theme.muted }}>LinkedIn Content Engine</div>
        <div style={{ width: 32, height: 6, backgroundColor: theme.accent, borderRadius: 3 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPRESSIVE Cheatsheet — multi-style sections, gradient header, icons
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpressiveCheatsheet({ content, theme }: Props) {
  const numSections = content.sections.length;
  const useGrid = numSections >= 3;

  return (
    <div
      style={{
        width: 900,
        backgroundColor: "#FFFFFF",
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── Gradient Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D1810 60%, #1A1A1A 100%)",
          padding: "44px 64px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: 30, top: -10, fontSize: 180, fontFamily: theme.headingFont, color: "rgba(218,78,36,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
          {numSections}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(218,78,36,0.15)",
            border: "1px solid rgba(218,78,36,0.3)",
            borderRadius: 16,
            padding: "5px 14px",
            marginBottom: 18,
          }}
        >
          <Icon icon="tabler:bookmark" width={12} height={12} style={{ color: "#DA4E24" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {content.eyebrow}
          </span>
        </div>

        <div style={{ fontSize: 60, fontFamily: theme.headingFont, color: "#FFFFFF", lineHeight: 1.0, marginBottom: 10, maxWidth: 650 }}>
          {content.title}
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: 500 }}>
          {content.subtitle}
        </div>
      </div>

      {/* ── Section Cards ── */}
      <div
        style={{
          padding: "28px 64px",
          display: "flex",
          flexDirection: useGrid ? "row" : "column",
          flexWrap: useGrid ? "wrap" : "nowrap",
          gap: 18,
        }}
      >
        {content.sections.map((section, i) => {
          const style = getCardStyle(i);
          const color = getCardColor(i);
          const iconName = getIconForKeyword(section.title);
          const num = String(i + 1).padStart(2, "0");
          const colWidth = useGrid ? (numSections === 4 ? "calc(50% - 9px)" : "100%") : "100%";

          if (style === "B" || style === "C") {
            // Dark card or numbered background
            return (
              <div
                key={i}
                style={{
                  width: colWidth,
                  backgroundColor: style === "B" ? "#1A1A1A" : "#F7F7F7",
                  borderRadius: 18,
                  padding: "22px 24px 18px",
                  boxSizing: "border-box",
                  boxShadow: style === "B" ? "0 6px 24px rgba(0,0,0,0.25)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {style === "C" && (
                  <div style={{ position: "absolute", right: 8, top: -12, fontSize: 120, fontFamily: theme.headingFont, color: "rgba(218,78,36,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                    {num}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, position: "relative" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: style === "B" ? "rgba(218,78,36,0.15)" : "#DA4E24", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon icon={iconName} width={20} height={20} style={{ color: style === "B" ? "#DA4E24" : "#FFF" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em" }}>{num}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: style === "B" ? "#FFF" : theme.text, lineHeight: 1.2 }}>{section.title}</div>
                  </div>
                </div>
                {section.items.filter(Boolean).map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, position: "relative" }}>
                    <Icon icon={iconName} width={13} height={13} style={{ flexShrink: 0, marginTop: 3, color: "#DA4E24" }} />
                    <span style={{ fontSize: 13, color: style === "B" ? "rgba(255,255,255,0.85)" : theme.text, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            );
          }

          if (style === "D") {
            // Table rows
            return (
              <div key={i} style={{ width: colWidth, backgroundColor: "#FFFFFF", border: "2px solid #E5E5E5", borderRadius: 18, overflow: "hidden", boxSizing: "border-box" }}>
                <div style={{ padding: "14px 20px", backgroundColor: color.bg, display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon icon={iconName} width={18} height={18} style={{ color: color.title }} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: color.title }}>{section.title}</div>
                </div>
                {section.items.filter(Boolean).map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", padding: "9px 20px", backgroundColor: j % 2 === 0 ? "#FFF" : "#F9F9F9", borderTop: "1px solid #F0F0F0", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, backgroundColor: color.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: color.title, flexShrink: 0 }}>{j + 1}</div>
                    <span style={{ fontSize: 13, color: theme.text, lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            );
          }

          // A, E, F — colored card variants
          return (
            <div
              key={i}
              style={{
                width: colWidth,
                backgroundColor: color.bg,
                borderRadius: 18,
                padding: "22px 24px 18px",
                boxSizing: "border-box",
                boxShadow: `0 4px 16px ${color.shadow}`,
                borderLeft: style === "F" ? "5px solid #DA4E24" : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {style === "F" && (
                <div style={{ fontSize: 32, fontFamily: theme.headingFont, color: "#DA4E24", lineHeight: 1, marginBottom: 4, opacity: 0.4 }}>&ldquo;</div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                {style === "E" ? (
                  <div style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid #DA4E24", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(218,78,36,0.06)" }}>
                    <Icon icon={iconName} width={20} height={20} style={{ color: "#DA4E24" }} />
                  </div>
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon icon={iconName} width={20} height={20} style={{ color: color.title }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: style === "E" ? "#DA4E24" : color.title, opacity: 0.6, letterSpacing: "0.1em" }}>{num}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: color.title, lineHeight: 1.2 }}>{section.title}</div>
                </div>
              </div>
              {section.items.filter(Boolean).map((item, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <Icon icon={style === "E" ? "tabler:circle-check" : iconName} width={13} height={13} style={{ flexShrink: 0, marginTop: 3, color: style === "E" ? "#DA4E24" : color.title }} />
                  <span style={{ fontSize: 13, color: color.title, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {content.comparison && content.comparison.headers.length > 0 && (
        <div style={{ padding: "0 64px 28px" }}>
          <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", background: "linear-gradient(135deg, #1A1A1A 0%, #2D1810 100%)" }}>
              {content.comparison.headers.map((h, i) => (
                <div key={i} style={{ flex: i === 0 ? 1.5 : 1, padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#FFFFFF", borderRight: i < content.comparison!.headers.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  {h}
                </div>
              ))}
            </div>
            {content.comparison.rows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", backgroundColor: ri % 2 === 0 ? "#FFFFFF" : "#F9F9F9", borderTop: "1px solid #F0F0F0" }}>
                <div style={{ flex: 1.5, padding: "11px 18px", fontSize: 13, fontWeight: 600, color: theme.text, borderRight: "1px solid #F0F0F0" }}>{row.label}</div>
                {row.values.map((v, vi) => (
                  <div key={vi} style={{ flex: 1, padding: "11px 18px", fontSize: 13, color: theme.muted, borderRight: vi < row.values.length - 1 ? "1px solid #F0F0F0" : "none" }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict */}
      {content.verdict && (
        <div style={{ padding: "0 64px 28px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #FFF3CD 0%, #FFFFFF 100%)",
              border: "2px solid #F9E784",
              borderRadius: 18,
              padding: "18px 22px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#DA4E24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon icon="tabler:bulb" width={20} height={20} style={{ color: "#FFF" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#DA4E24", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Verdict</div>
              <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.6 }}>{content.verdict}</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: "14px 64px",
          backgroundColor: "#1A1A1A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>LinkedIn Content Engine</div>
        <div style={{ padding: "5px 16px", backgroundColor: "#DA4E24", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#FFF" }}>
          Save this for later →
        </div>
      </div>
    </div>
  );
}
