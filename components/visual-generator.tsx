"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
  const renderRef = useRef<HTMLDivElement>(null);

  // Auto-generate on open
  useEffect(() => {
    if (isOpen && postContent && !html && !loading) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setHtml("");
    try {
      const res = await fetch("/api/generate-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_content: postContent }),
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

  const handleDownloadPNG = useCallback(async () => {
    if (!renderRef.current || downloading) return;
    setDownloading(true);

    try {
      // Load html2canvas from CDN
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2canvas"));
        document.head.appendChild(script);
      });

      const html2canvas = (window as unknown as { html2canvas: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement> }).html2canvas;

      // Get the iframe and its content
      const iframe = renderRef.current.querySelector("iframe") as HTMLIFrameElement;
      if (!iframe?.contentDocument?.body) throw new Error("Visual not ready");

      // Clone the iframe body content into a temporary div for capture
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "1080px";
      tempDiv.innerHTML = iframe.contentDocument.body.innerHTML;

      // Copy styles from iframe
      const iframeStyles = iframe.contentDocument.querySelectorAll("style, link[rel='stylesheet']");
      iframeStyles.forEach((style) => {
        tempDiv.insertBefore(style.cloneNode(true), tempDiv.firstChild);
      });

      document.body.appendChild(tempDiv);

      // Wait for fonts to load
      await new Promise((r) => setTimeout(r, 500));

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: "#0A0A0A",
        scale: 2,
        useCORS: true,
        width: 1080,
        windowWidth: 1080,
      });

      document.body.removeChild(tempDiv);

      const link = document.createElement("a");
      link.download = "linkedin-visual.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PNG");
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E1E1E]">
          <h2 className="text-lg font-semibold text-[#F1F1F1]">Visual Cheatsheet</h2>
          <button
            onClick={handleClose}
            className="text-[#666] hover:text-[#F1F1F1] text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="w-8 h-8 border-2 border-[#DA4E24] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#999]">Generating visual cheatsheet...</span>
              <span className="text-xs text-[#666]">This may take 10-15 seconds</span>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3 mb-4">
              {error}
              <button
                onClick={handleGenerate}
                className="ml-3 text-red-300 underline hover:text-red-200"
              >
                Retry
              </button>
            </div>
          )}

          {html && (
            <div ref={renderRef}>
              <iframe
                srcDoc={html}
                sandbox="allow-same-origin"
                className="w-full border border-[#1E1E1E] rounded-lg"
                style={{ minHeight: "600px", maxHeight: "80vh" }}
                onLoad={(e) => {
                  // Auto-resize iframe to content height
                  const iframe = e.target as HTMLIFrameElement;
                  if (iframe.contentDocument?.body) {
                    const height = iframe.contentDocument.body.scrollHeight;
                    iframe.style.height = `${Math.min(height + 20, window.innerHeight * 0.75)}px`;
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        {html && (
          <div className="flex items-center gap-3 p-5 border-t border-[#1E1E1E]">
            <button
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="flex-1 px-4 py-2.5 bg-[#DA4E24] text-white rounded-lg font-medium text-sm hover:bg-[#DA4E24]/90 transition-colors disabled:opacity-50"
            >
              {downloading ? "Rendering PNG..." : "Download as PNG"}
            </button>
            <button
              onClick={handleCopyHTML}
              className="flex-1 px-4 py-2.5 bg-[#1E1E1E] text-[#F1F1F1] border border-[#333] rounded-lg font-medium text-sm hover:bg-[#252525] transition-colors"
            >
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              onClick={handleGenerate}
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
