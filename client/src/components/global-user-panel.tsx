"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserPanel } from "./user-panel";

export function GlobalUserPanel() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <UserPanel
      userName={user?.name}
      userEmail={user?.email}
      userImage={user?.avatar}
    />
  );
}
