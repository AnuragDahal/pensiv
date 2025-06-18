"use client";

import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage when component mounts
    // This ensures the store is hydrated properly on client-side
    initializeAuth();
  }, [initializeAuth]);

  // Since middleware handles the authentication redirect logic,
  // we can safely render children directly. If the user reaches this component,
  // they are already authenticated (middleware would have redirected otherwise)
  return <>{children}</>;
}
