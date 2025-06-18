"use client";

import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout: storeLogout,
    // setUser,
    isTokenExpired,
  } = useAuthStore();

  const logout = async () => {
    try {
      // Call logout endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data.data;

      useAuthStore.getState().updateTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      throw error;
    }
  };

  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
  //         { withCredentials: true }
  //       );

  //       const userData = response.data.data;
  //       setUser(userData);
  //       return userData;
  //     } catch (error) {
  //       console.error("Profile fetch error:", error);
  //       throw error;
  //     }
  //   };

  return {
    // State
    isAuthenticated,
    user,
    accessToken,

    // Auth status checks
    isTokenExpired,
    isLoggedIn: isAuthenticated && !isTokenExpired(),

    // Actions
    login,
    logout,
    refreshToken,
    // fetchProfile,
  };
}
