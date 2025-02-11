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
  { id: "red", value: "#DC2626", tailwindValue: "bg-red-600" },
  { id: "rose", value: "#E11D48", tailwindValue: "bg-rose-600" },
  { id: "orange", value: "#EA580C", tailwindValue: "bg-orange-600" },
  { id: "amber", value: "#D97706", tailwindValue: "bg-amber-600" },
  { id: "yellow", value: "#CA8A04", tailwindValue: "bg-yellow-600" },
  { id: "brown", value: "#92400E", tailwindValue: "bg-yellow-800" },

  // Nature Colors
  { id: "lime", value: "#65A30D", tailwindValue: "bg-lime-600" },
  { id: "green", value: "#16A34A", tailwindValue: "bg-green-600" },
  { id: "emerald", value: "#059669", tailwindValue: "bg-emerald-600" },
  { id: "teal", value: "#0D9488", tailwindValue: "bg-teal-600" },
  { id: "cyan", value: "#0891B2", tailwindValue: "bg-cyan-600" },
  { id: "sky", value: "#0284C7", tailwindValue: "bg-sky-600" },

  // Cool Colors
  { id: "blue", value: "#2563EB", tailwindValue: "bg-blue-600" },
  { id: "indigo", value: "#4F46E5", tailwindValue: "bg-indigo-600" },
  { id: "violet", value: "#7C3AED", tailwindValue: "bg-violet-600" },
  { id: "purple", value: "#9333EA", tailwindValue: "bg-purple-600" },
  { id: "fuchsia", value: "#C026D3", tailwindValue: "bg-fuchsia-600" },
  { id: "pink", value: "#DB2777", tailwindValue: "bg-pink-600" },

  // Neutral Colors
  { id: "slate", value: "#475569", tailwindValue: "bg-slate-600" },
  { id: "gray", value: "#4B5563", tailwindValue: "bg-gray-600" },
  { id: "zinc", value: "#52525B", tailwindValue: "bg-zinc-600" },
  { id: "neutral", value: "#525252", tailwindValue: "bg-neutral-600" },
  { id: "stone", value: "#57534E", tailwindValue: "bg-stone-600" },
  { id: "warmGray", value: "#4B5563", tailwindValue: "bg-gray-600" },
  {
    id: "diamond",
    value: "#5F83FC",
    tailwindValue: "bg-[#5F83FC]",
  },
  {
    id: "ruby",
    value: "#FD88A0",
    tailwindValue: "bg-[#FD88A0]",
  },
  {
    id: "master",
    value: "#F28FDF",
    tailwindValue: "bg-[#F28FDF]",
  },
  {
    id: "platinum",
    value: "#60EFB2",
    tailwindValue: "bg-[#60EFB2]",
  },
  {
    id: "gold",
    value: "#FDB859",
    tailwindValue: "bg-[#FDB859]",
  },
  {
    id: "silver",
    value: "#817B89",
    tailwindValue: "bg-[#817B89]",
  },
  {
    id: "bronze",
    value: "#88511E",
    tailwindValue: "bg-[#88511E]",
  },
];

export const getColorValue = (colorId: string) => {
  const color = COLORS.find((c) => c.id === colorId);
  return color ? color.value : "#E5E7EB";
};
