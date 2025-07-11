import { Comment } from "./comments";

export interface ArticleProps {
  id: string;
  userId: {
    name: string;
    email: string;
    avatar: string;
    bio?: string;
  };
  title: string;
  excerpt?: string;
  coverImage: string;
  comments: Comment[];
  category: string;
  content: string;
  tags?: string[];
  date: string;
  likes: number;
  likedBy: string[];
  estimatedReadTime: number;
  featured?: boolean;
  isLikedByUser?: boolean;
}
