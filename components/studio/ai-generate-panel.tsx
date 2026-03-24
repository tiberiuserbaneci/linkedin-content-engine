"use client";

import { useState, useRef, useCallback } from "react";

interface ReferenceImage {
  base64: string;
  mediaType: string;
  preview: string; // object URL for display
  name: string;
}

interface AIGeneratePanelProps {
  format: string;
  onGenerated: (content: Record<string, unknown>) => void;
}

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export function AIGeneratePanel({ format, onGenerated }: AIGeneratePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [referenceText, setReferenceText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remaining = MAX_IMAGES - images.length;
      const toProcess = Array.from(files).slice(0, remaining);

      toProcess.forEach((file) => {
        if (file.size > MAX_IMAGE_SIZE) {
          setError(`${file.name} is too large (max 4MB)`);
          return;
        }
        if (!file.type.startsWith("image/")) {
          setError(`${file.name} is not an image`);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];
          const mediaType = file.type;

          setImages((prev) => [
            ...prev,
            {
              base64,
              mediaType,
              preview: URL.createObjectURL(file),
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [images.length]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!referenceText.trim() && images.length === 0) {
      setError("Add some reference material — paste text or upload images");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          referenceText: referenceText.trim() || undefined,
          referenceImages:
            images.length > 0
              ? images.map((img) => ({
                  base64: img.base64,
                  mediaType: img.mediaType,
                }))
              : undefined,
          instructions: instructions.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      onGenerated(data.content);
      setExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }, [format, referenceText, images, instructions, onGenerated]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px dashed #DA4E24",
          backgroundColor: "rgba(218, 78, 36, 0.06)",
          color: "#DA4E24",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 16,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        Generate with AI
      </button>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #DA4E24",
        borderRadius: 10,
        backgroundColor: "rgba(218, 78, 36, 0.04)",
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#DA4E24",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          AI Generate
        </div>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: 18,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Reference Text */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "block",
            marginBottom: 5,
          }}
        >
          Reference Text
        </label>
        <textarea
          placeholder="Paste an article, LinkedIn post, notes, stats, or any text you want to turn into a visual..."
          value={referenceText}
          onChange={(e) => setReferenceText(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: 6,
            color: "#F1F1F1",
            fontSize: 13,
            padding: "10px 12px",
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* Reference Images */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "block",
            marginBottom: 5,
          }}
        >
          Reference Images ({images.length}/{MAX_IMAGES})
        </label>

        {/* Image previews */}
        {images.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: 72,
                  height: 72,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #2A2A2A",
                }}
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "none",
                    color: "#fff",
                    fontSize: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < MAX_IMAGES && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#1A1A1A",
                border: "1px dashed #333",
                borderRadius: 6,
                color: "#666",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              + Upload screenshot, infographic, or any image reference
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "block",
            marginBottom: 5,
          }}
        >
          Direction (optional)
        </label>
        <input
          placeholder='e.g. "Make it more contrarian" or "Focus on the AI section" or "Target startup founders"'
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: 6,
            color: "#F1F1F1",
            fontSize: 13,
            padding: "8px 12px",
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            fontSize: 12,
            color: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: 6,
          border: "none",
          backgroundColor: generating ? "#333" : "#DA4E24",
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 600,
          cursor: generating ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {generating ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "ai-spin 0.8s linear infinite",
              }}
            />
            Generating...
          </>
        ) : (
          "Generate Content"
        )}
      </button>

      {/* Spinner animation */}
      <style>{`
        @keyframes ai-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Help text */}
      <div
        style={{
          fontSize: 11,
          color: "#555",
          marginTop: 10,
          lineHeight: 1.5,
        }}
      >
        Paste an article, a competitor&apos;s post, meeting notes, or upload a
        screenshot of content you like. AI will restructure it into a
        publication-ready {format.replace("-", " ")}.
      </div>
    </div>
  );
}
