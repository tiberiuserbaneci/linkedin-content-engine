"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ContentAsset, AssetFormat, AssetTheme } from "@/lib/database.types";

type VoiceMode = "tested" | "framework" | "contrarian";
type CtaMode = "in_post" | "first_comment" | "none";
type Step = "input" | "preview" | "post";

const FORMATS: { value: AssetFormat; label: string; dimensions: string }[] = [
  { value: "infographic", label: "Infographic", dimensions: "1080x1350px" },
  { value: "cheatsheet", label: "Cheatsheet", dimensions: "900px wide" },
  { value: "carousel", label: "Carousel", dimensions: "1080x1080px/slide" },
  { value: "poster", label: "Poster", dimensions: "1080x1080px" },
];

const THEMES: { value: AssetTheme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "expressive", label: "Expressive" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudioPage() {
  // Step state
  const [step, setStep] = useState<Step>("input");

  // Input state
  const [rawContent, setRawContent] = useState("");
  const [format, setFormat] = useState<AssetFormat>("infographic");
  const [theme, setTheme] = useState<AssetTheme>("dark");
  const [direction, setDirection] = useState("");
  const [images, setImages] = useState<{ base64: string; mediaType: string }[]>([]);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);
  const [editableHtml, setEditableHtml] = useState("");

  // Post state
  const [voice, setVoice] = useState<VoiceMode>("framework");
  const [ctaMode, setCtaMode] = useState<CtaMode>("first_comment");
  const [generatingPost, setGeneratingPost] = useState(false);
  const [postText, setPostText] = useState("");
  const [firstComment, setFirstComment] = useState<string | null>(null);

  // Export state
  const [exporting, setExporting] = useState(false);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Gallery state
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize iframe to full content height (called after HTML loads, with delays for fonts/images)
  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || (iframe.contentWindow as Window & { document: Document } | null)?.document;
    if (!doc || !doc.body) return;
    const h = doc.body.scrollHeight;
    if (h > 0) {
      iframe.style.height = h + "px";
    }
  }, []);

  // Auto-resize when htmlContent changes
  useEffect(() => {
    if (!htmlContent) return;
    // immediate, then after fonts/images settle
    const t1 = setTimeout(resizeIframe, 100);
    const t2 = setTimeout(resizeIframe, 600);
    const t3 = setTimeout(resizeIframe, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [htmlContent, resizeIframe]);

  // Load gallery
  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAssets(data); })
      .catch(() => {})
      .finally(() => setLoadingAssets(false));
  }, []);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        const mediaType = file.type;
        setImages((prev) => [...prev, { base64, mediaType }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  // Generate HTML
  const handleGenerate = async () => {
    if (!rawContent.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawContent,
          format,
          theme,
          direction: direction || undefined,
          referenceImages: images.length > 0 ? images : undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHtmlContent(data.html);
      setEditableHtml(data.html);
      setStep("preview");
      setSaved(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  // Apply HTML edits
  const applyHtmlEdits = () => {
    setHtmlContent(editableHtml);
    setShowHtmlEditor(false);
  };

  // Export PNG — system fonts render synchronously, just need reflow wait
  const handleExportPNG = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) throw new Error("Cannot access iframe content");
      const body = iframeDoc.body;

      // Expand iframe to full content height
      const fullH = body.scrollHeight;
      iframe.style.height = fullH + "px";

      // Wait for reflow and Logo.dev images to load
      await new Promise((r) => setTimeout(r, 1000));

      const canvas = await html2canvas(body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: body.scrollHeight,
        windowHeight: body.scrollHeight,
        width: body.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: null,
        onclone: async (clonedDoc: Document) => {
          if (clonedDoc.fonts) await clonedDoc.fonts.ready;
          clonedDoc.body.style.transform = "none";
          clonedDoc.body.style.margin = "0";
        },
      });
      const link = document.createElement("a");
      link.download = `${format}-${theme}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  // Export PDF (for carousels)
  const handleExportPDF = async () => {
    if (!iframeRef.current) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const { jsPDF } = await import("jspdf");
      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) throw new Error("Cannot access iframe content");
      const slides = iframeDoc.querySelectorAll(".slide");
      if (slides.length === 0) {
        // Fallback: export as single PNG
        await handleExportPNG();
        return;
      }
      const pdf = new jsPDF({ unit: "px", format: [1080, 1080], orientation: "portrait" });
      for (let i = 0; i < slides.length; i++) {
        const canvas = await html2canvas(slides[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL("image/png", 1.0);
        if (i > 0) pdf.addPage([1080, 1080]);
        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080);
      }
      pdf.save(`carousel-${theme}-${Date.now()}.pdf`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "PDF export failed");
    } finally {
      setExporting(false);
    }
  };

  // Generate post
  const handleGeneratePost = async () => {
    setGeneratingPost(true);
    try {
      const res = await fetch("/api/studio/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent: htmlContent.substring(0, 3000),
          rawContent,
          format,
          voice,
          ctaMode,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPostText(data.post);
      setFirstComment(data.firstComment);
      setStep("post");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Post generation failed");
    } finally {
      setGeneratingPost(false);
    }
  };

  // Save to gallery
  const handleSave = async () => {
    setSaving(true);
    try {
      // Extract title from HTML
      const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i) ||
        htmlContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch
        ? titleMatch[1].replace(/<[^>]*>/g, "").trim().substring(0, 100)
        : `${format} - ${new Date().toLocaleDateString()}`;

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, theme, title, html_content: htmlContent }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAssets((prev) => [data, ...prev]);
      setSaved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Reset to input
  const handleReset = () => {
    setStep("input");
    setHtmlContent("");
    setEditableHtml("");
    setPostText("");
    setFirstComment(null);
    setSaved(false);
    setShowHtmlEditor(false);
  };

  // Load asset from gallery
  const loadAsset = (asset: ContentAsset) => {
    setHtmlContent(asset.html_content);
    setEditableHtml(asset.html_content);
    setFormat(asset.format);
    setTheme(asset.theme);
    setStep("preview");
    setSaved(true);
  };

  const s = styles;

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.h1}>Content Studio</h1>
            <p style={s.subtitle}>Paste raw content. Select format + theme. AI generates the visual.</p>
          </div>
          {step !== "input" && (
            <button onClick={handleReset} style={s.btnGhost}>
              + New
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div style={s.stepBar}>
          {(["input", "preview", "post"] as Step[]).map((s2, i) => (
            <div
              key={s2}
              style={{
                ...s.stepDot,
                backgroundColor: step === s2 ? "#DA4E24" : i < ["input", "preview", "post"].indexOf(step) ? "#444" : "#1E1E1E",
                color: step === s2 ? "#fff" : "#666",
              }}
            >
              {i + 1}. {s2 === "input" ? "Input" : s2 === "preview" ? "Preview" : "Post"}
            </div>
          ))}
        </div>

        {/* ============ STEP 1: INPUT ============ */}
        {step === "input" && (
          <div style={s.section}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {/* Format */}
              <div>
                <label style={s.label}>Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as AssetFormat)}
                  style={s.select}
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label} ({f.dimensions})
                    </option>
                  ))}
                </select>
              </div>
              {/* Theme */}
              <div>
                <label style={s.label}>Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as AssetTheme)}
                  style={s.select}
                >
                  {THEMES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Raw content */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Raw Content</label>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste your raw content here — notes, data, bullet points, article text, anything. The AI will analyze it and create the optimal visual layout."
                style={s.textarea}
                rows={12}
              />
            </div>

            {/* Direction */}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Direction (optional)</label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                placeholder='e.g. "Use a timeline layout", "Focus on the comparison", "Make it punchy"'
                style={s.input}
              />
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={s.label}>Reference Images (optional)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => fileInputRef.current?.click()} style={s.btnOutline}>
                  + Add Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                {images.map((img, i) => (
                  <div key={i} style={s.imageBadge}>
                    Image {i + 1}
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                      style={s.imageRemove}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !rawContent.trim()}
              style={{
                ...s.btnPrimary,
                opacity: generating || !rawContent.trim() ? 0.5 : 1,
              }}
            >
              {generating ? "Generating..." : "Generate Visual"}
            </button>
          </div>
        )}

        {/* ============ STEP 2: PREVIEW ============ */}
        {step === "preview" && htmlContent && (
          <div style={s.section}>
            {/* Toolbar */}
            <div style={s.toolbar}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setStep("input"); }} style={s.btnGhost}>
                  Back
                </button>
                <button onClick={handleGenerate} disabled={generating} style={s.btnOutline}>
                  {generating ? "Regenerating..." : "Regenerate"}
                </button>
                <button
                  onClick={() => { setShowHtmlEditor(!showHtmlEditor); setEditableHtml(htmlContent); }}
                  style={s.btnOutline}
                >
                  {showHtmlEditor ? "Close Editor" : "Edit HTML"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleExportPNG} disabled={exporting} style={s.btnOutline}>
                  {exporting ? "Exporting..." : "Download PNG"}
                </button>
                {format === "carousel" && (
                  <button onClick={handleExportPDF} disabled={exporting} style={s.btnOutline}>
                    Download PDF
                  </button>
                )}
                <button onClick={handleSave} disabled={saving || saved} style={s.btnOutline}>
                  {saved ? "Saved" : saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* HTML Editor */}
            {showHtmlEditor && (
              <div style={{ marginBottom: 16 }}>
                <textarea
                  value={editableHtml}
                  onChange={(e) => setEditableHtml(e.target.value)}
                  style={{ ...s.textarea, fontFamily: "'DM Mono', monospace", fontSize: 12, height: 300 }}
                />
                <button onClick={applyHtmlEdits} style={{ ...s.btnPrimary, marginTop: 8 }}>
                  Apply Changes
                </button>
              </div>
            )}

            {/* iframe preview */}
            <div style={s.previewContainer}>
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                style={s.iframe}
                sandbox="allow-scripts allow-same-origin"
                title="Visual Preview"
                onLoad={resizeIframe}
              />
            </div>

            {/* Post generation section */}
            <div style={{ ...s.card, marginTop: 24 }}>
              <h3 style={s.cardTitle}>Generate LinkedIn Post</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={s.label}>Voice</label>
                  <select value={voice} onChange={(e) => setVoice(e.target.value as VoiceMode)} style={s.select}>
                    <option value="tested">Tested (first person experience)</option>
                    <option value="framework">Framework (expert sharing)</option>
                    <option value="contrarian">Contrarian (challenges norms)</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>CTA</label>
                  <select value={ctaMode} onChange={(e) => setCtaMode(e.target.value as CtaMode)} style={s.select}>
                    <option value="first_comment">Link in first comment</option>
                    <option value="in_post">CTA in post</option>
                    <option value="none">No CTA</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleGeneratePost}
                disabled={generatingPost}
                style={{ ...s.btnPrimary, opacity: generatingPost ? 0.5 : 1 }}
              >
                {generatingPost ? "Writing Post..." : "Generate Post + Comment"}
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP 3: POST ============ */}
        {step === "post" && (
          <div style={s.section}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setStep("preview")} style={s.btnGhost}>
                Back to Preview
              </button>
            </div>

            {/* Post text */}
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={s.cardTitle}>LinkedIn Post</h3>
                <button onClick={() => copyToClipboard(postText)} style={s.btnSmall}>
                  Copy
                </button>
              </div>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={{ ...s.textarea, minHeight: 300 }}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                {postText.length} characters
              </div>
            </div>

            {/* First comment */}
            {firstComment && (
              <div style={{ ...s.card, marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={s.cardTitle}>First Comment</h3>
                  <button onClick={() => copyToClipboard(firstComment)} style={s.btnSmall}>
                    Copy
                  </button>
                </div>
                <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, padding: 12, backgroundColor: "#111", borderRadius: 8 }}>
                  {firstComment}
                </div>
              </div>
            )}

            {/* Save button */}
            {!saved && (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...s.btnPrimary, marginTop: 16 }}
              >
                {saving ? "Saving..." : "Save to Gallery"}
              </button>
            )}
          </div>
        )}

        {/* ============ GALLERY ============ */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#F1F1F1", marginBottom: 16 }}>
            Saved Assets
          </h2>
          {loadingAssets ? (
            <p style={{ color: "#444", fontSize: 14 }}>Loading...</p>
          ) : assets.length === 0 ? (
            <div style={s.emptyState}>No saved assets yet. Create one above!</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => loadAsset(asset)}
                  style={s.assetCard}
                >
                  <div style={{ fontSize: 11, color: "#DA4E24", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>
                    {asset.format}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F1F1F1", lineHeight: 1.4, marginBottom: 8 }}>
                    {asset.title}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#444" }}>{formatDate(asset.created_at)}</span>
                    <span style={{ fontSize: 10, color: "#666", backgroundColor: "#1E1E1E", borderRadius: 4, padding: "2px 6px", textTransform: "capitalize" as const }}>
                      {asset.theme}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline styles
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0A0A0A",
    color: "#F1F1F1",
    fontFamily: "'DM Sans', sans-serif",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: "#F1F1F1",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    margin: "8px 0 0",
  },
  stepBar: {
    display: "flex",
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    fontSize: 12,
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: 20,
    letterSpacing: "0.02em",
  },
  section: {},
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#888",
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#111",
    border: "1px solid #2A2A2A",
    borderRadius: 8,
    color: "#F1F1F1",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#111",
    border: "1px solid #2A2A2A",
    borderRadius: 8,
    color: "#F1F1F1",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#111",
    border: "1px solid #2A2A2A",
    borderRadius: 8,
    color: "#F1F1F1",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: "vertical" as const,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  btnPrimary: {
    width: "100%",
    padding: "12px 24px",
    backgroundColor: "#DA4E24",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnOutline: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#AAA",
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid #2A2A2A",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnGhost: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#888",
    fontSize: 13,
    fontWeight: 500,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  btnSmall: {
    padding: "4px 12px",
    backgroundColor: "#1E1E1E",
    color: "#AAA",
    fontSize: 12,
    fontWeight: 500,
    border: "1px solid #2A2A2A",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  previewContainer: {
    border: "1px solid #2A2A2A",
    borderRadius: 12,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "90vh",
    backgroundColor: "#000",
    width: "100%",
  },
  iframe: {
    width: "100%",
    height: "600px",
    border: "none",
    display: "block",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#111",
    border: "1px solid #1E1E1E",
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#F1F1F1",
    margin: 0,
  },
  imageBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1E1E1E",
    color: "#AAA",
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 4,
  },
  imageRemove: {
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: 12,
    padding: 0,
  },
  emptyState: {
    border: "1px dashed #1E1E1E",
    borderRadius: 12,
    padding: "48px 24px",
    textAlign: "center" as const,
    color: "#444",
    fontSize: 14,
  },
  assetCard: {
    backgroundColor: "#111111",
    border: "1px solid #1E1E1E",
    borderRadius: 10,
    padding: 20,
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
};
