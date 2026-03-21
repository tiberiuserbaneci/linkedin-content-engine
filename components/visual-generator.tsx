"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Format = "portrait" | "square";

const FORMAT_DIMS: Record<Format, { w: number; h: number; label: string }> = {
  portrait: { w: 1080, h: 1350, label: "Portrait 1080x1350" },
  square: { w: 1080, h: 1080, label: "Square 1080x1080" },
};

interface VisualGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  postContent: string;
}

export function VisualGenerator({ isOpen, onClose, postContent }: VisualGeneratorProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [format, setFormat] = useState<Format>("portrait");
  const renderRef = useRef<HTMLDivElement>(null);
  const hasGenerated = useRef(false);

  // Auto-generate on open
  useEffect(() => {
    if (isOpen && postContent && !hasGenerated.current) {
      hasGenerated.current = true;
      generate("portrait");
    }
    if (!isOpen) {
      hasGenerated.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function generate(fmt: Format) {
    setLoading(true);
    setError("");
    setHtml("");
    try {
      const res = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_content: postContent, format: fmt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate visual");
      setHtml(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate visual");
    } finally {
      setLoading(false);
    }
  }

  function handleFormatChange(fmt: Format) {
    setFormat(fmt);
    generate(fmt);
  }

  const handleDownloadPNG = useCallback(async () => {
    if (!renderRef.current || downloading || !html) return;
    setDownloading(true);

    try {
      // Load html2canvas from CDN if not already loaded
      if (!(window as unknown as Record<string, unknown>).html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load html2canvas"));
          document.head.appendChild(script);
        });
      }

      const html2canvas = (window as unknown as { html2canvas: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement> }).html2canvas;

      const dims = FORMAT_DIMS[format];

      // Create an off-screen container with exact pixel dimensions
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = `${dims.w}px`;
      tempDiv.style.height = `${dims.h}px`;
      tempDiv.style.overflow = "hidden";
      tempDiv.style.background = "#FFFFFF";
      tempDiv.innerHTML = html;

      document.body.appendChild(tempDiv);

      // Wait for font loading
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#FFFFFF",
        scale: 2,
        useCORS: true,
        width: dims.w,
        height: dims.h,
        windowWidth: dims.w,
        windowHeight: dims.h,
      });

      document.body.removeChild(tempDiv);

      const today = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.download = `ultron-cheatsheet-${today}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PNG");
    } finally {
      setDownloading(false);
    }
  }, [downloading, html, format]);

  function handleCopyHTML() {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setHtml("");
    setError("");
    onClose();
  }

  if (!isOpen) return null;

  const dims = FORMAT_DIMS[format];
  // Scale iframe to fit modal width (~800px max content area)
  const scale = Math.min(1, 720 / dims.w);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#F1F1F1]">Visual Cheatsheet</h2>
            {/* Format toggle */}
            <div className="flex rounded-lg overflow-hidden border border-[#333]">
              {(Object.keys(FORMAT_DIMS) as Format[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleFormatChange(fmt)}
                  disabled={loading}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    format === fmt
                      ? "bg-[#DA4E24] text-white"
                      : "bg-[#1E1E1E] text-[#999] hover:text-[#F1F1F1]"
                  } disabled:opacity-50`}
                >
                  {FORMAT_DIMS[fmt].label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#666] hover:text-[#F1F1F1] text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#999]">Generating visual cheatsheet...</span>
              <span className="text-xs text-[#666]">This may take 10-15 seconds</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3 w-full">
              {error}
              <button
                onClick={() => generate(format)}
                className="ml-3 text-red-300 underline hover:text-red-200"
              >
                Retry
              </button>
            </div>
          )}

          {html && !loading && (
            <div ref={renderRef} className="flex justify-center">
              <div
                style={{
                  width: dims.w * scale,
                  height: dims.h * scale,
                  overflow: "hidden",
                  borderRadius: "8px",
                  border: "1px solid #333",
                }}
              >
                <iframe
                  srcDoc={html}
                  sandbox="allow-same-origin"
                  style={{
                    width: dims.w,
                    height: dims.h,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    border: "none",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {html && !loading && (
          <div className="flex items-center gap-3 p-5 border-t border-[#1E1E1E]">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex-1 px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors disabled:opacity-50"
            >
              {downloading ? "Rendering PNG..." : `Download as PNG (${dims.w}x${dims.h})`}
            </button>
            <button
              onClick={handleCopyHTML}
              className="flex-1 px-4 py-2.5 bg-[#1E1E1E] text-[#F1F1F1] border border-[#333] rounded-lg font-medium text-sm hover:bg-[#252525] transition-colors"
            >
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              onClick={() => generate(format)}
              disabled={loading}
              className="px-4 py-2.5 bg-[#1E1E1E] text-[#999] border border-[#333] rounded-lg font-medium text-sm hover:bg-[#252525] hover:text-[#F1F1F1] transition-colors disabled:opacity-50"
              title="Regenerate with different layout"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
