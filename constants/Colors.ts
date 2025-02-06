/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const COLORS = [
  // Warm Colors
  { id: "red", value: "#DC2626" },
  { id: "rose", value: "#E11D48" },
  { id: "orange", value: "#EA580C" },
  { id: "amber", value: "#D97706" },
  { id: "yellow", value: "#CA8A04" },
  { id: "brown", value: "#92400E" },

  // Nature Colors
  { id: "lime", value: "#65A30D" },
  { id: "green", value: "#16A34A" },
  { id: "emerald", value: "#059669" },
  { id: "teal", value: "#0D9488" },
  { id: "cyan", value: "#0891B2" },
  { id: "sky", value: "#0284C7" },

  // Cool Colors
  { id: "blue", value: "#2563EB" },
  { id: "indigo", value: "#4F46E5" },
  { id: "violet", value: "#7C3AED" },
  { id: "purple", value: "#9333EA" },
  { id: "fuchsia", value: "#C026D3" },
  { id: "pink", value: "#DB2777" },

  // Neutral Colors
  { id: "slate", value: "#475569" },
  { id: "gray", value: "#4B5563" },
  { id: "zinc", value: "#52525B" },
  { id: "neutral", value: "#525252" },
  { id: "stone", value: "#57534E" },
  { id: "warmGray", value: "#4B5563" },
];

export const getColorValue = (colorId: string) => {
  return COLORS.find((c) => c.id === colorId)?.value || "#374151";
};
