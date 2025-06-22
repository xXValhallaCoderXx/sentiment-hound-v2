import {
  MantineThemeOverride,
  MantineColorsTuple,
  DEFAULT_THEME,
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

  "ui-background": [
    "#1A1B1E", // 0 - lightest background for elevated light-mode (rare)
    "#18191C", // 1
    "#161718", // 2
    "#151617", // 3
    "#141516", // 4
    "#131415", // 5
    "#121314", // 6
    "#111213", // 7
    "#101113", // 8 - base (main dark mode body bg)
    "#0F1011", // 9 - deepest background (e.g. behind modals)
  ],
  "ui-surface": [
    "#2A2B2E", // 0 - lightest elevated surface
    "#262729", // 1
    "#232425", // 2
    "#202122", // 3
    "#1D1E1F", // 4
    "#1A1B1E", // 5 - base
    "#18191B", // 6
    "#161718", // 7
    "#141516", // 8
    "#121314", // 9 - deepest container background
  ],
  "ui-border": [
    "#4F5255", // 0 - visible border for light mode
    "#484B4F", // 1
    "#424447", // 2
    "#3C3E41", // 3
    "#37393C", // 4
    "#2C2E33", // 5 - base (dark mode outline)
    "#282A2D", // 6
    "#242628", // 7
    "#202223", // 8
    "#1C1D1E", // 9 - very low contrast
  ],

  "ui-border-hover": [
    "#6C7278", // 0 - brighter hover ring
    "#656B70", // 1
    "#5E6469", // 2
    "#575D62", // 3
    "#50575B", // 4
    "#495057", // 5 - base
    "#42494F", // 6
    "#3B4247", // 7
    "#343A40", // 8
    "#2E3338", // 9
  ],
  "text-primary": [
    "#DEE0E2", // 0 - lowest contrast (light hint text)
    "#D3D6D8", // 1
    "#C8CCCF", // 2
    "#BDC2C5", // 3
    "#B2B7BB", // 4
    "#F8F9FA", // 5 - light mode fallback
    "#E5E6E7", // 6
    "#D1D3D5", // 7 - dark mode default
    "#BDBFC2", // 8
    "#A6A7AB", // 9
  ],

  "text-secondary": [
    "#9EA2A8",
    "#969A9F",
    "#8E9297",
    "#868A8F",
    "#7E8286",
    "#767A7E",
    "#6E7275",
    "#666A6D",
    "#5E6265",
    "#565A5D",
  ],

  "text-disabled": [
    "#6C7075",
    "#65696E",
    "#5E6267",
    "#575B60",
    "#505459",
    "#5C5F66", // your original
    "#46494F",
    "#404348",
    "#3A3C41",
    "#33363A",
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
