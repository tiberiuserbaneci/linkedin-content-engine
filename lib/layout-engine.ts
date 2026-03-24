/**
 * Layout Engine — auto-selects 1 of 8 layouts based on content analysis.
 * Used by the EXPRESSIVE theme to assign visual treatments to sections.
 */

export type LayoutType =
  | "HERO_GRID"
  | "TIMELINE"
  | "COMPARISON"
  | "PYRAMID"
  | "FLOWCHART"
  | "MOSAIC"
  | "MAGAZINE"
  | "DASHBOARD";

export interface LayoutMeta {
  type: LayoutType;
  label: string;
  description: string;
}

export const LAYOUTS: Record<LayoutType, LayoutMeta> = {
  HERO_GRID: {
    type: "HERO_GRID",
    label: "Hero Grid",
    description: "Title + stats + 2-col cards (lists)",
  },
  TIMELINE: {
    type: "TIMELINE",
    label: "Timeline",
    description: "Vertical numbered steps, alternating L/R (processes)",
  },
  COMPARISON: {
    type: "COMPARISON",
    label: "Comparison",
    description: "Full-width table, highlighted winner column (comparisons)",
  },
  PYRAMID: {
    type: "PYRAMID",
    label: "Pyramid",
    description: "Hierarchy levels, widest bottom (hierarchies)",
  },
  FLOWCHART: {
    type: "FLOWCHART",
    label: "Flowchart",
    description: "L-to-R process with decision nodes (workflows)",
  },
  MOSAIC: {
    type: "MOSAIC",
    label: "Mosaic",
    description: "1 large card + 4 small asymmetric (featured content)",
  },
  MAGAZINE: {
    type: "MAGAZINE",
    label: "Magazine",
    description: "Large illustration left + text right (narratives)",
  },
  DASHBOARD: {
    type: "DASHBOARD",
    label: "Dashboard",
    description: "Metrics top + chart middle + insights bottom (data)",
  },
};

/**
 * EXPRESSIVE card style types — each section gets a different visual treatment.
 */
export type CardStyle = "A" | "B" | "C" | "D" | "E" | "F";

/** The rotation order for section card styles */
export const CARD_STYLE_ROTATION: CardStyle[] = ["A", "E", "B", "C", "D", "F"];

/**
 * Card style A colors — soft pastels for colored background cards.
 */
export const EXPRESSIVE_CARD_COLORS = [
  { bg: "#FFE5D9", shadow: "rgba(255, 229, 217, 0.5)", title: "#7C2D12" },   // salmon
  { bg: "#D4F1F4", shadow: "rgba(212, 241, 244, 0.5)", title: "#0E4D5A" },   // cyan
  { bg: "#FFF3CD", shadow: "rgba(255, 243, 205, 0.5)", title: "#713F12" },   // yellow
  { bg: "#D5F5E3", shadow: "rgba(213, 245, 227, 0.5)", title: "#14532D" },   // mint
  { bg: "#E8DAEF", shadow: "rgba(232, 218, 239, 0.5)", title: "#4A1A6B" },   // purple
  { bg: "#DBEAFE", shadow: "rgba(219, 234, 254, 0.5)", title: "#1E3A5F" },   // blue
];

/**
 * Get the card style for a section based on its index.
 */
export function getCardStyle(sectionIndex: number): CardStyle {
  return CARD_STYLE_ROTATION[sectionIndex % CARD_STYLE_ROTATION.length];
}

/**
 * Get card color palette for style A (solid colored background).
 */
export function getCardColor(sectionIndex: number) {
  return EXPRESSIVE_CARD_COLORS[sectionIndex % EXPRESSIVE_CARD_COLORS.length];
}

// ─── Content analysis for auto-selecting layout ────────────────────────────────

interface ContentSignals {
  hasMetrics: boolean;
  hasSections: boolean;
  hasComparison: boolean;
  sectionCount: number;
  hasBullets: boolean;
  hasNumberedSteps: boolean;
  contentType: "list" | "process" | "comparison" | "hierarchy" | "data" | "narrative" | "general";
}

function analyzeContent(content: Record<string, unknown>): ContentSignals {
  const hasMetrics = Array.isArray(content.metrics) && content.metrics.length > 0;
  const hasSections = Array.isArray(content.sections) && content.sections.length > 0;
  const hasComparison = !!content.comparison;
  const sectionCount = Array.isArray(content.sections) ? content.sections.length : 0;

  // Check for bullets in sections
  let hasBullets = false;
  let hasNumberedSteps = false;

  if (hasSections) {
    const sections = content.sections as { title?: string; bullets?: string[]; items?: string[] }[];
    hasBullets = sections.some((s) => (s.bullets || s.items || []).length > 0);

    // Check if section titles look like numbered steps
    hasNumberedSteps = sections.some((s) => {
      const title = (s.title || "").toLowerCase();
      return /^(step|phase|stage|\d+[\.\)])/i.test(title);
    });
  }

  // Determine content type
  let contentType: ContentSignals["contentType"] = "general";
  if (hasComparison) contentType = "comparison";
  else if (hasMetrics && sectionCount <= 2) contentType = "data";
  else if (hasNumberedSteps) contentType = "process";
  else if (hasMetrics && hasSections) contentType = "list";
  else if (hasSections && sectionCount >= 4) contentType = "list";
  else if (hasSections) contentType = "narrative";

  return { hasMetrics, hasSections, hasComparison, sectionCount, hasBullets, hasNumberedSteps, contentType };
}

/**
 * Auto-select the best layout for given content.
 */
export function selectLayout(content: Record<string, unknown>): LayoutType {
  const signals = analyzeContent(content);

  switch (signals.contentType) {
    case "comparison":
      return "COMPARISON";
    case "process":
      return "TIMELINE";
    case "data":
      return "DASHBOARD";
    case "list":
      if (signals.sectionCount >= 5) return "MOSAIC";
      return "HERO_GRID";
    case "hierarchy":
      return "PYRAMID";
    case "narrative":
      return "MAGAZINE";
    default:
      return "HERO_GRID";
  }
}

/**
 * Get grid template for sections based on count.
 */
export function getSectionGrid(sectionCount: number): { columns: number; rows: number } {
  if (sectionCount <= 2) return { columns: 2, rows: 1 };
  if (sectionCount <= 4) return { columns: 2, rows: 2 };
  if (sectionCount <= 6) return { columns: 2, rows: 3 };
  return { columns: 2, rows: Math.ceil(sectionCount / 2) };
}
