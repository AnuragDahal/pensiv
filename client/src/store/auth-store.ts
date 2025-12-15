import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

// =======================
// TYPES
// =======================

type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
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
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch (error) {
          console.error("Error decoding token:", error);
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
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            }
          );

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

      // REFETCH USER (for manual refresh)
      refetchUser: async () => {
        return get().fetchUser();
      },

      // HYDRATE AUTH FROM STORAGE
      initializeAuth: () => {
        const stored = localStorage.getItem("auth-storage");

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const { accessToken, refreshToken, user } = parsed.state || parsed;

            if (accessToken && refreshToken) {
              set({
                accessToken,
                refreshToken,
                user: user || null,
                isAuthenticated: !!accessToken,
                isAuthInitialized: true,
              });

              // Fetch fresh user data after hydration
              get().fetchUser();
            } else {
              set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isAuthInitialized: true,
              });
              localStorage.removeItem("auth-storage");
            }
          } catch (error) {
            console.error("Error parsing auth storage:", error);
            set({
              accessToken: null,
              refreshToken: null,
              user: null,
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
