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

  const bgStyle = isDark
    ? {
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #1A0A05 50%, #0A0A0A 100%)",
      }
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
      {/* Accent bar left */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          backgroundColor: theme.accent,
        }}
      />

      {/* Accent bar top */}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 0,
          right: 0,
          height: 6,
          backgroundColor: theme.accent,
        }}
      />

      {/* Decorative background */}
      {isExpressive ? (
        <div
          style={{
            position: "absolute",
            right: 60,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.06,
          }}
        >
          <Icon icon={iconName} width={320} height={320} style={{ color: theme.text }} />
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -40,
            fontSize: 320,
            fontFamily: theme.headingFont,
            color: isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.03)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          LI
        </div>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 90px 60px 100px",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.accent,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: theme.bodyFont,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isExpressive && (
            <Icon icon={iconName} width={18} height={18} style={{ color: theme.accent }} />
          )}
          {content.eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: isExpressive ? 88 : 100,
            fontFamily: theme.headingFont,
            color: theme.text,
            lineHeight: 0.95,
            letterSpacing: "0.01em",
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          {content.title}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 72,
            height: 4,
            backgroundColor: theme.accent,
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: theme.muted,
            lineHeight: 1.5,
            fontFamily: theme.bodyFont,
            maxWidth: 720,
          }}
        >
          {content.subtitle}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          height: 48,
          backgroundColor: isExpressive ? "#1A1A1A" : theme.secondary,
          borderTop: `2px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 90px 0 100px",
          justifyContent: "space-between",
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
              padding: "4px 14px",
              backgroundColor: theme.accent,
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: theme.bodyFont,
            }}
          >
            Follow for more
          </div>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 28, height: 5, backgroundColor: theme.accent, borderRadius: 3 }} />
            <div style={{ width: 14, height: 5, backgroundColor: theme.muted, borderRadius: 3, opacity: 0.4 }} />
            <div style={{ width: 14, height: 5, backgroundColor: theme.muted, borderRadius: 3, opacity: 0.4 }} />
          </div>
        )}
      </div>
    </div>
  );
}
