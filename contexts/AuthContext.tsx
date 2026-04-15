// Auth state provider — Firebase Auth lam source of truth, FDC chua user profile
import "@/services/dataconnect"; // khoi tao FDC connector truoc khi dung
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  deleteUser as deleteUserMutation,
  getMe,
  updateUser as updateUserMutation,
  upsertUser,
} from "@dataconnect/generated";
import { firebaseAuth } from "@/services/firebase";
import type { User } from "@/types/user";

export interface RegisterData {
  email: string;
  displayName: string;
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  // Ngan observer can thiep vao khi register() tu xu ly
  const skipObserver = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (skipObserver.current) return;
      setLoading(true);
      try {
        if (firebaseUser) {
          const result = await getMe();
          if (result.data.user) {
            setUser(result.data.user as User);
          } else {
            // Lan dau dang nhap qua Google — tao profile tu Firebase Auth
            const base = (firebaseUser.email?.split("@")[0] ?? "user").replace(/[^a-zA-Z0-9._]/g, "");
            const username = `${base}_${Date.now().toString(36).slice(-4)}`;
            await upsertUser({
              username,
              displayName: firebaseUser.displayName ?? null,
              avatarUrl: firebaseUser.photoURL ?? null,
            });
            const retry = await getMe();
            setUser((retry.data.user as User) ?? null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[AuthContext] onAuthStateChanged error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const checkEmail = useCallback(async (email: string): Promise<boolean> => {
    const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
    return methods.length > 0;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // onAuthStateChanged se xu ly viec set user
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    skipObserver.current = true;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
      await upsertUser({
        username: data.username,
        displayName: data.displayName || null,
        avatarUrl: null,
      });
      const result = await getMe();
      setUser((result.data.user as User) ?? null);
    } finally {
      skipObserver.current = false;
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    // onAuthStateChanged se set user = null
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!firebaseAuth.currentUser) return;
    await deleteUserMutation();
    await firebaseAuth.currentUser.delete();
    // onAuthStateChanged se set user = null
  }, []);

  const updateUser = useCallback(async (partial: Partial<User>) => {
    await updateUserMutation({
      displayName: partial.displayName ?? undefined,
      avatarUrl: partial.avatarUrl ?? undefined,
      skillIds: partial.skillIds ?? undefined,
    });
    const result = await getMe();
    if (result.data.user) {
      setUser(result.data.user as User);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, checkEmail,
      logout, deleteAccount, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
