import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface AuthStore {
  token: string | null;
  user: User | null;

  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

function saveAuthCookie(token: string) {
  if (typeof document === "undefined") return;

  document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;

  document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => {
        saveAuthCookie(token);
        set({ token, user });
      },
      setUser: (user) => set({ user }),

      logout: () => {
        clearAuthCookie();
        set({
          token: null,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
