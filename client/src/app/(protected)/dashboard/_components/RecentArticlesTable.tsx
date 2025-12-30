"use client";

import { useState } from "react";
import { ArticlesTable } from "@/components/article/ArticlesTable";
import type { Article as ArticleType } from "@/components/article/ArticlesTable";
import type { Article } from "../_hooks/use-dashboard-data";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface RecentArticlesTableProps {
  articles: Article[];
  onArticleDeleted?: () => void;
}

export function RecentArticlesTable({
  articles,
  onArticleDeleted,
}: RecentArticlesTableProps) {
  const { accessToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Article deleted successfully");
      if (onArticleDeleted) {
        onArticleDeleted();
      }
    } catch (error) {
      toast.error("Failed to delete article");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedArticles: ArticleType[] = articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    shortDescription: article.shortDescription,
    coverImage: article.coverImage,
    category: article.category,
    status: article.status,
    views: article.views,
    likesCount: article.likesCount,
    createdAt: article.createdAt,
  }));

  return (
    <ArticlesTable
      articles={formattedArticles}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
}
