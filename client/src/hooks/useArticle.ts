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

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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
    // Optimistic update
    const previousData = data;
    if (!previousData) return;

    const isLiked = previousData.likes.isLikedByUser;
    const newCount = isLiked ? previousData.likes.count - 1 : previousData.likes.count + 1;

    // Apply optimistic state
    setData({
      ...previousData,
      likes: {
        count: newCount,
        isLikedByUser: !isLiked,
      },
    });

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
      
      // Update with server response to be sure, but we already showed the change
       setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likes: {
            count: response.data?.data?.likes?.count ?? prev.likes.count,
            isLikedByUser: response.data?.data?.likes?.isLikedByUser ?? prev.likes.isLikedByUser,
          },
        };
      });
      toast.success(response.data?.message || "Success");
    } catch (err) {
      console.log(err);
      // Revert on error
      setData(previousData);
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
    refetch: () => fetch(true),
  };
};
