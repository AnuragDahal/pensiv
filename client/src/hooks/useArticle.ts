// src/hooks/useArticle.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "@/store/auth-store";
import { ArticleResponse } from "@/types/article";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/** Hook return shape */
export interface UseArticleResult {
  data?: ArticleResponse;
  loading: boolean;
  error?: string;
  /** Refresh the article (e.g. after a like) */
  refetch: () => void;
  togglePostLikes: (id: string) => void;
}

/**
 * Fetch a single article by its slug or Mongo `_id`.
 * The hook automatically maps the backend response to the TS types above.
 */
export const useArticle = (slug: string): UseArticleResult => {
  const [data, setData] = useState<ArticleResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const resp = await axios.get<{ data: ArticleResponse }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // The backend already returns the shape we defined, so just set it.
      setData(resp.data.data);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? e.message ?? "Failed to load article"
      );
    } finally {
      setLoading(false);
    }
  }, [slug, accessToken]);

  const togglePostLikes = async (id: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likes: {
            count: response.data.data.likes.count,
            isLikedByUser: response.data.data.likes.isLikedByUser,
          },
        };
      });
      toast.success(response.data.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to toggle like");
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    togglePostLikes,
    error,
    refetch: fetch,
  };
};
