/**
 * URL validation utilities
 */

export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === "") return true; // Empty is valid (optional field)

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSocialUrl(url: string, platform: string): string | null {
  if (!url || url.trim() === "") return null;

  if (!isValidUrl(url)) {
    return `Invalid ${platform} URL`;
  }

  const urlObj = new URL(url);
  const platformDomains: Record<string, string[]> = {
    github: ["github.com"],
    linkedin: ["linkedin.com", "www.linkedin.com"],
    twitter: ["twitter.com", "x.com", "www.twitter.com", "www.x.com"],
  };

  const validDomains = platformDomains[platform.toLowerCase()];
  if (validDomains && !validDomains.includes(urlObj.hostname)) {
    return `URL must be from ${platform}`;
  }

  return null;
}
