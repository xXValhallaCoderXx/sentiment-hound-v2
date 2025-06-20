import {
  MantineThemeOverride,
  MantineColorsTuple,
  DEFAULT_THEME,
  Anchor,
} from "@mantine/core";

// Simplified color palette - use semantic names
const colors: Record<string, MantineColorsTuple> = {
  primary: [
    "#FFEBEB", // 0 - very light
    "#FFCACA", // 1
    "#FF9D9D", // 2
    "#FF6F6F", // 3
    "#FF4545", // 4 (core red, branding)
    "#E03E3E", // 5 (light mode default)
    "#C13737", // 6
    "#A33030", // 7 (dark mode default)
    "#852828", // 8
    "#661E1E", // 9 - very dark
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
    "#E0F7EC",
    "#B6EFD3",
    "#8BE7BA",
    "#61DFA1",
    "#36D788",
    "#2ECC71",
    "#28B865",
    "#22965A",
    "#1C744E",
    "#165343",
  ],

  warning: [
    "#FFF9E5",
    "#FFF0B8",
    "#FFE68A",
    "#FFDD5C",
    "#FFD42E",
    "#F39C12",
    "#D8890F",
    "#AE6E0C",
    "#85530A",
    "#5C3807",
  ],

  info: [
    "#E5F3FC",
    "#B8E0F8",
    "#8ACDF4",
    "#5CB9EF",
    "#2EA6EB",
    "#3498DB",
    "#2F87C5",
    "#286EA1",
    "#21557D",
    "#1A3B59",
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
  "text-primary": [
    "#F8F9FA", // 0 - very light
    "#E9ECEF", // 1
    "#DEE2E6", // 2
    "#CED4DA", // 3
    "#ADB5BD", // 4
    "#495057", // 5 <- use for light mode (deep charcoal)
    "#343A40", // 6
    "#F8F9FA", // 7 <- use for dark mode (off-white)
    "#DDE1E3", // 8
    "#CED1D4", // 9
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
    Anchor: {
      defaultProps: {
        c: "text-primary",
      },
    },
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
    "semantic-green": DEFAULT_THEME.colors.green[6],
  },
};
