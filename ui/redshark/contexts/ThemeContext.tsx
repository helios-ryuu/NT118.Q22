import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Appearance, type ColorSchemeName } from "react-native";
import { storage } from "@/services/storage";
import { applyThemeColors, type ThemeMode } from "@/constants/theme";

interface ThemeState {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark";
  themeVersion: number;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

export const ThemeContext = createContext<ThemeState>({
  themeMode: "system",
  resolvedTheme: "light",
  themeVersion: 0,
  setThemeMode: async () => {},
});

function resolveTheme(mode: ThemeMode, systemScheme: ColorSchemeName): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  return systemScheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    storage.getThemeMode()
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemeModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const resolvedTheme = resolveTheme(themeMode, systemScheme);

  useEffect(() => {
    applyThemeColors(resolvedTheme);
    setThemeVersion((v) => v + 1);
  }, [resolvedTheme]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storage.setThemeMode(mode);
  }, []);

  const value = useMemo(() => ({
    themeMode,
    resolvedTheme,
    setThemeMode,
    themeVersion,
  }), [themeMode, resolvedTheme, setThemeMode, themeVersion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
