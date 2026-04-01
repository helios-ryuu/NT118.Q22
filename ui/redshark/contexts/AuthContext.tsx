// Auth state provider — quan ly trang thai dang nhap toan app
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/user";
import { api, setToken as setApiToken } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { storage } from "@/services/storage";

// Du lieu gui len khi dang ky tai khoan moi
export interface RegisterData {
  email: string;
  name: string;
  username: string;
  birthday: string;
  password: string;
  avatarUri: string | null;
}

// Phan hoi tu backend khi dang nhap/dang ky
interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  checkEmail: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUser: (partial: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  checkEmail: async () => false,
  logout: async () => {},
  deleteAccount: async () => {},
  updateUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Dong bo token vao api client khi thay doi
  useEffect(() => {
    setApiToken(token);
  }, [token]);

  // Khoi phuc phien dang nhap tu storage khi app mo lai
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await storage.getToken();
        const savedUser = await storage.getUser<User>();
        if (savedToken && savedUser) {
          setApiToken(savedToken); // sync ngay vao api module truoc khi React re-render
          setToken(savedToken);
          setUser(savedUser);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const checkEmail = useCallback(async (email: string): Promise<boolean> => {
    const res = await api.post<{ exists: boolean }>(endpoints.auth.checkEmail, { email });
    return res.exists;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>(endpoints.auth.login, { email, password });
    setApiToken(res.token); // sync ngay vao api module truoc khi React re-render
    setToken(res.token);
    setUser(res.user);
    await storage.setToken(res.token);
    await storage.setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.post<AuthResponse>(endpoints.auth.register, {
      email: data.email,
      name: data.name,
      username: data.username,
      birthday: data.birthday,
      password: data.password,
    });
    setApiToken(res.token); // fix: dong bo token ngay sau khi dang ky
    setToken(res.token);
    setUser(res.user);
    await storage.setToken(res.token);
    await storage.setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try { await api.delete(endpoints.auth.logout); } catch (e) { console.warn("Logout API failed:", e); }
    setApiToken(null); // xoa token khoi api module ngay lap tuc, truoc khi React re-render
    setToken(null);
    setUser(null);
    await storage.clearAuth();
  }, []);

  const updateUser = useCallback(async (partial: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...partial };
    setUser(merged);
    await storage.setUser(merged);
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    await api.delete(endpoints.users.byId(user.id));
    setToken(null);
    setUser(null);
    await storage.clearAuth();
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, checkEmail, logout,
      deleteAccount, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
