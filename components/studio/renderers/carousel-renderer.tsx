"use client";

import { CarouselContent } from "@/lib/studio-types";
import { Theme } from "@/lib/studio-themes";

interface Props {
  content: CarouselContent;
  theme: Theme;
  slideIndex: number;
}

export function CarouselRenderer({ content, theme, slideIndex }: Props) {
  const totalContentSlides = content.slides.length;
  // slideIndex 0 = title, 1..n = content slides, last = CTA
  const isTitleSlide = slideIndex === 0;
  const isCtaSlide = slideIndex === totalContentSlides + 1;
  const contentSlideData =
    !isTitleSlide && !isCtaSlide ? content.slides[slideIndex - 1] : null;

  const isDark = theme.key === "dark";
  const isHandwriting = theme.key === "handwriting";

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
      {/* Accent bar top */}
      <div style={{ width: "100%", height: 10, backgroundColor: theme.accent, flexShrink: 0 }} />

      {isTitleSlide ? (
        /* ── Title Slide ── */
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
          {/* Decorative large number */}
          <div
            style={{
              fontSize: 280,
              fontFamily: theme.headingFont,
              color: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.04)",
              lineHeight: 1,
              position: "absolute",
              right: 60,
              top: 60,
              userSelect: "none",
            }}
          >
            01
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: theme.accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 28,
              fontFamily: theme.bodyFont,
            }}
          >
            A Thread
          </div>
          <div
            style={{
              fontSize: isHandwriting ? 96 : 112,
              fontFamily: theme.headingFont,
              color: theme.text,
              lineHeight: 0.95,
              letterSpacing: "0.01em",
              maxWidth: 820,
            }}
          >
            {content.title}
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 4,
                backgroundColor: theme.accent,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                fontSize: 16,
                color: theme.muted,
                fontFamily: theme.bodyFont,
              }}
            >
              {totalContentSlides} key insights
            </div>
          </div>
        </div>
      ) : isCtaSlide ? (
        /* ── CTA Slide ── */
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
          <div
            style={{
              width: 80,
              height: 6,
              backgroundColor: theme.accent,
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: isHandwriting ? 80 : 96,
              fontFamily: theme.headingFont,
              color: theme.text,
              lineHeight: 1.0,
              letterSpacing: "0.01em",
            }}
          >
            {content.cta.headline}
          </div>
          <div
            style={{
              fontSize: 22,
              color: theme.muted,
              lineHeight: 1.5,
              fontFamily: theme.bodyFont,
              maxWidth: 640,
            }}
          >
            {content.cta.subtext}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: "16px 40px",
              backgroundColor: theme.accent,
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: theme.bodyFont,
              letterSpacing: "0.04em",
            }}
          >
            Follow for more →
          </div>
        </div>
      ) : contentSlideData ? (
        /* ── Content Slide ── */
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "60px 100px",
          }}
        >
          {/* Slide number */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
              fontFamily: theme.bodyFont,
            }}
          >
            {String(slideIndex).padStart(2, "0")} / {String(totalContentSlides).padStart(2, "0")}
          </div>

          {/* Slide title */}
          <div
            style={{
              fontSize: isHandwriting ? 68 : 80,
              fontFamily: theme.headingFont,
              color: theme.text,
              lineHeight: 1.0,
              marginBottom: 40,
              maxWidth: 780,
            }}
          >
            {contentSlideData.title}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 4,
              backgroundColor: theme.accent,
              borderRadius: 2,
              marginBottom: 36,
            }}
          />

          {/* Bullets */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {contentSlideData.bullets.filter(Boolean).map((bullet, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: theme.accent,
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: theme.bodyFont,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: 20,
                    color: theme.text,
                    lineHeight: 1.5,
                    fontFamily: theme.bodyFont,
                    paddingTop: 4,
                  }}
                >
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Accent bar bottom */}
      <div
        style={{
          width: "100%",
          height: 6,
          backgroundColor: theme.secondary,
          flexShrink: 0,
          borderTop: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 100px",
        }}
      />
    </div>
  );
}
