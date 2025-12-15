"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

/**
 * Example component showing how to use the auth system
 * This displays user info and provides a refresh button
 */
export function UserProfile() {
  const { user, isLoading, isAuthenticated, refetchUser, logout } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-2">You are not logged in</p>
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    );
  }

  // Show user profile
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
            {getInitials(user.name ?? "U")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={refetchUser}
          className="flex-1"
        >
          Refresh Data
        </Button>
        <Button
          variant="destructive"
          onClick={logout}
          className="flex-1"
        >
          Logout
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
        <p className="font-mono text-gray-600">
          <strong>User ID:</strong> {user.id}
        </p>
      </div>
    </div>
  );
}
