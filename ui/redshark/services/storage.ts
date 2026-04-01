// Secure storage helpers — luu va doc token xac thuc
import * as SecureStore from "expo-secure-store";
import type { ThemeMode } from "@/constants/theme";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const THEME_MODE_KEY = "theme_mode";

export const storage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  getUser: async <T>(): Promise<T | null> => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: unknown) =>
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  removeUser: () => SecureStore.deleteItemAsync(USER_KEY),

  getThemeMode: async (): Promise<ThemeMode | null> => {
    const mode = await SecureStore.getItemAsync(THEME_MODE_KEY);
    if (mode === "light" || mode === "dark" || mode === "system") return mode;
    return null;
  },
  setThemeMode: (mode: ThemeMode) => SecureStore.setItemAsync(THEME_MODE_KEY, mode),

  // Xoa toan bo du lieu auth khi dang xuat
  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
