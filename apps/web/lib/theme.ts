import { MantineThemeOverride, MantineColorsTuple } from "@mantine/core";

const newBlue: MantineColorsTuple = ['#E6E9EC', '#C0C9D2', '#99A8B8', '#73889E', '#4D6784', '#26476A', '#0A2540', '#081F36', '#06192B', '#041321'];
const newOrange: MantineColorsTuple = ['#FFF0E0', '#FFDABF', '#FFC49E', '#FFAD7D', '#FF975C', '#FF813B', '#FF6B00', '#E65A00', '#CC4F00', '#B34400'];

// Updated color palette
const colors: Record<string, MantineColorsTuple> = {
  primary: newBlue, // Overwritten with newBlue
  accent: newOrange, // Overwritten with newOrange
  secondary: [ // Retained from original
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
  success: [ // Retained from original
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
  warning: [ // Retained from original
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
  error: [ // Retained from original
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
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", // Inter is already primary
  headings: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: "700",
  },

  // Colors
  colors,
  primaryColor: "primary", // This will now correctly refer to newBlue
  primaryShade: { light: 6, dark: 6 }, // Adjusted to use the main shade #0A2540 (index 6) for both modes

  // Component defaults that adapt to theme
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
    },
  },

  // Simplified other properties
  other: {
    transitions: {
      duration: "200ms",
      easing: "ease",
    },
    sentimentPositive: colors.success[5], // Using index 5 for #009688
    sentimentNegative: colors.error[5],   // Using index 5 for #F44336
    sentimentNeutral: colors.warning[5],  // Using index 5 for #FFEB3B
  },
};
