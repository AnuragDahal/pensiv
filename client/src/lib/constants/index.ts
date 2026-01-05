/**
 * Application-wide constants
 */

// Article Categories
export const ARTICLE_CATEGORIES = [
  "Technology",
  "Design",
  "Health",
  "Finance",
  "Lifestyle",
  "Productivity",
  "Travel",
  "Food",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

// Programming Languages for Code Highlighting
export const PROGRAMMING_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
] as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  FOLDERS: {
    COVERS: "covers",
    INLINE: "inline",
    AVATARS: "avatars",
  },
} as const;

// Pagination
export const PAGINATION = {
  ARTICLES_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 20,
  DEFAULT_PAGE: 1,
} as const;

// Reading Time Calculation
export const READING_TIME = {
  WORDS_PER_MINUTE: 200,
} as const;

// Article Status
export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type ArticleStatus =
  (typeof ARTICLE_STATUS)[keyof typeof ARTICLE_STATUS];

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  ARTICLES: "/article",
  MY_ARTICLES: "/my-articles",
  CREATE_ARTICLE: "/article/create",
  EDIT_ARTICLE: (id: string) => `/article/edit/${id}`,
  VIEW_ARTICLE: (slug: string) => `/article/${slug}`,
  PROFILE: "/profile",
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_PRIVACY: "/settings/privacy",
  SETTINGS_GENERAL: "/settings/general",
} as const;

// Social Links
export const SOCIAL_LINKS = {
  TWITTER: "https://x.com/anurag_0620",
  INSTAGRAM: "https://www.instagram.com/anurag.dahal.73",
  GITHUB: "https://github.com/AnuragDahal/pensiv",
  MAIL: "mailto:dahal.codecraft@gmail.com",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    UPDATE: "/api/auth/update",
    UPDATE_PASSWORD: "/api/auth/update-password",
  },
  // Posts
  POSTS: {
    LIST: `/api/posts`,
    SEARCH: (query: string) => `/api/posts/${query}`,
    HOME: "/api/posts/home",
    MY_POSTS: "/api/posts/me",
    CREATE: "/api/posts",
    SINGLE: (id: string) => `/api/posts/${id}`,
    EDIT: (id: string) => `/api/posts/edit/${id}`,
    BY_SLUG: (slug: string) => `/api/posts/slug/${slug}`,
    BY_AUTHOR: (userId: string) => `/api/posts/author/${userId}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
  },
  // Comments
  COMMENTS: {
    CREATE: "/api/comments",
    SINGLE: (id: string) => `/api/comments/${id}`,
    LIKE: (id: string) => `/api/comments/${id}/like`,
    REPLY: (id: string) => `/api/comments/reply/${id}`,
  },
} as const;
