// Design tokens — mau sac, spacing, typography cho toan bo app

// Font Lexend — map fontWeight sang font family tuong ung
export const fonts = {
  light: "Lexend_300Light",
  regular: "Lexend_400Regular",
  medium: "Lexend_500Medium",
  semiBold: "Lexend_600SemiBold",
  bold: "Lexend_700Bold",
  extraBold: "Lexend_800ExtraBold",
} as const;

export type ThemeMode = "light" | "dark" | "system";

const lightColors = {
  primary: "#0066FF",
  primaryLight: "#E6F4FE",
  secondary: "#FF4757",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1A1A2E",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
} as const;

const darkColors = {
  primary: "#5BA0FF",
  primaryLight: "#223049",
  secondary: "#FF6B78",
  background: "#0E1623",
  surface: "#162233",
  text: "#EAF1FF",
  textSecondary: "#9CB0CF",
  border: "#27364E",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
} as const;

export const colors = {
  ...lightColors,
} as const;

export function applyThemeColors(scheme: "light" | "dark") {
  const next = scheme === "dark" ? darkColors : lightColors;
  Object.assign(colors, next);
}

export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48] as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;
