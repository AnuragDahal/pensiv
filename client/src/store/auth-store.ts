import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
      refreshToken: null,

      // Login action
      login: (tokens, user) => {
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user || null,
        });
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
      },

      // Update tokens
      updateTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
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
      },

      // Initialize auth state
      initializeAuth: () => {
        const { accessToken, isTokenExpired } = get();
        if (accessToken && !isTokenExpired()) {
          set({ isAuthenticated: true });
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
