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
  const { isAuthenticated, isTokenExpired, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    // Only redirect after auth has been initialized
    if (isAuthInitialized && (!isAuthenticated || isTokenExpired())) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isTokenExpired, isAuthInitialized, router, pathname]);

  // Show loading state while auth is initializing
  if (!isAuthInitialized) {
    return null;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated || isTokenExpired()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
