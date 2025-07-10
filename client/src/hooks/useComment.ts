import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export function useComment(commentId: string, initialLikes: number = 0) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getTokens } = useAuthStore();
  const { accessToken } = getTokens();

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`,
        {
          likes: likeCount + (isLiked ? -1 : 1),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(isLiked ? "Comment unliked" : "Comment liked");
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

  const handleSendReply = async (content: string, onSuccess?: () => void) => {
    if (!content.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/reply/${commentId}`,
        { content },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Reply sent successfully!");
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to send reply");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLike,
    likeCount,
    isLiked,
    handleSendReply,
    isLoading,
  };
}
