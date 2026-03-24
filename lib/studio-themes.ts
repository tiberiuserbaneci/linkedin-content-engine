export type ThemeKey = "light" | "dark" | "expressive";

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
  expressive: {
    key: "expressive",
    label: "Expressive",
    bg: "#FFFFFF",
    text: "#111111",
    accent: "#DA4E24",
    secondary: "#F7F7F7",
    border: "#E5E5E5",
    muted: "#666666",
    cardBg: "#FFFFFF",
    headingFont: "'Bebas Neue', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
  },
};
