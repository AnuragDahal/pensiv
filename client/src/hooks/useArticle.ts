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
  toggleCommentLike: (commentId: string) => void;
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      // Revert on error
      setData(previousData);
      toast.error("Failed to toggle like");
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    const previousData = data;
    if (!previousData) return;

    // Helper to update a comment in the array
    const updateComment = (comments: any[]) => 
      comments.map(c => {
        if (c.id === commentId) {
          const isLiked = c.likes.isLikedByUser;
          return {
            ...c,
            likes: {
              count: isLiked ? c.likes.count - 1 : c.likes.count + 1,
              isLikedByUser: !isLiked
            }
          };
        }
        // Also check replies
        if (c.replies?.length > 0) {
          return {
            ...c,
            replies: c.replies.map((r: any) => {
               if (r.id === commentId) {
                const isLiked = r.likes.isLikedByUser;
                return {
                  ...r,
                  likes: {
                    count: isLiked ? r.likes.count - 1 : r.likes.count + 1,
                    isLikedByUser: !isLiked
                  }
                };
              }
              return r;
            })
          };
        }
        return c;
      });

    // Apply optimistic state
    setData({
      ...previousData,
      comments: updateComment(previousData.comments)
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // We don't necessarily need to set data again from response 
      // unless the backend returns the new count which might be different due to other users.
      // But for speed, optimistic + background refetch is best.
    } catch (err) {
      console.log(err);
      // Revert on error
      setData(previousData);
      toast.error("Failed to toggle comment like");
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    togglePostLikes,
    toggleCommentLike,
    error,
    refetch: () => fetch(true),
  };
};
