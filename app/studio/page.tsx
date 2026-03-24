"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentAsset } from "@/lib/database.types";

const FORMAT_CARDS = [
  {
    format: "infographic",
    title: "Infographic",
    description: "Multi-section visual with stats",
    dimensions: "1080×1350px",
    exportType: "PNG",
    icon: "📊",
  },
  {
    format: "cheatsheet",
    title: "Cheatsheet",
    description: "Quick reference guide",
    dimensions: "900px wide",
    exportType: "PNG",
    icon: "📋",
  },
  {
    format: "carousel",
    title: "Carousel",
    description: "Multi-slide storytelling",
    dimensions: "1080×1080px/slide",
    exportType: "PDF",
    icon: "🎠",
  },
  {
    format: "post-cover",
    title: "Post Cover",
    description: "LinkedIn banner/cover image",
    dimensions: "1200×627px",
    exportType: "PNG",
    icon: "🖼️",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudioPage() {
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAssets(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#F1F1F1",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#F1F1F1",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Content Studio
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#666",
              marginTop: 8,
              margin: "8px 0 0",
            }}
          >
            Create professional LinkedIn visuals — infographics, cheatsheets,
            carousels, and post covers.
          </p>
        </div>

        {/* Format cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 56,
          }}
        >
          {FORMAT_CARDS.map((card) => (
            <div
              key={card.format}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #1E1E1E",
                borderRadius: 12,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 32 }}>{card.icon}</div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#F1F1F1",
                    margin: "0 0 4px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#666",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#888",
                    backgroundColor: "#1E1E1E",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {card.dimensions}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#DA4E24",
                    backgroundColor: "rgba(218,78,36,0.1)",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 600,
                  }}
                >
                  {card.exportType}
                </span>
              </div>
              <Link
                href={`/studio/create/${card.format}`}
                style={{
                  display: "inline-block",
                  marginTop: "auto",
                  backgroundColor: "#DA4E24",
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Create →
              </Link>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#F1F1F1",
              marginBottom: 16,
            }}
          >
            Saved Assets
          </h2>

          {loading ? (
            <p style={{ color: "#444", fontSize: 14 }}>Loading…</p>
          ) : assets.length === 0 ? (
            <div
              style={{
                border: "1px dashed #1E1E1E",
                borderRadius: 12,
                padding: "48px 24px",
                textAlign: "center",
                color: "#444",
                fontSize: 14,
              }}
            >
              No saved assets yet. Create one above!
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid #1E1E1E",
                    borderRadius: 10,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#DA4E24",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 4,
                        }}
                      >
                        {asset.format}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#F1F1F1",
                          lineHeight: 1.4,
                        }}
                      >
                        {asset.title}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#666",
                        backgroundColor: "#1E1E1E",
                        borderRadius: 4,
                        padding: "2px 6px",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        marginLeft: 8,
                      }}
                    >
                      {asset.theme}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#444" }}>
                    {formatDate(asset.created_at)}
                  </div>
                  <Link
                    href={`/studio/create/${asset.format}`}
                    style={{
                      display: "inline-block",
                      fontSize: 12,
                      color: "#888",
                      textDecoration: "none",
                      border: "1px solid #2A2A2A",
                      borderRadius: 6,
                      padding: "6px 12px",
                      textAlign: "center",
                    }}
                  >
                    Open format →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
