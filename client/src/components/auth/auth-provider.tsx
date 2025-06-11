"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, updateTokens, logout, isTokenExpired } =
    useAuthStore();

  useEffect(() => {
    // Initialize auth state on app start
    initializeAuth();

    // Set up axios interceptors for automatic token handling
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const { accessToken, refreshToken } = useAuthStore.getState();
        if (accessToken && !isTokenExpired()) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // Always include credentials for cookie-based auth
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            const { refreshToken } = useAuthStore.getState();
            if (refreshToken) {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                {
                  refreshToken,
                },
                { withCredentials: true }
              );

              const { accessToken: newAccessToken } = response.data.data;

              // Update tokens in store
              updateTokens({
                accessToken: newAccessToken,
                refreshToken: refreshToken, // Keep the existing refresh token
              });

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            logout();
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [initializeAuth, updateTokens, logout, isTokenExpired]);

  return <>{children}</>;
}
