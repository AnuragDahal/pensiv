import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

// Re-export utilities for convenience
export { calculateReadingTime, formatReadingTime } from "./utils/reading-time";
export { isValidUrl, validateSocialUrl } from "./utils/validators";


