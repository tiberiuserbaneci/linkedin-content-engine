"use client";

import { PostCoverContent } from "@/lib/studio-types";
import { Theme } from "@/lib/studio-themes";
import { getIconForKeyword } from "@/lib/icons";
import { Icon } from "@iconify/react";

interface Props {
  content: PostCoverContent;
  theme: Theme;
}

export function PostCoverRenderer({ content, theme }: Props) {
  const isDark = theme.key === "dark";
  const isExpressive = theme.key === "expressive";
  const iconName = getIconForKeyword(content.eyebrow || content.title);

  if (isExpressive) {
    return <ExpressivePostCover content={content} theme={theme} iconName={iconName} />;
  }

  const bgStyle = isDark
    ? { background: "linear-gradient(135deg, #0A0A0A 0%, #1A0A05 50%, #0A0A0A 100%)" }
    : { backgroundColor: theme.bg };

  return (
    <div
      style={{
        width: 1200,
        height: 627,
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        ...bgStyle,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, backgroundColor: theme.accent }} />
      <div style={{ position: "absolute", left: 10, top: 0, right: 0, height: 6, backgroundColor: theme.accent }} />
      <div
        style={{
          position: "absolute",
          right: -20,
          bottom: -40,
          fontSize: 320,
          fontFamily: theme.headingFont,
          color: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        LI
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 90px 60px 100px",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
          {content.eyebrow}
        </div>
        <div style={{ fontSize: 100, fontFamily: theme.headingFont, color: theme.text, lineHeight: 0.95, maxWidth: 900, marginBottom: 24 }}>
          {content.title}
        </div>
        <div style={{ width: 72, height: 4, backgroundColor: theme.accent, borderRadius: 2, marginBottom: 20 }} />
        <div style={{ fontSize: 22, color: theme.muted, lineHeight: 1.5, maxWidth: 720 }}>
          {content.subtitle}
        </div>
      </div>
      <div
        style={{
          height: 48,
          backgroundColor: theme.secondary,
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 90px 0 100px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 13, color: theme.muted }}>LinkedIn Content Engine</div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 28, height: 5, backgroundColor: theme.accent, borderRadius: 3 }} />
          <div style={{ width: 14, height: 5, backgroundColor: theme.muted, borderRadius: 3, opacity: 0.4 }} />
          <div style={{ width: 14, height: 5, backgroundColor: theme.muted, borderRadius: 3, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPRESSIVE Post Cover — split design with gradient + icon
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpressivePostCover({
  content,
  theme,
  iconName,
}: Props & { iconName: string }) {
  return (
    <div
      style={{
        width: 1200,
        height: 627,
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Left side — content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 60px 48px 72px",
          position: "relative",
        }}
      >
        {/* Eyebrow pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(218,78,36,0.08)",
            border: "1px solid rgba(218,78,36,0.2)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
            alignSelf: "flex-start",
          }}
        >
          <Icon icon={iconName} width={14} height={14} style={{ color: "#DA4E24" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {content.eyebrow}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontFamily: theme.headingFont,
            color: "#111",
            lineHeight: 0.95,
            maxWidth: 560,
            marginBottom: 20,
          }}
        >
          {content.title}
        </div>

        {/* Divider */}
        <div style={{ width: 56, height: 4, backgroundColor: "#DA4E24", borderRadius: 2, marginBottom: 16 }} />

        {/* Subtitle */}
        <div style={{ fontSize: 18, color: "#666", lineHeight: 1.5, maxWidth: 480 }}>
          {content.subtitle}
        </div>
      </div>

      {/* Right side — gradient with icon */}
      <div
        style={{
          width: 360,
          background: "linear-gradient(160deg, #1A1A1A 0%, #2D1810 60%, #1A1A1A 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", border: "2px solid rgba(218,78,36,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -60, bottom: -60, width: 250, height: 250, borderRadius: "50%", border: "2px solid rgba(218,78,36,0.06)", pointerEvents: "none" }} />

        {/* Icon container */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "rgba(218,78,36,0.15)",
            border: "2px solid rgba(218,78,36,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Icon icon={iconName} width={56} height={56} style={{ color: "#DA4E24" }} />
        </div>

        {/* CTA */}
        <div
          style={{
            padding: "10px 28px",
            backgroundColor: "#DA4E24",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "0.04em",
          }}
        >
          Read the post →
        </div>
      </div>

      {/* Bottom bar spanning full width */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 44,
          backgroundColor: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px",
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>LinkedIn Content Engine</div>
        <div style={{ padding: "4px 14px", backgroundColor: "#DA4E24", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#FFF" }}>
          Follow for more
        </div>
      </div>
    </div>
  );
}
