"use client";

import { useState, useRef, useCallback } from "react";
import { InfographicTemplate } from "@/app/infographic/infographic-template";

/* ── Template registry ──────────────────────────────── */

interface TemplateEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  Component: React.ComponentType;
}

const TEMPLATES: TemplateEntry[] = [
  {
    id: "founder-ai-stack-2026",
    title: "Founder AI Stack 2026",
    description:
      "7 AI Automations. 1 Founder. 6-section grid with R.E.P.L.A.C.E. philosophy, lead gen flowchart, competitor intelligence, deal pipeline, metrics table & health monitor.",
    href: "/infographic",
    Component: InfographicTemplate,
  },
];

/* ── PNG Export helper ──────────────────────────────── */

async function exportToPng(element: HTMLElement, filename: string) {
  const html2canvas = (await import("html2canvas-pro")).default;
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#FAF8F5",
    width: 1080,
    height: 1350,
    windowWidth: 1080,
    windowHeight: 1350,
  });
  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ── Renders template offscreen at full size and exports ── */

async function exportFullSize(
  TemplateComp: React.ComponentType,
  filename: string
) {
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "0";
  wrapper.style.width = "1080px";
  wrapper.style.height = "1350px";
  wrapper.style.overflow = "hidden";
  document.body.appendChild(wrapper);

  const { createRoot } = await import("react-dom/client");
  const root = createRoot(wrapper);
  root.render(<TemplateComp />);

  // Wait for render
  await new Promise((r) => setTimeout(r, 600));

  try {
    await exportToPng(wrapper, filename);
  } finally {
    root.unmount();
    document.body.removeChild(wrapper);
  }
}

/* ── Preview Modal ──────────────────────────────────── */

function PreviewModal({
  template,
  onClose,
}: {
  template: TemplateEntry;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportFullSize(template.Component, template.id);
    } finally {
      setExporting(false);
    }
  }, [template]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#111] border-b border-[#222] shrink-0">
        <h2 className="text-sm font-semibold text-[#F1F1F1]">
          Preview: {template.title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#666]">1080 × 1350 px</span>
          <a
            href={template.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-[#1E1E1E] text-[#CCC] hover:bg-[#2A2A2A] transition-colors"
          >
            Open Full Page ↗
          </a>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-[#C94A22] text-white hover:bg-[#C94A22]/90 transition-colors disabled:opacity-50"
          >
            {exporting ? "Exporting…" : "Export PNG (1080×1350)"}
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#666] hover:text-[#F1F1F1] hover:bg-[#1E1E1E] transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
        <div
          ref={contentRef}
          className="shadow-2xl shrink-0"
          style={{ width: 1080, height: 1350 }}
        >
          <template.Component />
        </div>
      </div>
    </div>
  );
}

/* ── Thumbnail Card ─────────────────────────────────── */

function TemplateCard({
  template,
  onPreview,
}: {
  template: TemplateEntry;
  onPreview: () => void;
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setExporting(true);
      try {
        await exportFullSize(template.Component, template.id);
      } finally {
        setExporting(false);
      }
    },
    [template]
  );

  return (
    <div className="group rounded-xl border border-[#1E1E1E] bg-[#111] overflow-hidden hover:border-[#333] transition-colors">
      {/* Thumbnail preview – scaled-down live render of full 1080×1350 */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: 375 }}
        onClick={onPreview}
      >
        <div
          className="origin-top-left pointer-events-none"
          style={{
            transform: "scale(0.278)",
            width: 1080,
            height: 1350,
            transformOrigin: "top left",
          }}
        >
          <template.Component />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-4 py-2 rounded-lg">
            Click to Preview
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 border-t border-[#1E1E1E]">
        <h3 className="text-[14px] font-semibold text-[#F1F1F1] mb-1">
          {template.title}
        </h3>
        <p className="text-[11px] text-[#666] leading-relaxed line-clamp-2 mb-3">
          {template.description}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="flex-1 px-3 py-1.5 text-[11px] font-medium rounded-md bg-[#1E1E1E] text-[#CCC] hover:bg-[#2A2A2A] transition-colors text-center"
          >
            Preview
          </button>
          <a
            href={template.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-1.5 text-[11px] font-medium rounded-md bg-[#1E1E1E] text-[#CCC] hover:bg-[#2A2A2A] transition-colors text-center"
          >
            Open ↗
          </a>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 px-3 py-1.5 text-[11px] font-medium rounded-md bg-[#C94A22] text-white hover:bg-[#C94A22]/90 transition-colors disabled:opacity-50 text-center"
          >
            {exporting ? "…" : "Export PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */

export default function InfographicsPage() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewTemplate = TEMPLATES.find((t) => t.id === previewId) ?? null;

  return (
    <div className="flex-1 bg-[#0A0A0A] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#F1F1F1]">Infographics</h1>
          <p className="text-[13px] text-[#666] mt-1">
            LinkedIn infographic templates — preview, customize, and export as
            PNG.
          </p>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onPreview={() => setPreviewId(t.id)}
            />
          ))}

          {/* Placeholder for future templates */}
          <div className="rounded-xl border border-dashed border-[#333] bg-[#0A0A0A] flex items-center justify-center min-h-[375px]">
            <div className="text-center p-4">
              <div className="text-2xl text-[#333] mb-2">+</div>
              <p className="text-[12px] text-[#444]">More templates coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewId(null)}
        />
      )}
    </div>
  );
}
