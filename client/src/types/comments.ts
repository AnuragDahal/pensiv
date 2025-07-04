export interface Comment {
  id: string;
  postId: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
  likes?: number;
  replies?: Comment[];
}
