// src/types/article.ts
export interface Author {
  id: string;
  name: string;
  email?: string;
  avatar: string;
}

export interface LikeInfo {
  /** Total number of likes */
  count: number;
  /** true if the currently‑logged‑in user has liked this item */
  isLikedByUser: boolean;
}

/** A single comment reply */
export interface Reply {
  id: string;
  content: string;
  /** ISO date string */
  date: string;
  author: Author;
}

/** A comment (may contain nested replies) */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  likes: LikeInfo;
  replies: Reply[];
}

/** Recommended article (lighter payload) */
export interface Recommended {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

/** Full article payload returned by `/api/posts/:id` */
export interface ArticleResponse {
  post: {
    id: string;
    title: string;
    slug: string;
    coverImage: string;
    content: string; // markdown raw text
    htmlContent: string; // rendered HTML
    tags: string[];
    isFeatured: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    author: Author;
  };
  likes: LikeInfo;
  comments: Comment[];
  recommended: Recommended[];
}
