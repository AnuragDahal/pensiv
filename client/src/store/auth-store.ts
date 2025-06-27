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
  getTokens: () => {
    accessToken: string | null;
    refreshToken: string | null;
  };

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
      },

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
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
      },

      // Check if token is expired
      isTokenExpired: () => {
        const { accessToken } = get();
        if (
          !accessToken ||
          accessToken === "null" ||
          accessToken === "undefined"
        ) {
          return true;
        }

        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch (error) {
          console.error("Error parsing token:", error);
          return true;
        }
      }, // Initialize auth state

      initializeAuth: () => {
        const storedData = localStorage.getItem("auth-storage");
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            const { accessToken, refreshToken, user } = parsed.state || parsed;

            // Validate tokens are not null/undefined
            if (
              accessToken &&
              accessToken !== "null" &&
              refreshToken &&
              refreshToken !== "null"
            ) {
              set({
                accessToken,
                refreshToken,
                user,
                isAuthenticated: true,
              });
            } else {
              // Clear invalid tokens
              set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
              });
              localStorage.removeItem("auth-storage");
            }
          } catch (error) {
            console.error("Error parsing auth data:", error);
            set({
              accessToken: null,
              refreshToken: null,
              user: null,
              isAuthenticated: false,
            });
          }
        }
      },
      getTokens: () => {
        const { accessToken, refreshToken } = get();
        return {
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        };
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
