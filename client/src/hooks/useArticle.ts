import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Article } from "@/types/article";
import { useAuthStore } from "@/store/auth-store";

export function useArticle(articleId: string) {
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const [articleData, setArticleData] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${articleId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setArticleData(response.data.data);
      toast.success(response.data.message || "Article fetched successfully");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch article");
      }
    } finally {
      setLoading(false);
    }
  }, [articleId, accessToken]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return { articleData, loading, error, refresh: fetchArticle };
}
