import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, PAGINATION } from "@/lib/constants";
import type { Article } from "@/types/article";

interface UseArticlesOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  userId?: string;
  autoFetch?: boolean;
}

interface ArticlesResponse {
  posts: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useArticles(options: UseArticlesOptions = {}) {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.ARTICLES_PER_PAGE,
    category,
    search,
    userId,
    autoFetch = true,
  } = options;

  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<ArticlesResponse["pagination"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (category && category !== "all") {
        params.append("category", category);
      }
      if (search) {
        params.append("q", search);
      }
      if (userId) {
        params.append("userId", userId);
      }

      const response = await apiClient.get<ArticlesResponse>(
        `${API_ENDPOINTS.POSTS.LIST}?${params.toString()}`
      );

      setArticles(response.data.posts);
      setPagination(response.data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch articles";
      setError(errorMessage);
      console.error("Error fetching articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, category, search, userId]);

  useEffect(() => {
    if (autoFetch) {
      fetchArticles();
    }
  }, [autoFetch, fetchArticles]);

  return {
    articles,
    pagination,
    isLoading,
    error,
    refetch: fetchArticles,
  };
}

// Hook for fetching user's own articles
export function useMyArticles(status?: "draft" | "published") {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ data: Article[] }>(
        API_ENDPOINTS.POSTS.MY_POSTS
      );

      let filteredArticles = response.data.data;

      if (status) {
        filteredArticles = filteredArticles.filter(
          (article) => article.status === status
        );
      }

      setArticles(filteredArticles);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch your articles";
      setError(errorMessage);
      console.error("Error fetching my articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchMyArticles();
  }, [fetchMyArticles]);

  return {
    articles,
    isLoading,
    error,
    refetch: fetchMyArticles,
  };
}
