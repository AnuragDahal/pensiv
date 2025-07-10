export interface Comment {
  id: string;
  postId: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
  likes?: number;
  isLikedByUser?: boolean;
  replies?: Comment[];
}
