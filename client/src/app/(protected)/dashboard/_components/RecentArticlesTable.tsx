"use client";

import { useState } from "react";
import { ArticlesTable } from "@/components/article/ArticlesTable";
import type { Article as ArticleType } from "@/components/article/ArticlesTable";
import type { Article } from "../_hooks/use-dashboard-data";
import apiClient from "@/lib/api/client";
import { toast } from "sonner";

interface RecentArticlesTableProps {
  articles: Article[];
  onArticleDeleted?: () => void;
}

export function RecentArticlesTable({
  articles,
  onArticleDeleted,
}: RecentArticlesTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await apiClient.delete(
        `/api/posts/${id}`
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
