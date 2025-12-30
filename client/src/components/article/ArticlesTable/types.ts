export interface Article {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage?: string;
  category: string;
  status: "published" | "draft";
  views?: number;
  likesCount?: number;
  createdAt: string;
}

export interface ArticlesTableProps {
  articles: Article[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}
