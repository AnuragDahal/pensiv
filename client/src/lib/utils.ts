import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cookie utilities for auth
export const cookieUtils = {
  set: (name: string, value: string, maxAge: number = 7 * 24 * 60 * 60) => {
    if (typeof document !== "undefined") {
      const secure = location.protocol === "https:";
      document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Secure=${secure}; Max-Age=${maxAge}`;
    }
  },

  get: (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

    return value || null;
  },

  remove: (name: string) => {
    if (typeof document !== "undefined") {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    }
  },
};
