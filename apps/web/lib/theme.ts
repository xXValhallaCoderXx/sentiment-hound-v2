import { MantineThemeOverride, MantineColorsTuple } from "@mantine/core";

// Simplified color palette - use semantic names
const colors: Record<string, MantineColorsTuple> = {
  primary: [
    "#E0F7FA",
    "#B2EBF2",
    "#80DEEA",
    "#4DD0E1",
    "#26C6DA",
    "#00BCD4",
    "#00ACC1",
    "#0097A7",
    "#00838F",
    "#006064",
  ],
  secondary: [
    "#F3E5F5",
    "#E1BEE7",
    "#CE93D8",
    "#BA68C8",
    "#AB47BC",
    "#9C27B0",
    "#8E24AA",
    "#7B1FA2",
    "#6A1B9A",
    "#4A148C",
  ],
  accent: [
    "#FFF3E0",
    "#FFE0B2",
    "#FFCC80",
    "#FFB74D",
    "#FFA726",
    "#FF9800",
    "#FB8C00",
    "#F57C00",
    "#EF6C00",
    "#E65100",
  ],
  success: [
    "#E0F2F1",
    "#B2DFDB",
    "#80CBC4",
    "#4DB6AC",
    "#26A69A",
    "#009688",
    "#00897B",
    "#00796B",
    "#00695C",
    "#004D40",
  ],
  warning: [
    "#FFFDE7",
    "#FFF9C4",
    "#FFF59D",
    "#FFF176",
    "#FFEE58",
    "#FFEB3B",
    "#FDD835",
    "#FBC02D",
    "#F9A825",
    "#F57F17",
  ],
  error: [
    "#FFEBEE",
    "#FFCDD2",
    "#EF9A9A",
    "#E57373",
    "#EF5350",
    "#F44336",
    "#E53935",
    "#D32F2F",
    "#C62828",
    "#B71C1C",
  ],
};

export const theme: MantineThemeOverride = {
  // Typography
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "700",
  },

  // Colors
  colors,
  primaryColor: "primary",
  primaryShade: { light: 5, dark: 7 }, // Lighter shade for light mode, darker for dark mode

  // Component defaults that adapt to theme
  components: {
    // Example: Cards have different backgrounds in light/dark

    Button: {
      defaultProps: {
        size: "md",
      },
    },
  },

  // Simplified other properties
  other: {
    // Theme-specific variables
    transitions: {
      duration: "200ms",
      easing: "ease",
    },
    // Sentiment visualization colors
    sentimentPositive: "#009688", // Teal/success color
    sentimentNegative: "#F44336", // Red/error color
    sentimentNeutral: "#FFEB3B", // Yellow/warning color
  },
};
