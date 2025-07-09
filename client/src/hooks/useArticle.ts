import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArticleProps } from "@/types/article";
import { Comment } from "@/types/comments";
import { useAuthStore } from "@/store/auth-store";

// Backend comment interface
interface BackendComment {
  id?: string;
  _id?: string;
  postId: string;
  userId?: {
    name?: string;
    avatar?: string;
  };
  date?: string;
  createdAt?: string;
  content: string;
  likes?: number;
  replies?: BackendReply[];
}

interface BackendReply {
  id?: string;
  _id?: string;
  userId?: {
    name?: string;
    avatar?: string;
  };
  date?: string;
  createdAt?: string;
  content: string;
}

// Transform backend comment data to frontend format
const transformComment = (backendComment: BackendComment): Comment => {
  return {
    id: backendComment.id || backendComment._id || '',
    postId: backendComment.postId,
    name: backendComment.userId?.name || "Anonymous",
    avatar: backendComment.userId?.avatar,
    date: new Date(backendComment.date || backendComment.createdAt || Date.now()).toLocaleDateString(),
    content: backendComment.content,
    likes: backendComment.likes || 0,
    replies: backendComment.replies?.map((reply: BackendReply) => ({
      id: reply.id || reply._id || '',
      postId: backendComment.postId,
      name: reply.userId?.name || "Anonymous",
      avatar: reply.userId?.avatar,
      date: new Date(reply.date || reply.createdAt || Date.now()).toLocaleDateString(),
      content: reply.content,
      likes: 0, // Replies don't have likes in the current backend model
      replies: [], // Nested replies not supported yet
    })) || [],
  };
};

export function useArticle(articleId: string) {
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();
  const [articleData, setArticleData] = useState<ArticleProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated || !isAuthInitialized) {
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${articleId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Transform the backend data to match frontend types
      const backendData = response.data.data;
      const transformedData: ArticleProps = {
        ...backendData,
        excerpt: backendData.shortDescription,
        date: new Date(backendData.createdAt).toLocaleDateString("en-us", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        estimatedReadTime: Math.ceil(backendData.content.split(" ").length / 200),
        comments: backendData.comments?.map(transformComment) || [],
      };

      setArticleData(transformedData);
      toast.success(response.data.message || "Article fetched successfully");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch article");
      }
    } finally {
      setLoading(false);
    }
  }, [articleId, accessToken, isAuthInitialized, isAuthenticated]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return { articleData, loading, error, refresh: fetchArticle };
}
