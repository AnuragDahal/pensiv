"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isTokenExpired } = useAuthStore();

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!isAuthenticated || isTokenExpired()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isTokenExpired, router, pathname]);

  // Don't render protected content if not authenticated
  if (!isAuthenticated || isTokenExpired()) {
    return null;
  }

  return <>{children}</>;
}
