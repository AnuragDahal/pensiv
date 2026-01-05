import apiClient from "@/lib/api/client";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function usePost(
  postId: string,
  initialLikes: number = 0,
  initialIsLiked: boolean = false
) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when props change (when article data is refetched)
  useEffect(() => {
    setLikeCount(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialLikes, initialIsLiked]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await apiClient.patch(
        `/api/posts/${postId}/like`
      );

      // Update with actual server response
      const { likes, isLiked: serverIsLiked } = response.data.data;
      setLikeCount(likes);
      setIsLiked(serverIsLiked);

      toast.success(
        response.data.message || (serverIsLiked ? "Post liked" : "Post unliked")
      );
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update like");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLike, likeCount, isLiked, isLoading };
}

