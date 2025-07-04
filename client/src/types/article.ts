import { Comment } from "./comments";

export interface Article {
  id: string;
  userId: {
    name: string;
    email: string;
    avatar?: string;
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
  estimatedReadTime: number;
  featured?: boolean;
}
