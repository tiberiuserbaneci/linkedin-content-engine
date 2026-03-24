"use client";

import { CarouselContent } from "@/lib/studio-types";
import { Theme } from "@/lib/studio-themes";
import { getCardColor } from "@/lib/layout-engine";
import { getIconForKeyword } from "@/lib/icons";
import { Icon } from "@iconify/react";

interface Props {
  content: CarouselContent;
  theme: Theme;
  slideIndex: number;
}

export function CarouselRenderer({ content, theme, slideIndex }: Props) {
  const totalContentSlides = content.slides.length;
  const isTitleSlide = slideIndex === 0;
  const isCtaSlide = slideIndex === totalContentSlides + 1;
  const contentSlideData =
    !isTitleSlide && !isCtaSlide ? content.slides[slideIndex - 1] : null;

  const isDark = theme.key === "dark";
  const isExpressive = theme.key === "expressive";

  if (isExpressive) {
    return (
      <ExpressiveCarousel
        content={content}
        theme={theme}
        slideIndex={slideIndex}
        isTitleSlide={isTitleSlide}
        isCtaSlide={isCtaSlide}
        contentSlideData={contentSlideData}
        totalContentSlides={totalContentSlides}
      />
    );
  }

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: theme.bg,
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: 10, backgroundColor: theme.accent, flexShrink: 0 }} />

      {isTitleSlide ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "80px 100px",
          }}
        >
          <div
            style={{
              fontSize: 280,
              fontFamily: theme.headingFont,
              color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              lineHeight: 1,
              position: "absolute",
              right: 60,
              top: 60,
              userSelect: "none",
            }}
          >
            01
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: theme.accent, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>
            A Thread
          </div>
          <div style={{ fontSize: 112, fontFamily: theme.headingFont, color: theme.text, lineHeight: 0.95, letterSpacing: "0.01em", maxWidth: 820 }}>
            {content.title}
          </div>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 4, backgroundColor: theme.accent, borderRadius: 2 }} />
            <div style={{ fontSize: 16, color: theme.muted }}>{totalContentSlides} key insights</div>
          </div>
        </div>
      ) : isCtaSlide ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "80px 120px",
            gap: 24,
          }}
        >
          <div style={{ width: 80, height: 6, backgroundColor: theme.accent, borderRadius: 3 }} />
          <div style={{ fontSize: 96, fontFamily: theme.headingFont, color: theme.text, lineHeight: 1.0 }}>
            {content.cta.headline}
          </div>
          <div style={{ fontSize: 22, color: theme.muted, lineHeight: 1.5, maxWidth: 640 }}>
            {content.cta.subtext}
          </div>
          <div style={{ marginTop: 20, padding: "16px 40px", backgroundColor: theme.accent, borderRadius: 8, fontSize: 20, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em" }}>
            Follow for more →
          </div>
        </div>
      ) : contentSlideData ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "60px 100px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            {String(slideIndex).padStart(2, "0")} / {String(totalContentSlides).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 80, fontFamily: theme.headingFont, color: theme.text, lineHeight: 1.0, marginBottom: 40, maxWidth: 780 }}>
            {contentSlideData.title}
          </div>
          <div style={{ width: 60, height: 4, backgroundColor: theme.accent, borderRadius: 2, marginBottom: 36 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {contentSlideData.bullets.filter(Boolean).map((bullet, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: theme.accent, color: "#FFFFFF", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 20, color: theme.text, lineHeight: 1.5, paddingTop: 4 }}>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ width: "100%", height: 6, backgroundColor: theme.secondary, flexShrink: 0, borderTop: `1px solid ${theme.border}` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPRESSIVE Carousel — gradient title, colored bullet cards, icon-heavy
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpressiveCarousel({
  content,
  theme,
  slideIndex,
  isTitleSlide,
  isCtaSlide,
  contentSlideData,
  totalContentSlides,
}: {
  content: CarouselContent;
  theme: Theme;
  slideIndex: number;
  isTitleSlide: boolean;
  isCtaSlide: boolean;
  contentSlideData: CarouselContent["slides"][0] | null;
  totalContentSlides: number;
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#FFFFFF",
        fontFamily: theme.bodyFont,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isTitleSlide ? (
        /* ── Expressive Title Slide ── */
        <>
          <div
            style={{
              flex: 1,
              background: "linear-gradient(145deg, #1A1A1A 0%, #2D1810 50%, #1A1A1A 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 90px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "absolute", right: -60, top: -60, width: 300, height: 300, borderRadius: "50%", border: "2px solid rgba(218,78,36,0.15)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: -20, top: -20, width: 200, height: 200, borderRadius: "50%", border: "2px solid rgba(218,78,36,0.08)", pointerEvents: "none" }} />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(218,78,36,0.15)",
                border: "1px solid rgba(218,78,36,0.3)",
                borderRadius: 24,
                padding: "8px 20px",
                marginBottom: 32,
                alignSelf: "flex-start",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#DA4E24" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#DA4E24", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {totalContentSlides} slides
              </span>
            </div>

            <div style={{ fontSize: 100, fontFamily: theme.headingFont, color: "#FFFFFF", lineHeight: 0.95, maxWidth: 840, marginBottom: 28 }}>
              {content.title}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {Array.from({ length: totalContentSlides + 2 }).map((_, i) => (
                <div key={i} style={{ width: i === 0 ? 40 : 16, height: 5, borderRadius: 3, backgroundColor: i === 0 ? "#DA4E24" : "rgba(255,255,255,0.15)" }} />
              ))}
            </div>
          </div>
        </>
      ) : isCtaSlide ? (
        /* ── Expressive CTA Slide ── */
        <div
          style={{
            flex: 1,
            background: "linear-gradient(145deg, #1A1A1A 0%, #2D1810 50%, #1A1A1A 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "80px 100px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: -80, bottom: -80, width: 300, height: 300, borderRadius: "50%", border: "2px solid rgba(218,78,36,0.1)", pointerEvents: "none" }} />

          <div style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid #DA4E24", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            <Icon icon="tabler:arrow-right" width={28} height={28} style={{ color: "#DA4E24" }} />
          </div>

          <div style={{ fontSize: 88, fontFamily: theme.headingFont, color: "#FFFFFF", lineHeight: 1.0, marginBottom: 20 }}>
            {content.cta.headline}
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: 600, marginBottom: 36 }}>
            {content.cta.subtext}
          </div>
          <div style={{ padding: "18px 48px", backgroundColor: "#DA4E24", borderRadius: 14, fontSize: 20, fontWeight: 700, color: "#FFFFFF" }}>
            Follow for more →
          </div>
        </div>
      ) : contentSlideData ? (
        /* ── Expressive Content Slide ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Slide header bar */}
          <div
            style={{
              padding: "24px 80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #F0F0F0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#DA4E24", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 14, fontWeight: 700 }}>
                {String(slideIndex).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 13, color: "#999", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                of {String(totalContentSlides).padStart(2, "0")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: totalContentSlides }).map((_, i) => (
                <div key={i} style={{ width: i === slideIndex - 1 ? 24 : 8, height: 4, borderRadius: 2, backgroundColor: i === slideIndex - 1 ? "#DA4E24" : "#E5E5E5", transition: "width 0.3s" }} />
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ padding: "40px 80px 24px" }}>
            <div style={{ fontSize: 72, fontFamily: theme.headingFont, color: theme.text, lineHeight: 1.0, maxWidth: 780 }}>
              {contentSlideData.title}
            </div>
          </div>

          {/* Bullet cards */}
          <div style={{ flex: 1, padding: "0 80px 40px", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
            {contentSlideData.bullets.filter(Boolean).map((bullet, i) => {
              const color = getCardColor(i);
              const iconName = getIconForKeyword(bullet);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    backgroundColor: color.bg,
                    borderRadius: 16,
                    padding: "18px 24px",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon icon={iconName} width={22} height={22} style={{ color: color.title }} />
                  </div>
                  <span style={{ fontSize: 19, color: color.title, lineHeight: 1.4, fontWeight: 500 }}>{bullet}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom */}
          <div style={{ padding: "14px 80px", borderTop: "2px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#999" }}>Swipe →</span>
            <span style={{ fontSize: 12, color: "#DA4E24", fontWeight: 600 }}>Save this slide</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
