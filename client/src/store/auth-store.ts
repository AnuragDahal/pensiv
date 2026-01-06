import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";


// =======================
// TYPES
// =======================

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
};

type User = {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  stats?: {
    postCount: number;
    totalLikes: number;
    followersCount: number;
  };
};

type AuthState = {
  // Auth state
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isLoadingUser: boolean;
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
  isTokenExpired: () => boolean;
  initializeAuth: () => void;

  // New: Fetch user from /auth/me
  fetchUser: () => Promise<void>;
  refetchUser: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
};

// =======================
// STORE
// =======================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isAuthInitialized: false,
      isLoadingUser: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      // LOGIN
      login: (tokens, user) => {
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user || null,
        });
        

        // Fetch full user data after login if not provided
        if (!user) {
          get().fetchUser();
        }
      },

      // LOGOUT: clears persisted state too
      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthInitialized: true,
          isLoadingUser: false,
        });
        localStorage.removeItem("auth-storage");
      },

      // USER
      setUser: (user) => {
        set({ user });
      },

      // UPDATE TOKENS
      updateTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },

      // GET TOKENS
      getTokens: () => {
        const { accessToken, refreshToken } = get();
        return {
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        };
      },

      // TOKEN EXPIRED
      isTokenExpired: () => {
        const { accessToken } = get();
        if (!accessToken) return true;

        try {
          // Validate token structure (should have 3 parts: header.payload.signature)
          const parts = accessToken.split(".");
          if (parts.length !== 3) {
            console.warn("[AUTH] Invalid token structure");
            return true;
          }

          // Decode and parse the payload (second part)
          const payload = JSON.parse(atob(parts[1]));
          
          // Check if token has expiration and if it's expired
          if (!payload.exp) {
            console.warn("[AUTH] Token missing expiration");
            return true;
          }

          const currentTime = Date.now() / 1000;
          const isExpired = payload.exp < currentTime;
          
          if (isExpired) {
            console.log("[AUTH] Token is expired");
          }
          
          return isExpired;
        } catch (error) {
          // Any error in decoding = treat as expired/invalid
          console.error("[AUTH] Error decoding token:", error);
          return true;
        }
      },

      // FETCH USER FROM /auth/me
      fetchUser: async () => {
        const { accessToken, isAuthenticated } = get();

        if (!isAuthenticated || !accessToken) {
          return;
        }

        set({ isLoadingUser: true });

        try {
          // Dynamic import to avoid top-level circular dependency
          const { default: apiClient } = await import("@/lib/api/client");
          const response = await apiClient.get("/api/auth/me");

          if (response.data?.data) {
            set({ user: response.data.data, isLoadingUser: false });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ isLoadingUser: false });

          // If 401, logout
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            get().logout();
          }
        }
      },

      // REFETCH USER (for manual refresh - re-fetch profile data)
      refetchUser: async () => {
        return get().fetchUser();
      },
      
      // REFRESH SESSION (Exchange refresh token for new access token)
      refreshSession: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          // Dynamic import to avoid circular dependency
          const { default: apiClient } = await import("@/lib/api/client");
          
          // Call refresh endpoint with the refresh token in body
          // Note: using axios directly to avoid interceptor loop if we used apiClient here
          // But apiClient is fine if we are careful, or better use a fresh instance/fetch
          // Actually, let's use a specialized call that skips the interceptor logic or just standard axios
          // We'll use apiClient but we need to be careful about infinite loops in interceptor.
          // Ideally, the interceptor shouldn't intercept the refresh call itself.
          
          const response = await apiClient.post("/api/auth/refresh", { refreshToken });
          
          // Backend now returns both tokens: { accessToken, refreshToken }
          const tokens = response.data.data;
          
          if (!tokens || !tokens.accessToken) {
            throw new Error("Invalid refresh response");
          }
          
          // Update BOTH tokens in the store
          set({ 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || refreshToken, // Use new refresh token if provided, otherwise keep old
          });
          
          console.log("[AUTH] Session refreshed successfully");
          return tokens.accessToken;
        } catch (error) {
          console.error("[AUTH] Failed to refresh session:", error);
          get().logout();
          throw error;
        }
      },

      // HYDRATE AUTH FROM STORAGE
      initializeAuth: () => {
        // Prevent re-initialization if already in progress or done
        if (typeof window === "undefined") return;

        const stored = localStorage.getItem("auth-storage");

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const state = parsed.state || parsed;
            const { accessToken, refreshToken, user } = state;

            if (accessToken && accessToken !== "null" && refreshToken && refreshToken !== "null") {
              set({
                accessToken,
                refreshToken,
                user: user || null,
                isAuthenticated: true,
                isAuthInitialized: true,
              });

              // Fetch fresh user data after hydration only if we don't have it
              if (!user) {
                get().fetchUser();
              }
            } else {
              set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isAuthInitialized: true,
              });
            }
          } catch (error) {
            console.error("Error parsing auth storage:", error);
            set({
              isAuthenticated: false,
              isAuthInitialized: true,
            });
          }
        } else {
          set({
            isAuthenticated: false,
            isAuthInitialized: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
