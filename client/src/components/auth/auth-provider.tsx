"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Initialize auth store from localStorage once
    useAuthStore.getState().initializeAuth();

    // Check for expiration on mount/focus
    const { accessToken, isAuthenticated, isTokenExpired, updateTokens, logout } = useAuthStore.getState();
    if (isAuthenticated && (isTokenExpired() || !accessToken)) {
      // Proactively try to refresh if we think we are logged in but token is arguably stale
      axios
        .post("/api/auth/refresh", {}, { withCredentials: true })
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

    // Create axios interceptors for attaching tokens and handling token refresh
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const { accessToken, isAuthenticated } = useAuthStore.getState();

        if (
          accessToken &&
          accessToken !== "null" &&
          accessToken !== "undefined" &&
          isAuthenticated &&
          !isTokenExpired()
        ) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Skip if the request is for the refresh endpoint itself to prevent loops
        if (originalRequest.url?.includes("/api/auth/refresh")) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Call Next.js internal API route (cookies are handled automatically)
            const res = await axios.post(
              "/api/auth/refresh",
              {},
              { withCredentials: true }
            );

            const refreshData = res.data.data;
            const newAccessToken =
              typeof refreshData === "string"
                ? refreshData
                : refreshData?.accessToken;

            if (newAccessToken) {
              useAuthStore.getState().updateTokens({
                accessToken: newAccessToken,
                refreshToken: useAuthStore.getState().refreshToken || "",
              });

              // Update the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            } else {
              throw new Error("Invalid refresh response");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            useAuthStore.getState().logout();
            // Note: Redirects are now handled by route group layouts
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return <>{children}</>;
}
