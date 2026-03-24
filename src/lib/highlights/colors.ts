export interface HighlightColor {
  key: string;
  label: string;
  bg: string;
  border: string;
}

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  { key: "yellow", label: "Yellow", bg: "#fef08a", border: "#fbbf24" },
  { key: "green", label: "Green", bg: "#bbf7d0", border: "#4ade80" },
  { key: "blue", label: "Blue", bg: "#bfdbfe", border: "#60a5fa" },
  { key: "pink", label: "Pink", bg: "#fbcfe8", border: "#f472b6" },
  { key: "purple", label: "Purple", bg: "#e9d5ff", border: "#a78bfa" },
  { key: "orange", label: "Orange", bg: "#fed7aa", border: "#fb923c" },
  { key: "red", label: "Red", bg: "#fecaca", border: "#f87171" },
];

export const COLOR_MAP = Object.fromEntries(
  HIGHLIGHT_COLORS.map((c) => [c.key, c])
) as Record<string, HighlightColor>;
