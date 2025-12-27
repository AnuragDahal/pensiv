"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated) {
      router.replace("/article");
    }
  }, [isAuthenticated, router]);

  // Don't render auth pages if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
