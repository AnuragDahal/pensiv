import { READING_TIME } from "@/lib/constants";

/**
 * Calculate estimated reading time for content
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 0;

  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / READING_TIME.WORDS_PER_MINUTE);

  return minutes;
}

/**
 * Format reading time into human-readable string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return "Less than a minute";
  if (minutes === 1) return "1 minute read";
  return `${minutes} minutes read`;
}
