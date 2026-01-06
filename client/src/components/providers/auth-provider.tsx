"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize auth store from localStorage once
    useAuthStore.getState().initializeAuth();

    // Check for expiration on mount/focus
    const { accessToken, isAuthenticated, isTokenExpired } = useAuthStore.getState();
    if (isAuthenticated && (isTokenExpired() || !accessToken)) {
      // Proactively try to refresh if we think we are logged in but token is arguably stale
      axios
        .post(API_ENDPOINTS.AUTH.REFRESH, {}, { withCredentials: true })
        .then((res) => {
          const refreshData = res.data?.data;
          const newAccessToken =
            typeof refreshData === "string"
              ? refreshData
              : refreshData?.accessToken;

          if (newAccessToken) {
            useAuthStore.getState().updateTokens({
              accessToken: newAccessToken,
              refreshToken: useAuthStore.getState().refreshToken || "",
            });
          }
        })
        .catch(() => {
          // If passive refresh fails, we are not authenticated
          useAuthStore.getState().logout();
        });
    }
  }, []); // Empty deps - only run once on mount

  return <>{children}</>;
}

