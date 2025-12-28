"use client";

import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const {
    isAuthenticated,
    isAuthInitialized,
    isLoadingUser,
    user,
    accessToken,
    login,
    logout: storeLogout,
    setUser,
    isTokenExpired,
    fetchUser: storeFetchUser,
    refetchUser: storeRefetchUser,
  } = useAuthStore();

  const logout = async () => {
    try {
      // Call Next.js logout endpoint to clear cookies
      await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state
      storeLogout();
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.data;

      // Only update the access token in the store
      // We keep the existing (valid) refresh token in the store if needed, 
      // though typically the httpOnly cookie handles the persistence now.
      useAuthStore.getState().updateTokens({
        accessToken: newAccessToken,
        refreshToken: useAuthStore.getState().refreshToken || "", // Keep existing or empty
      });

      return { accessToken: newAccessToken, refreshToken: null };
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      throw error;
    }
  };

  // Fetch user from /auth/me endpoint
  const fetchUser = async () => {
    try {
      await storeFetchUser();
      return useAuthStore.getState().user;
    } catch (error) {
      console.error("User fetch error:", error);
      throw error;
    }
  };

  // Refetch user (for manual refresh after updates)
  const refetchUser = async () => {
    try {
      await storeRefetchUser();
      return useAuthStore.getState().user;
    } catch (error) {
      console.error("User refetch error:", error);
      toast.error("Failed to refresh user data");
      throw error;
    }
  };

  return {
    // State
    isAuthenticated,
    isAuthInitialized,
    isLoadingUser,
    isLoading: !isAuthInitialized || isLoadingUser,
    user,
    accessToken,

    // Auth status checks
    isTokenExpired,
    isLoggedIn: isAuthenticated && !isTokenExpired(),

    // Actions
    login,
    logout,
    refreshToken,
    fetchUser,
    refetchUser,
    setUser,
  };
}
