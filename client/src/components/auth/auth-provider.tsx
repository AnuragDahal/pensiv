"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // optional: Next router for redirects

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, updateTokens, logout, isTokenExpired, getTokens } =
    useAuthStore();

  const router = useRouter(); // optional, for redirect

  useEffect(() => {
    // Initialize auth store from localStorage once
    initializeAuth();

    // Create interceptors
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

        config.withCredentials = true; // send cookies if needed
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
            const { refreshToken } = getTokens();

            if (
              !refreshToken ||
              refreshToken === "null" ||
              refreshToken === "undefined"
            ) {
              throw new Error("No refresh token available");
            }

            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = res.data;

            if (newAccessToken && newRefreshToken) {
              updateTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            } else {
              throw new Error("Invalid refresh response");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
            router.push("/login"); // redirect on failure
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
  }, [initializeAuth, updateTokens, logout, isTokenExpired, getTokens, router]);

  return <>{children}</>;
}
