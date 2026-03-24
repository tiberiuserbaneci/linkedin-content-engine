export type ThemeKey = "light" | "dark" | "handwriting";

export interface Theme {
  key: ThemeKey;
  label: string;
  bg: string;
  text: string;
  accent: string;
  secondary: string;
  border: string;
  muted: string;
  cardBg: string;
  headingFont: string;
  bodyFont: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  light: {
    key: "light",
    label: "Light",
    bg: "#F8F6F1",
    text: "#111111",
    accent: "#C94A22",
    secondary: "#F0EDEA",
    border: "#E0DDD6",
    muted: "#888888",
    cardBg: "#FFFFFF",
    headingFont: "'Bebas Neue', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
  },
  dark: {
    key: "dark",
    label: "Dark",
    bg: "#0A0A0A",
    text: "#FFFFFF",
    accent: "#DA4E24",
    secondary: "#1A1A1A",
    border: "#2A2A2A",
    muted: "#666666",
    cardBg: "#111111",
    headingFont: "'Bebas Neue', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
  },
  handwriting: {
    key: "handwriting",
    label: "Handwriting",
    bg: "#F5F0E8",
    text: "#2D2A26",
    accent: "#DA4E24",
    secondary: "#E8E0D0",
    border: "#D4C9B8",
    muted: "#8A857D",
    cardBg: "#FFFFFF",
    headingFont: "'Caveat', cursive",
    bodyFont: "'DM Sans', sans-serif",
  },
};

export const HANDWRITING_SECTION_COLORS = [
  { bg: "#D4EDDA", border: "#A8D5B5", badge: "#2D6A4F", text: "#1B4332" },
  { bg: "#FFF9C4", border: "#F9E784", badge: "#A16207", text: "#713F12" },
  { bg: "#FFE0B2", border: "#FFCC80", badge: "#C2410C", text: "#7C2D12" },
  { bg: "#E8F5E9", border: "#C8E6C9", badge: "#166534", text: "#14532D" },
  { bg: "#FFF3E0", border: "#FFE0B2", badge: "#C2410C", text: "#7C2D12" },
  { bg: "#E3F2FD", border: "#BBDEFB", badge: "#1565C0", text: "#0D47A1" },
  { bg: "#FCE4EC", border: "#F8BBD0", badge: "#AD1457", text: "#880E4F" },
];
