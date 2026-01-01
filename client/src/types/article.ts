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

/** A reply to a comment (no nested replies) */
export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  likes: LikeInfo;
}

/** A comment (may contain replies) */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  likes: LikeInfo;
  replies: Reply[];
}

// Article interface
export interface Article {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  views: number;
  likesCount: number;
  status: "draft" | "published";
  createdAt: string;
  updatedAt?: string;
  isFeatured?: boolean;
  estimatedReadTime: number;
}
/** Recommended article (lighter payload) */
export interface Recommended {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  coverImage: string;
  shortDescription: string;
  estimatedReadTime: number;
  category: string;
  content: string;
  isFeatured: boolean;
  createdAt: string;
  views: number;
  likesCount: number;
  status: "draft" | "published";
  updatedAt?: string;
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
