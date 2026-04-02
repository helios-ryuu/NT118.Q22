export const fonts = {
  light: "Lexend_300Light",
  regular: "Lexend_400Regular",
  medium: "Lexend_500Medium",
  semiBold: "Lexend_600SemiBold",
  bold: "Lexend_700Bold",
} as const;

export const colors = {
  primary: "#0066FF",
  primaryLight: "#E6F4FE",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1A1A2E",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  error: "#EF4444",
} as const;

export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48] as const;
export const radius = { sm: 6, md: 12, lg: 20 } as const;
export const text = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 32 } as const;

// Keep aliases so existing code that uses fontSize/borderRadius still compiles
export const fontSize = text;
export const borderRadius = radius;
