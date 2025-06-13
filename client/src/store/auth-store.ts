import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieUtils } from "@/lib/utils";

// User type
type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

// Auth store state
type AuthState = {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user?: User
  ) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void;

  // Session check
  isTokenExpired: () => boolean;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null, // Login action
      login: (tokens, user) => {
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user || null,
        });

        // Set tokens as cookies for middleware access
        if (typeof document !== "undefined") {
          // Set httpOnly-like cookies for security (though client-side cookies aren't truly httpOnly)
          document.cookie = `accessToken=${
            tokens.accessToken
          }; Path=/; SameSite=Lax; Secure=${
            location.protocol === "https:"
          }; Max-Age=${7 * 24 * 60 * 60}`; // 7 days
          document.cookie = `refreshToken=${
            tokens.refreshToken
          }; Path=/; SameSite=Lax; Secure=${
            location.protocol === "https:"
          }; Max-Age=${30 * 24 * 60 * 60}`; // 30 days
        }
      },

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });

        // Clear cookies
        document.cookie =
          "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure";
        document.cookie =
          "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure";
      },

      // Set user data
      setUser: (user) => {
        set({ user });
      }, // Update tokens
      updateTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        // Update cookies as well
        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${
            tokens.accessToken
          }; Path=/; SameSite=Lax; Secure=${
            location.protocol === "https:"
          }; Max-Age=${7 * 24 * 60 * 60}`;
          document.cookie = `refreshToken=${
            tokens.refreshToken
          }; Path=/; SameSite=Lax; Secure=${
            location.protocol === "https:"
          }; Max-Age=${30 * 24 * 60 * 60}`;
        }
      },

      // Check if token is expired
      isTokenExpired: () => {
        const { accessToken } = get();
        if (!accessToken) return true;

        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch {
          return true;
        }
      }, // Initialize auth state
      initializeAuth: () => {
        const { accessToken, isTokenExpired } = get();

        // Check localStorage first, then cookies as fallback
        if (accessToken && !isTokenExpired()) {
          set({ isAuthenticated: true });
        } else if (typeof document !== "undefined") {
          // Check cookies if localStorage doesn't have valid tokens
          const cookieAccessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

          const cookieRefreshToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("refreshToken="))
            ?.split("=")[1];

          if (cookieAccessToken && !isTokenExpired()) {
            set({
              isAuthenticated: true,
              accessToken: cookieAccessToken,
              refreshToken: cookieRefreshToken,
            });
          } else {
            get().logout();
          }
        } else {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
