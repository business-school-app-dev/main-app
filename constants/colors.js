export const COLORS = {
  // Primary colors (Red)
  primary: {
    0: "#FFEBEE",
    50: "#FFE5E7",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#E11932", // Main primary color
    600: "#E3262B",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
    950: "#8B0000",
  },

  // Secondary colors (Golden/Yellow)
  secondary: {
    0: "#FFFFE7",
    50: "#FFFFE7",
    100: "#FFFFC1",
    200: "#FFFB86",
    300: "#FFF141",
    400: "#FFE10D",
    500: "#FFD200",
    550: "#EcB900", // Custom shade between 500 and 600
    600: "#D19A00",
    700: "#A66E02",
    800: "#89550A",
    900: "#74460F",
    950: "#442404",
  },

  // Grayscale
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Additional colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Icon colors (for consistency across components)
  icons: {
    red: "#dc2626",
    pink: "#db2777",
    orange: "#ea580c",
    cyan: "#0891b2",
    violet: "#8b5cf6",
    blue: "#1e40af",
    emerald: "#059669",
    green: "#16a34a",
    purple: "#7c3aed",
  },
};

// Export individual color groups for convenience
export const PRIMARY_COLORS = COLORS.primary;
export const SECONDARY_COLORS = COLORS.secondary;
export const GRAY_COLORS = COLORS.gray;
export const ICON_COLORS = COLORS.icons;

// Export commonly used specific colors
export const PRIMARY = COLORS.primary[500];
export const SECONDARY = COLORS.secondary[500];

export default COLORS;
